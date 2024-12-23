import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {StateStorageService} from '../../core/state-storage.service';
import {AuthService} from '../../core/auth.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private stateStorageService: StateStorageService,
    private authService: AuthService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (
            err.status === 401 &&
            err.url &&
            !err.url.includes('api/authenticate')
          ) {
            if (!this.router.routerState.snapshot.url.includes('/login')) {
              this.stateStorageService.storeUrl(
                this.router.routerState.snapshot.url.split('?')[0]
              );
            }
            this.authService.clearAuth();
            this.router.navigate(['/login']);
          }
        },
      })
    );
  }
}
