import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'volunteer' | 'ngo' | 'admin';
  skills?: string[];
  organization?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  phone?: string;
  isAvailable?: boolean;
  assignedDisaster?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenExpirationTimer: NodeJS.Timeout | null = null;
  private readonly apiUrl = `${environment.apiBaseURL}/auth`;
  
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Check if token exists and set auto-logout timer
    if (this.getUserFromStorage()) {
      this.autoRenewToken();
    }
  }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((response: AuthResponse) => {
          if (!response.success) {
            throw new Error(response.message || 'Login failed');
          }
          this.setSession(response);
          this.currentUserSubject.next(response.user);
          return response.user;
        }),
        catchError((error: any) => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }
  
  register(userData: Partial<User>): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        map((response: AuthResponse) => {
          this.setSession(response);
          this.currentUserSubject.next(response.user);
          return response.user;
        }),
        catchError((error: any) => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    this.router.navigate(['/login']);
  }
  
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
  
  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    this.autoRenewToken();
  }
  
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  private autoRenewToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Set timer to renew token 5 minutes before it expires
      const tokenData = this.parseJwt(token);
      if (tokenData && tokenData.exp) {
        const expiresIn = tokenData.exp * 1000 - Date.now() - 5 * 60 * 1000;
        this.tokenExpirationTimer = setTimeout(() => {
          this.renewToken();
        }, expiresIn);
      }
    }
  }
  
  private renewToken(): void {
    // Implement token renewal logic here
    this.logout();
  }
  
  private parseJwt(token: string): { exp: number } | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const tokenData = this.parseJwt(token);
    if (!tokenData || !tokenData.exp) return false;
    
    return tokenData.exp * 1000 > Date.now();
  }
} 