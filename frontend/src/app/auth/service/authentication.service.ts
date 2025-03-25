import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { ILoginModel, ILoginResponse } from '../interface/login.interface';
import { API_ENDPOINTS } from '../../core/constants/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  login(user: ILoginModel): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${API_ENDPOINTS.auth.LOGIN}`, user).pipe(tap(resp => {
      const loginSuccessData = resp?.data;
      this.authService.setUserData(loginSuccessData);
      this.router.navigate(['dashboard']);
    })
    );
  }
}
