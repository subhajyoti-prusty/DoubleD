import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from './loading-spinner.service';
import { API_ENDPOINTS } from '../constants/constant';
import { BehaviorSubject, map } from 'rxjs';
import * as AppEnums from '../enums/app.enum'
import { ILoginSuccess } from '../../auth/interface/login.interface';
import { IUserProfile } from '../interface/auth/user-profile.interface';

@Injectable()
export class AuthService {

  currentUserSubject = new BehaviorSubject<boolean>(false);
  currentUser = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient,
    private readonly router: Router,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {
    const isLoggedIn = this.isAuthenticated();
    this.currentUserSubject.next(isLoggedIn);
  }

  setUserData(userData: ILoginSuccess) {
    const userProfile = userData?.userInfo;
    const { userInfo, ...userAuthSData } = userData;
    localStorage.setItem(AppEnums.LOCAL_STOARE_KEYS.USER_AUTH, JSON.stringify(userAuthSData));
    localStorage.setItem(AppEnums.LOCAL_STOARE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    this.currentUserSubject.next(this.isAuthenticated());
  }

  getUserProfile() {
    const userProfileString = localStorage.getItem(AppEnums.LOCAL_STOARE_KEYS.USER_PROFILE);
    const userProfile: IUserProfile = userProfileString ? JSON.parse(userProfileString) : null;
    return userProfile;
  }

  getUserAuthData() {
    const userAuthDataString = localStorage.getItem(AppEnums.LOCAL_STOARE_KEYS.USER_AUTH);
    const userAuthData = userAuthDataString ? JSON.parse(userAuthDataString) : null;
    return userAuthData;
  }

  isAuthenticated() {
    const userAuthData = this.getUserAuthData();
    const isLoggedIn = !!userAuthData;
    return isLoggedIn;
  }

  getAuthToken() {
    const userAuthData = this.getUserAuthData();
    return userAuthData?.id_token ?? null;
  }

  getUserId() {
    const userProfile = this.getUserProfile();
    return userProfile?.userId ?? null;
  }

  clearLocalStorage() {
    localStorage.clear()
  }

  async logout() {
    this.loadingSpinnerService.show();
    const authToken = this.getAuthToken();
    const payLoad = { idToken: authToken };

    this.http.post<any>(`${API_ENDPOINTS.auth.LOGOUT}`, payLoad).pipe(map(resp => resp)).subscribe({
      next: (resp) => {
        this.clearLocalStorage();
        this.currentUserSubject.next(this.isAuthenticated());
        this.router.navigate(['/login']);
      },
      error: (err) => {
      },
      complete: () => {
        this.loadingSpinnerService.hide();
      }
    });
  }


}
