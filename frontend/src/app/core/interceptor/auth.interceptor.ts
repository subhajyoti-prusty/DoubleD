import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { WHITE_LIST_URLS } from '../constants/constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const isWhitelisted = WHITE_LIST_URLS.some(path => req.url.includes(path));
    const authToken = this.authService.getAuthToken();
    const isLogoutRequest = req.url.includes('auth/logout');

    if ((authToken && !isWhitelisted) || isLogoutRequest) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        },
        withCredentials: true
      });
      return next.handle(authReq);
    } else {
      const authReq = req.clone({
        withCredentials: true
      });
      return next.handle(authReq);
    }
  }

}