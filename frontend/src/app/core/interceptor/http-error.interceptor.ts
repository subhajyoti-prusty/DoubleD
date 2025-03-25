import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { ToastService } from '../service/toast.service';
import { AuthService } from '../service/auth.service';
import * as AppEnums from '../enums/app.enum'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private readonly toastService: ToastService,
    private readonly authService: AuthService
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              if (err?.error.status === AppEnums.API_RESPONSE_STATUS.INVALID_TOKEN) {
                this.authService.logout();
              }
              this.showErrorMessage(err);
            } else {
              this.showErrorMessage(err);
            }
          } else {
            this.showErrorMessage(err);
          }
          return throwError(() => err);
        })
      )
  }

  showErrorMessage(err: any) {
    if (err?.error?.message) {
      this.toastService.showErrorToast(`${err.error.status_code}: ${err.error.status}\n${err.error.message}\n${err.url}`)
    } else {
      this.toastService.showErrorToast(`${err.status_code}: ${err.status}\n${err.message}\n${err.url}`)
    }
  }
}