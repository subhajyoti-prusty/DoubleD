import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from './loading-spinner.service';
import { BehaviorSubject } from 'rxjs';
import * as AppEnums from '../enums/app.enum';
import { ILoginSuccess } from '../../auth/interface/login.interface';
import { IUserProfile } from '../interface/auth/user-profile.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSubject = new BehaviorSubject<boolean>(false);
  currentUser = this.currentUserSubject.asObservable();

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {
    const isLoggedIn = this.isAuthenticated();
    this.currentUserSubject.next(isLoggedIn);
  }

  setUserData(userData: ILoginSuccess) {
    const userProfile = userData.user;
    const { user, ...userAuthData } = userData;
    localStorage.setItem(AppEnums.LOCAL_STOARE_KEYS.USER_AUTH, JSON.stringify(userAuthData));
    localStorage.setItem(AppEnums.LOCAL_STOARE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    this.currentUserSubject.next(this.isAuthenticated());
  }

  getUserProfile() {
    const userProfileString = localStorage.getItem(AppEnums.LOCAL_STOARE_KEYS.USER_PROFILE);
    const userProfile = userProfileString ? JSON.parse(userProfileString) : null;
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
    return userAuthData?.token;
  }

  getUserId() {
    const userAuthData = this.getUserAuthData();
    return userAuthData?.userId;
  }

  clearLocalStorage() {
    localStorage.removeItem(AppEnums.LOCAL_STOARE_KEYS.USER_AUTH);
    localStorage.removeItem(AppEnums.LOCAL_STOARE_KEYS.USER_PROFILE);
    this.currentUserSubject.next(false);
  }

  async logout() {
    try {
      this.loadingSpinnerService.show();
      await this.apiService.logout().toPromise();
      this.clearLocalStorage();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      this.clearLocalStorage();
      this.router.navigate(['/login']);
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  async login(credentials: { email: string; password: string }) {
    try {
      this.loadingSpinnerService.show();
      const response = await this.apiService.login(credentials).toPromise();
      if (response) {
        this.setUserData(response);
      }
      return response;
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  async register(userData: any) {
    try {
      this.loadingSpinnerService.show();
      const response = await this.apiService.register(userData).toPromise();
      return response;
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getUserAuthData()?.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await this.apiService.refreshToken(refreshToken).toPromise();
      if (response) {
        this.setUserData(response);
      }
      return response;
    } catch (error) {
      this.clearLocalStorage();
      this.router.navigate(['/login']);
      throw error;
    }
  }
}
