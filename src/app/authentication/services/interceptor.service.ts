import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private _router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem("token");
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          this._router.navigate(['']);
          return throwError("unauthorized");
        }
        return throwError(err);
      }));
  }
}