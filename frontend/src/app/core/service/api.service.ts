import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    skills?: string[];
    organization?: string;
    location?: string;
    phone?: string;
    isAvailable?: boolean;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiBaseURL;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    console.log('Login request:', { ...credentials, password: '***' });
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
        console.log('Login response:', response);
        if (response && response.success) {
          return response;
        } else {
          throw new Error(response?.message || 'Login failed');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        let errorMessage = 'An error occurred during login';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.error?.message || errorMessage;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/refresh-token`, { refreshToken });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  // User endpoints
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/profile`, profileData);
  }

  // Resource endpoints
  getResources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources`);
  }

  createResource(resourceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/resources`, resourceData);
  }

  // Alert endpoints
  getAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts`);
  }

  createAlert(alertData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/alerts`, alertData);
  }

  // NGO endpoints
  getNGOs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ngo`);
  }

  createNGO(ngoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ngo`, ngoData);
  }

  // Notification endpoints
  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications`);
  }

  markNotificationAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/${notificationId}`);
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/unread`);
  }
}
