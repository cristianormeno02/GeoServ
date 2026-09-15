import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuFavoritesService } from './menu-favorites.service';
import { MenuFavoritesApiService } from './menu-favorites-api.service';
import { AuthService } from './auth.service';
import { NavItem } from '../layout/nav-item.model';

describe('MenuFavoritesService', () => {
  let service: MenuFavoritesService;
  let apiSpy: jasmine.SpyObj<MenuFavoritesApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const item1: NavItem = { name: 'Mi Dashboard', path: '/dashboard', icon: 'dashboard' };
  const item2: NavItem = { name: 'Órdenes de Servicio', path: '/ordenes-servicio', icon: 'build' };

  beforeEach(() => {
    localStorage.clear();

    apiSpy = jasmine.createSpyObj('MenuFavoritesApiService', ['getFavorites', 'addFavorite', 'removeFavorite']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName', 'getUserRole', 'logout', 'getUserId'], {
      onLogout$: of(undefined)
    });

    apiSpy.getFavorites.and.returnValue(of([]));
    apiSpy.addFavorite.and.returnValue(of(undefined as any));
    apiSpy.removeFavorite.and.returnValue(of(undefined as any));

    TestBed.configureTestingModule({
      providers: [
        MenuFavoritesService,
        { provide: MenuFavoritesApiService, useValue: apiSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(MenuFavoritesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe cargar favoritos desde la API al llamar getFavorites$', (done) => {
    apiSpy.getFavorites.and.returnValue(of(['/dashboard']));

    service.getFavorites$('user-1').subscribe(favorites => {
      if (favorites.length > 0) {
        expect(favorites.length).toBe(1);
        expect(favorites[0].path).toBe('/dashboard');
        expect(service.isFavorite('user-1', item1)).toBeTrue();
        done();
      }
    });
  });

  it('addFavorite() debe aplicar actualización optimista y llamar a api.addFavorite', () => {
    apiSpy.getFavorites.and.returnValue(of([]));
    service.getFavorites('user-1'); // inicializa

    service.addFavorite('user-1', item1);

    expect(service.isFavorite('user-1', item1)).toBeTrue();
    expect(apiSpy.addFavorite).toHaveBeenCalledWith('/dashboard');
  });

  it('addFavorite() debe revertir el estado y notificar error si la API falla', () => {
    apiSpy.addFavorite.and.returnValue(throwError(() => new Error('Network error')));

    service.addFavorite('user-1', item1);

    expect(service.isFavorite('user-1', item1)).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'No se pudo guardar el favorito. Intente nuevamente.',
      'Cerrar',
      jasmine.any(Object)
    );
  });

  it('removeFavorite() debe aplicar actualización optimista y llamar a api.removeFavorite', () => {
    apiSpy.getFavorites.and.returnValue(of(['/dashboard']));
    service.getFavorites('user-1');

    service.removeFavorite('user-1', item1);

    expect(service.isFavorite('user-1', item1)).toBeFalse();
    expect(apiSpy.removeFavorite).toHaveBeenCalledWith('/dashboard');
  });

  it('removeFavorite() debe revertir el estado y notificar error si la API falla', () => {
    apiSpy.addFavorite.and.returnValue(of(undefined as any));
    service.addFavorite('user-1', item1);
    expect(service.isFavorite('user-1', item1)).toBeTrue();

    apiSpy.removeFavorite.and.returnValue(throwError(() => new Error('Delete error')));
    service.removeFavorite('user-1', item1);

    // Debe seguir siendo favorito tras el rollback
    expect(service.isFavorite('user-1', item1)).toBeTrue();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'No se pudo quitar el favorito. Intente nuevamente.',
      'Cerrar',
      jasmine.any(Object)
    );
  });

  it('debe manejar error de carga inicial emitiendo lista vacía sin bloquear', (done) => {
    apiSpy.getFavorites.and.returnValue(throwError(() => new Error('Server 500')));

    service.getFavorites$('user-err').subscribe(favorites => {
      expect(favorites).toEqual([]);
      done();
    });
  });

  it('debe migrar automáticamente favoritos desde localStorage si la API responde vacía', (done) => {
    const legacyKey = 'menu_favorites_user-mig';
    localStorage.setItem(legacyKey, JSON.stringify([item1, item2]));

    apiSpy.getFavorites.and.returnValue(of([]));
    apiSpy.addFavorite.and.returnValue(of(undefined as any));

    service.getFavorites$('user-mig').subscribe(favorites => {
      if (favorites.length > 0) {
        expect(apiSpy.addFavorite).toHaveBeenCalledWith('/dashboard');
        expect(apiSpy.addFavorite).toHaveBeenCalledWith('/ordenes-servicio');
        expect(localStorage.getItem(legacyKey)).toBeNull(); // Se limpió tras éxito
        expect(favorites.length).toBe(2);
        done();
      }
    });
  });

  it('clear() debe vaciar la memoria forzando una nueva llamada a la API en la siguiente consulta', () => {
    apiSpy.getFavorites.and.returnValue(of(['/dashboard']));
    service.getFavorites('user-1');
    expect(apiSpy.getFavorites).toHaveBeenCalledTimes(1);

    // Segunda consulta sin clear no vuelve a llamar a la API
    service.getFavorites('user-1');
    expect(apiSpy.getFavorites).toHaveBeenCalledTimes(1);

    // Al limpiar caché
    service.clear();
    service.getFavorites('user-1');
    expect(apiSpy.getFavorites).toHaveBeenCalledTimes(2);
  });

  it('debe mantener aislamiento entre dos usuarios distintos en el mismo navegador', () => {
    apiSpy.getFavorites.and.returnValue(of([]));
    service.addFavorite('user-A', item1);

    expect(service.isFavorite('user-A', item1)).toBeTrue();
    expect(service.isFavorite('user-B', item1)).toBeFalse();
  });
});
