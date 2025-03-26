import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Disaster {
  id: string;
  name: string;
  type: 'earthquake' | 'flood' | 'hurricane' | 'tornado' | 'wildfire' | 'other';
  status: 'active' | 'contained' | 'resolved';
  severity: 1 | 2 | 3 | 4 | 5; // 1 is lowest, 5 is highest
  location: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    state?: string;
    country?: string;
  };
  startDate: Date;
  endDate?: Date;
  affectedArea: number; // in square miles or km
  description: string;
  impactedPopulation?: number;
  evacuationOrders?: boolean;
  lastUpdated: Date;
  emergencyContactInfo?: string;
  mediaUrls?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DisasterService {
  private disastersSubject = new BehaviorSubject<Disaster[]>([]);
  public disasters$ = this.disastersSubject.asObservable();
  
  // Mock active disaster for the current session
  private currentDisasterIdSubject = new BehaviorSubject<string>('sf-earthquake-2023');
  public currentDisasterId$ = this.currentDisasterIdSubject.asObservable();
  
  // In a production app, this would be an environment variable
  private apiUrl = 'api/disasters'; // This would be the actual API URL
  
  // Mock data
  private mockDisasters: Disaster[] = [
    {
      id: 'sf-earthquake-2023',
      name: 'San Francisco Earthquake 2023',
      type: 'earthquake',
      status: 'active',
      severity: 4,
      location: {
        lat: 37.7749, 
        lng: -122.4194,
        address: 'San Francisco, CA',
        city: 'San Francisco',
        state: 'California',
        country: 'USA'
      },
      startDate: new Date('2023-10-15T08:30:00'),
      affectedArea: 50,
      description: 'A 6.4 magnitude earthquake struck the San Francisco Bay Area causing significant damage to infrastructure and buildings in the downtown and Marina districts.',
      impactedPopulation: 150000,
      evacuationOrders: true,
      lastUpdated: new Date(),
      emergencyContactInfo: 'Emergency Operations Center: (415) 555-7890',
      mediaUrls: [
        'https://example.com/sf-earthquake-image1.jpg',
        'https://example.com/sf-earthquake-image2.jpg'
      ]
    },
    {
      id: 'la-wildfire-2023',
      name: 'Los Angeles County Wildfire',
      type: 'wildfire',
      status: 'contained',
      severity: 3,
      location: {
        lat: 34.0522, 
        lng: -118.2437,
        address: 'Angeles National Forest, CA',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA'
      },
      startDate: new Date('2023-09-05T14:15:00'),
      affectedArea: 8500,
      description: 'A fast-moving wildfire in the Angeles National Forest has consumed over 8,500 acres of land and threatened numerous residential areas in northern Los Angeles County.',
      impactedPopulation: 25000,
      evacuationOrders: true,
      lastUpdated: new Date(),
      emergencyContactInfo: 'LA County Fire Department: (213) 555-4567',
      mediaUrls: [
        'https://example.com/la-wildfire-image1.jpg',
        'https://example.com/la-wildfire-image2.jpg'
      ]
    },
    {
      id: 'miami-hurricane-2023',
      name: 'Hurricane Maria - Miami',
      type: 'hurricane',
      status: 'active',
      severity: 5,
      location: {
        lat: 25.7617, 
        lng: -80.1918,
        address: 'Miami, FL',
        city: 'Miami',
        state: 'Florida',
        country: 'USA'
      },
      startDate: new Date('2023-08-20T06:00:00'),
      affectedArea: 12000,
      description: 'Hurricane Maria, a Category 4 hurricane, made landfall in southern Florida causing widespread flooding and wind damage throughout the Miami metropolitan area.',
      impactedPopulation: 500000,
      evacuationOrders: true,
      lastUpdated: new Date(),
      emergencyContactInfo: 'Miami-Dade Emergency Management: (305) 555-1234',
      mediaUrls: [
        'https://example.com/miami-hurricane-image1.jpg',
        'https://example.com/miami-hurricane-image2.jpg'
      ]
    }
  ];
  
  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.disastersSubject.next(this.mockDisasters);
  }
  
  getAllDisasters(): Observable<Disaster[]> {
    // For demo purposes, return mock data
    return of(this.mockDisasters);
    
    // Real implementation would be:
    /*
    return this.http.get<Disaster[]>(`${this.apiUrl}`)
      .pipe(
        tap(disasters => {
          this.disastersSubject.next(disasters);
        }),
        catchError(error => {
          console.error('Error fetching disasters', error);
          return of([]);
        })
      );
    */
  }
  
  getActiveDisasters(): Observable<Disaster[]> {
    // Filter mock data to active disasters
    const activeDisasters = this.mockDisasters.filter(d => d.status === 'active');
    return of(activeDisasters);
    
    // Real implementation would be:
    /*
    return this.http.get<Disaster[]>(`${this.apiUrl}/status/active`)
      .pipe(
        catchError(error => {
          console.error('Error fetching active disasters', error);
          return of([]);
        })
      );
    */
  }
  
  getDisastersByType(type: string): Observable<Disaster[]> {
    // Filter mock data by disaster type
    const filteredDisasters = this.mockDisasters.filter(d => d.type === type);
    return of(filteredDisasters);
    
    // Real implementation would be:
    /*
    return this.http.get<Disaster[]>(`${this.apiUrl}/type/${type}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching disasters of type ${type}`, error);
          return of([]);
        })
      );
    */
  }
  
  getDisasterById(id: string): Observable<Disaster | null> {
    // Find disaster by ID in mock data
    const disaster = this.mockDisasters.find(d => d.id === id);
    return of(disaster || null);
    
    // Real implementation would be:
    /*
    return this.http.get<Disaster>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching disaster ${id}`, error);
          return of(null);
        })
      );
    */
  }
  
  // Set current active disaster for the session
  setCurrentDisaster(id: string): void {
    this.currentDisasterIdSubject.next(id);
  }
  
  // Get current active disaster details
  getCurrentDisaster(): Observable<Disaster | null> {
    return this.currentDisasterId$.pipe(
      map(id => this.mockDisasters.find(d => d.id === id) || null)
    );
  }
  
  createDisaster(disaster: Omit<Disaster, 'id' | 'lastUpdated'>): Observable<Disaster> {
    // Create a new disaster with a generated ID
    const newDisaster: Disaster = {
      ...disaster,
      id: `${disaster.location.city?.toLowerCase() || 'loc'}-${disaster.type}-${new Date().getFullYear()}`,
      lastUpdated: new Date()
    };
    
    // Add to mock data
    this.mockDisasters = [...this.mockDisasters, newDisaster];
    this.disastersSubject.next(this.mockDisasters);
    
    return of(newDisaster);
    
    // Real implementation would be:
    /*
    return this.http.post<Disaster>(`${this.apiUrl}`, disaster)
      .pipe(
        tap(newDisaster => {
          const currentDisasters = this.disastersSubject.value;
          this.disastersSubject.next([...currentDisasters, newDisaster]);
        }),
        catchError(error => {
          console.error('Error creating disaster', error);
          throw error;
        })
      );
    */
  }
  
  updateDisaster(id: string, updates: Partial<Disaster>): Observable<Disaster> {
    // Find and update disaster in mock data
    const index = this.mockDisasters.findIndex(d => d.id === id);
    
    if (index === -1) {
      return of(null as any);
    }
    
    const updatedDisaster: Disaster = {
      ...this.mockDisasters[index],
      ...updates,
      lastUpdated: new Date()
    };
    
    this.mockDisasters = [
      ...this.mockDisasters.slice(0, index),
      updatedDisaster,
      ...this.mockDisasters.slice(index + 1)
    ];
    
    this.disastersSubject.next(this.mockDisasters);
    
    return of(updatedDisaster);
    
    // Real implementation would be:
    /*
    return this.http.patch<Disaster>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap(updatedDisaster => {
          const currentDisasters = this.disastersSubject.value;
          const index = currentDisasters.findIndex(d => d.id === id);
          
          if (index !== -1) {
            const newDisasters = [...currentDisasters];
            newDisasters[index] = updatedDisaster;
            this.disastersSubject.next(newDisasters);
          }
        }),
        catchError(error => {
          console.error(`Error updating disaster ${id}`, error);
          throw error;
        })
      );
    */
  }
  
  // Get disaster statistics for dashboard
  getDisasterStats(): Observable<any> {
    const totalDisasters = this.mockDisasters.length;
    const activeDisasters = this.mockDisasters.filter(d => d.status === 'active').length;
    
    const byType = this.mockDisasters.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySeverity = this.mockDisasters.reduce((acc, d) => {
      acc[d.severity] = (acc[d.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalAffectedArea = this.mockDisasters.reduce((sum, d) => sum + d.affectedArea, 0);
    const totalImpacted = this.mockDisasters.reduce((sum, d) => sum + (d.impactedPopulation || 0), 0);
    
    return of({
      totalDisasters,
      activeDisasters,
      byType,
      bySeverity,
      totalAffectedArea,
      totalImpacted
    });
  }
} 