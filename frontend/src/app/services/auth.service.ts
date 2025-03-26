import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenExpirationTimer: any;

  // In a production app, this would be an environment variable
  private apiUrl = 'api/auth'; // This would be the actual API URL
  
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
    // For demo purposes, simulate a successful login with mock data
    // In a real app, this would make an HTTP request to your backend
    return of({
      token: 'mock-jwt-token',
      user: {
        id: '123',
        email: email,
        name: 'Demo User',
        role: 'volunteer',
        skills: ['First Aid', 'Driving'],
        phone: '555-555-5555',
        isAvailable: true
      }
    }).pipe(
      map((response: any) => {
        // Store user details and JWT token in local storage
        this.setSession(response);
        this.currentUserSubject.next(response.user);
        return response.user;
      })
    );
    
    // Real implementation would be:
    /*
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          // Store user details and JWT token in local storage
          this.setSession(response);
          this.currentUserSubject.next(response.user);
          return response.user;
        })
      );
    */
  }
  
  register(userData: any): Observable<User> {
    // For demo purposes, simulate a successful registration
    // In a real app, this would make an HTTP request to your backend
    return of({
      token: 'mock-jwt-token',
      user: {
        id: '123',
        email: userData.email,
        name: userData.name,
        role: userData.role,
        skills: userData.skills || [],
        organization: userData.organization,
        phone: userData.phone,
        isAvailable: true
      }
    }).pipe(
      map((response: any) => {
        // Store user details and JWT token in local storage
        this.setSession(response);
        this.currentUserSubject.next(response.user);
        return response.user;
      })
    );
    
    // Real implementation would be:
    /*
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => {
          // Store user details and JWT token in local storage
          this.setSession(response);
          this.currentUserSubject.next(response.user);
          return response.user;
        })
      );
    */
  }
  
  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    this.currentUserSubject.next(null);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
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
  
  refreshToken(): Observable<any> {
    // In a real app, this would make a request to refresh the token
    // For now, we'll just extend the expiration
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    localStorage.setItem('token_expiration', expirationDate.toISOString());
    
    return of({ success: true });
    
    // Real implementation would be:
    /*
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {})
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        catchError(error => {
          this.logout();
          return of(null);
        })
      );
    */
  }
  
  private setSession(authResponse: AuthResponse): void {
    const expirationDate = new Date();
    // Set token to expire in 1 hour
    expirationDate.setHours(expirationDate.getHours() + 1);
    
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    localStorage.setItem('token_expiration', expirationDate.toISOString());
    
    this.autoRenewToken();
  }
  
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    const expirationTime = localStorage.getItem('token_expiration');
    
    if (!userJson || !expirationTime) {
      return null;
    }
    
    // Check if token has expired
    const expirationDate = new Date(expirationTime);
    if (expirationDate <= new Date()) {
      this.logout();
      return null;
    }
    
    return JSON.parse(userJson);
  }
  
  private autoRenewToken(): void {
    const expirationTime = localStorage.getItem('token_expiration');
    if (!expirationTime) {
      return;
    }
    
    const expirationDate = new Date(expirationTime);
    const now = new Date();
    const timeUntilExpiration = expirationDate.getTime() - now.getTime();
    
    // Refresh token 5 minutes before it expires
    const refreshTime = timeUntilExpiration - (5 * 60 * 1000);
    
    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshToken().subscribe();
    }, refreshTime);
  }
} 