import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url || request.url.startsWith('http')) {
      return next.handle(request);
    }
    if (request.url.includes('api')) {
      request = request.clone({
        setHeaders: {
          Accept: 'application/json',
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          Accept: 'text/html',
        },
      });
    }
    const token: string | null =
      this.localStorage.retrieve('authenticationToken') ??
      this.sessionStorage.retrieve('authenticationToken');
    if (token && request.url.includes('api')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
