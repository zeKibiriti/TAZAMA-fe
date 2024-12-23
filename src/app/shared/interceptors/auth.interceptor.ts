import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, retry, tap} from 'rxjs';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

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
          'Content-Type': 'application/json',
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
    return next.handle(request).pipe(
      retry(2),
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {

            if (error.status === 401) {
              // console.log('Interceptor error 401: ', error);
              // notify user in case of this error happening
              // this.__notification.error('Error!', 'Something went wrong. Contact System Administrator!');
              if (error.error.detail === 'Invalid token.') {
                // this.authService.clearAuthStorage();
                // this.authService.authenticationState.next(false);
                // this.router.navigate(['auth']);
              }
            } else if (error.status === 400) {
              // console.log('Interceptor error 400: ', error);
              // notify user in case of this error 400 happening
              // this.__notification.error('Error!', 'Something went wrong. Contact System Administrator!');
            }
          } else {
            // notify user in case of other errors happening
            // this.__notification.error('Interceptor Error!', 'Something went wrong. Contact System Administrator!');
            // console.log('Interceptor general error: ', error);
          }
        }
      )
    );
  }
}
