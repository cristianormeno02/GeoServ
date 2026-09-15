import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, forkJoin, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavItem } from '../layout/nav-item.model';
import { findNavItemByPath } from '../config/menu.config';
import { MenuFavoritesApiService } from './menu-favorites-api.service';
import { AuthService } from './auth.service';

/**
 * Servicio singleton para la gestión de ítems de menú favoritos por usuario.
 * Persiste los favoritos en la base de datos a través de MenuFavoritesApiService
 * y mantiene un caché reactivo en memoria (BehaviorSubject) por userId.
 */
@Injectable({
  providedIn: 'root'
})
export class MenuFavoritesService {
  private readonly STORAGE_PREFIX = 'menu_favorites_';
  private api = inject(MenuFavoritesApiService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  /** Mapa interno de userId → BehaviorSubject<NavItem[]> para reactividad por usuario */
  private readonly subjects = new Map<string, BehaviorSubject<NavItem[]>>();
  /** Registra qué usuarios ya cargaron sus favoritos desde la API */
  private readonly loadedUsers = new Set<string>();

  constructor() {
    this.authService.onLogout$?.subscribe(() => {
      this.clear();
    });
  }

  /**
   * Retorna un Observable que emite la lista actualizada de favoritos del usuario.
   */
  getFavorites$(userId: string): Observable<NavItem[]> {
    return this.getSubject(userId).asObservable();
  }

  /**
   * Retorna la lista de ítems favoritos del usuario de forma sincrónica desde memoria.
   */
  getFavorites(userId: string): NavItem[] {
    return this.getSubject(userId).getValue();
  }

  /**
   * Indica si un ítem está marcado como favorito para el usuario dado.
   */
  isFavorite(userId: string, item: NavItem): boolean {
    if (!item?.path) return false;
    return this.getFavorites(userId).some(f => f.path === item.path);
  }

  /**
   * Agrega un ítem a los favoritos del usuario con actualización optimista y rollback ante error.
   */
  addFavorite(userId: string, item: NavItem): void {
    if (!item?.path) return;
    const current = this.getFavorites(userId);
    if (current.some(f => f.path === item.path)) return;

    const updated = [...current, item];
    this.getSubject(userId).next(updated);

    this.api.addFavorite(item.path).subscribe({
      error: (err) => {
        console.error('[MenuFavoritesService] Error al agregar favorito en backend', err);
        this.getSubject(userId).next(current);
        this.showError('No se pudo guardar el favorito. Intente nuevamente.');
      }
    });
  }

  /**
   * Quita un ítem de los favoritos del usuario con actualización optimista y rollback ante error.
   */
  removeFavorite(userId: string, item: NavItem): void {
    if (!item?.path) return;
    const current = this.getFavorites(userId);
    const updated = current.filter(f => f.path !== item.path);

    this.getSubject(userId).next(updated);

    this.api.removeFavorite(item.path).subscribe({
      error: (err) => {
        console.error('[MenuFavoritesService] Error al quitar favorito en backend', err);
        this.getSubject(userId).next(current);
        this.showError('No se pudo quitar el favorito. Intente nuevamente.');
      }
    });
  }

  /**
   * Limpia la caché en memoria para evitar servir datos obsoletos al cambiar de sesión.
   */
  clear(): void {
    this.subjects.clear();
    this.loadedUsers.clear();
  }

  // ─── Helpers privados ──────────────────────────────────────────────────────

  private getSubject(userId: string): BehaviorSubject<NavItem[]> {
    if (!this.subjects.has(userId)) {
      const subject = new BehaviorSubject<NavItem[]>([]);
      this.subjects.set(userId, subject);
      this.loadFromApi(userId, subject);
    }
    return this.subjects.get(userId)!;
  }

  private loadFromApi(userId: string, subject: BehaviorSubject<NavItem[]>): void {
    if (this.loadedUsers.has(userId)) return;
    this.loadedUsers.add(userId);

    this.api.getFavorites().pipe(
      catchError(err => {
        console.warn('[MenuFavoritesService] Error al cargar favoritos desde API', err);
        return of([] as string[]);
      })
    ).subscribe(paths => {
      if (paths.length === 0) {
        this.checkAndMigrateLocalStorage(userId, subject);
      } else {
        const items = paths
          .map(p => findNavItemByPath(p))
          .filter((item): item is NavItem => !!item);
        subject.next(items);
      }
    });
  }

  private checkAndMigrateLocalStorage(userId: string, subject: BehaviorSubject<NavItem[]>): void {
    const raw = this.loadFromStorage(userId);
    if (!raw || raw.length === 0) {
      subject.next([]);
      return;
    }

    const pathsToMigrate = raw
      .map(r => r.path)
      .filter((p): p is string => !!p);

    if (pathsToMigrate.length === 0) {
      this.clearStorage(userId);
      subject.next([]);
      return;
    }

    const requests = pathsToMigrate.map(p => this.api.addFavorite(p));
    forkJoin(requests).pipe(
      catchError(err => {
        console.warn('[MenuFavoritesService] Error en migración desde localStorage', err);
        return of(null);
      })
    ).subscribe(results => {
      if (results !== null) {
        this.clearStorage(userId);
      }
      const items = pathsToMigrate
        .map(p => findNavItemByPath(p))
        .filter((item): item is NavItem => !!item);
      subject.next(items);
    });
  }

  private storageKey(userId: string): string {
    return `${this.STORAGE_PREFIX}${userId}`;
  }

  private loadFromStorage(userId: string): NavItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private clearStorage(userId: string): void {
    try {
      localStorage.removeItem(this.storageKey(userId));
    } catch {
      // Ignorar errores de acceso a almacenamiento
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
