import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor';
import { routes } from './app.routes';
import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authInterceptor = inject(AuthInterceptor);
  return authInterceptor.intercept(req, {
    handle: (internalReq: HttpRequest<any>) => next(internalReq)
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptorFn
    ])),
    AuthInterceptor
  ],
};