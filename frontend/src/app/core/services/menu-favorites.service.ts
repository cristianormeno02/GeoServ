import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavItem } from '../layout/nav-item.model';

/**
 * Servicio singleton para la gestión de ítems de menú favoritos por usuario.
 * Persiste los favoritos en localStorage con la clave `menu_favorites_<userId>`.
 */
@Injectable({
  providedIn: 'root'
})
export class MenuFavoritesService {
  private readonly STORAGE_PREFIX = 'menu_favorites_';

  /** Mapa interno de userId → BehaviorSubject<NavItem[]> para reactividad por usuario */
  private readonly subjects = new Map<string, BehaviorSubject<NavItem[]>>();

  /**
   * Retorna un Observable que emite la lista actualizada de favoritos del usuario.
   * Los suscriptores reciben una nueva lista cada vez que se agrega o quita un favorito.
   */
  getFavorites$(userId: string): Observable<NavItem[]> {
    return this.getSubject(userId).asObservable();
  }

  /**
   * Retorna la lista de ítems favoritos del usuario de forma sincrónica.
   */
  getFavorites(userId: string): NavItem[] {
    return this.getSubject(userId).getValue();
  }

  /**
   * Agrega un ítem a los favoritos del usuario.
   * No agrega duplicados (se compara por `path`).
   */
  addFavorite(userId: string, item: NavItem): void {
    const current = this.getFavorites(userId);
    if (current.some(f => f.path === item.path)) return;
    const updated = [...current, item];
    this.persist(userId, updated);
    this.getSubject(userId).next(updated);
  }

  /**
   * Quita un ítem de los favoritos del usuario (comparado por `path`).
   */
  removeFavorite(userId: string, item: NavItem): void {
    const updated = this.getFavorites(userId).filter(f => f.path !== item.path);
    this.persist(userId, updated);
    this.getSubject(userId).next(updated);
  }

  /**
   * Indica si un ítem está marcado como favorito para el usuario dado.
   */
  isFavorite(userId: string, item: NavItem): boolean {
    return this.getFavorites(userId).some(f => f.path === item.path);
  }

  // ─── Helpers privados ──────────────────────────────────────────────────────

  private getSubject(userId: string): BehaviorSubject<NavItem[]> {
    if (!this.subjects.has(userId)) {
      const stored = this.load(userId);
      this.subjects.set(userId, new BehaviorSubject<NavItem[]>(stored));
    }
    return this.subjects.get(userId)!;
  }

  private storageKey(userId: string): string {
    return `${this.STORAGE_PREFIX}${userId}`;
  }

  private persist(userId: string, items: NavItem[]): void {
    try {
      localStorage.setItem(this.storageKey(userId), JSON.stringify(items));
    } catch (e) {
      console.warn('[MenuFavoritesService] No se pudo persistir en localStorage', e);
    }
  }

  private load(userId: string): NavItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}
