import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { loadingInterceptor, SKIP_GLOBAL_LOADING } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debe invocar show() y hide() en peticiones normales de API', () => {
    httpClient.get('/api/test').subscribe();

    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.hide).not.toHaveBeenCalled();

    const req = httpTestingController.expectOne('/api/test');
    req.flush({});

    expect(loadingServiceSpy.hide).toHaveBeenCalledTimes(1);
  });

  it('no debe invocar show() ni hide() si SKIP_GLOBAL_LOADING es true', () => {
    const context = new HttpContext().set(SKIP_GLOBAL_LOADING, true);
    httpClient.get('/api/silent', { context }).subscribe();

    expect(loadingServiceSpy.show).not.toHaveBeenCalled();

    const req = httpTestingController.expectOne('/api/silent');
    req.flush({});

    expect(loadingServiceSpy.hide).not.toHaveBeenCalled();
  });

  it('no debe invocar show() ni hide() para rutas estáticas o assets', () => {
    httpClient.get('assets/version.json').subscribe();

    expect(loadingServiceSpy.show).not.toHaveBeenCalled();

    const req = httpTestingController.expectOne('assets/version.json');
    req.flush({});

    expect(loadingServiceSpy.hide).not.toHaveBeenCalled();
  });
});
