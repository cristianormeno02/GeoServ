import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MenuFavoritesApiService } from './menu-favorites-api.service';
import { environment } from '../../../environments/environment';

describe('MenuFavoritesApiService', () => {
  let service: MenuFavoritesApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/user-menu-favorites`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuFavoritesApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MenuFavoritesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getFavorites() debe hacer GET a /api/user-menu-favorites y retornar paths', () => {
    const mockPaths = ['/dashboard', '/ordenes-servicio'];

    service.getFavorites().subscribe(paths => {
      expect(paths).toEqual(mockPaths);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaths);
  });

  it('addFavorite() debe hacer POST a /api/user-menu-favorites con body { path }', () => {
    const testPath = '/proyectos';

    service.addFavorite(testPath).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ path: testPath });
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('removeFavorite() debe hacer DELETE con query parameter ?path=', () => {
    const testPath = '/dashboard/operativo';

    service.removeFavorite(testPath).subscribe();

    const req = httpMock.expectOne(request => request.url === baseUrl && request.params.get('path') === testPath);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.params.get('path')).toBe(testPath);
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
