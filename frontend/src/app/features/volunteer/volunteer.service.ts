import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Volunteer } from './volunteer.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private apiUrl = 'http://localhost:3000/api/volunteers'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Get all volunteers
  getVolunteers(): Observable<Volunteer[]> {
    return this.http.get<Volunteer[]>(this.apiUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Get a single volunteer by ID
  getVolunteer(id: number): Observable<Volunteer> {
    return this.http.get<Volunteer>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Create a new volunteer
  createVolunteer(volunteer: Omit<Volunteer, 'id'>): Observable<Volunteer> {
    return this.http.post<Volunteer>(this.apiUrl, volunteer)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing volunteer
  updateVolunteer(id: number, volunteer: Partial<Volunteer>): Observable<Volunteer> {
    return this.http.put<Volunteer>(`${this.apiUrl}/${id}`, volunteer)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a volunteer
  deleteVolunteer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
} 