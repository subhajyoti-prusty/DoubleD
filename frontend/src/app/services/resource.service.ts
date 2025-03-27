import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Resource {
  id: string;
  name: string;
  type: 'food' | 'water' | 'medical' | 'shelter' | 'clothing' | 'other';
  quantity: number;
  unit: string;
  status: 'available' | 'in-transit' | 'deployed' | 'critical-low';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  disasterId?: string;
  ngoId?: string;
  lastUpdated: Date;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  public resources$ = this.resourcesSubject.asObservable();
  
  private apiUrl = `${environment.apiBaseURL}/resources`;
  
  // Mock data
  private mockResources: Resource[] = [
    {
      id: '1',
      name: 'Bottled Water',
      type: 'water',
      quantity: 500,
      unit: 'bottles',
      status: 'available',
      location: {
        lat: 37.7749, 
        lng: -122.4194,
        address: '123 Main St, San Francisco, CA'
      },
      disasterId: 'sf-earthquake-2023',
      ngoId: 'red-cross-123',
      lastUpdated: new Date(),
      notes: 'Pallets of 16.9oz bottles'
    },
    {
      id: '2',
      name: 'Emergency Food Kits',
      type: 'food',
      quantity: 200,
      unit: 'kits',
      status: 'in-transit',
      location: {
        lat: 37.3382, 
        lng: -121.8863,
        address: '456 Oak Ave, San Jose, CA'
      },
      disasterId: 'sf-earthquake-2023',
      ngoId: 'feeding-america-456',
      lastUpdated: new Date(),
      notes: 'Each kit contains 3 days of non-perishable food'
    },
    {
      id: '3',
      name: 'First Aid Supplies',
      type: 'medical',
      quantity: 100,
      unit: 'kits',
      status: 'critical-low',
      location: {
        lat: 37.8044, 
        lng: -122.2712,
        address: '789 Pine St, Oakland, CA'
      },
      disasterId: 'sf-earthquake-2023',
      ngoId: 'doctors-without-borders-789',
      lastUpdated: new Date(),
      notes: 'Basic first aid kits, need resupply urgently'
    },
    {
      id: '4',
      name: 'Emergency Blankets',
      type: 'shelter',
      quantity: 350,
      unit: 'blankets',
      status: 'available',
      location: {
        lat: 37.7749, 
        lng: -122.4194,
        address: '123 Main St, San Francisco, CA'
      },
      disasterId: 'sf-earthquake-2023',
      ngoId: 'salvation-army-101',
      lastUpdated: new Date()
    },
    {
      id: '5',
      name: 'Clothing Donations',
      type: 'clothing',
      quantity: 1000,
      unit: 'items',
      status: 'available',
      location: {
        lat: 37.5485, 
        lng: -121.9886,
        address: '555 Elm St, Fremont, CA'
      },
      disasterId: 'sf-earthquake-2023',
      ngoId: 'goodwill-202',
      lastUpdated: new Date(),
      notes: 'Assorted clothing items, all sizes'
    }
  ];
  
  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.resourcesSubject.next(this.mockResources);
  }
  
  getAllResources(): Observable<Resource[]> {
    // For demo purposes, return mock data
    return of(this.mockResources);
    
    // Real implementation would be:
    /*
    return this.http.get<Resource[]>(`${this.apiUrl}`)
      .pipe(
        tap(resources => {
          this.resourcesSubject.next(resources);
        }),
        catchError(error => {
          console.error('Error fetching resources', error);
          return of([]);
        })
      );
    */
  }
  
  getResourcesByDisaster(disasterId: string): Observable<Resource[]> {
    // Filter mock data by disaster ID
    const filteredResources = this.mockResources.filter(r => r.disasterId === disasterId);
    return of(filteredResources);
    
    // Real implementation would be:
    /*
    return this.http.get<Resource[]>(`${this.apiUrl}/disaster/${disasterId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching resources for disaster ${disasterId}`, error);
          return of([]);
        })
      );
    */
  }
  
  getResourcesByType(type: string): Observable<Resource[]> {
    // Filter mock data by resource type
    const filteredResources = this.mockResources.filter(r => r.type === type);
    return of(filteredResources);
    
    // Real implementation would be:
    /*
    return this.http.get<Resource[]>(`${this.apiUrl}/type/${type}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching resources of type ${type}`, error);
          return of([]);
        })
      );
    */
  }
  
  getResourceById(id: string): Observable<Resource | null> {
    // Find resource by ID in mock data
    const resource = this.mockResources.find(r => r.id === id);
    return of(resource || null);
    
    // Real implementation would be:
    /*
    return this.http.get<Resource>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching resource ${id}`, error);
          return of(null);
        })
      );
    */
  }
  
  createResource(resource: Omit<Resource, 'id' | 'lastUpdated'>): Observable<Resource> {
    // Create a new resource with a generated ID
    const newResource: Resource = {
      ...resource,
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      lastUpdated: new Date()
    };
    
    // Add to mock data
    this.mockResources = [...this.mockResources, newResource];
    this.resourcesSubject.next(this.mockResources);
    
    return of(newResource);
    
    // Real implementation would be:
    /*
    return this.http.post<Resource>(`${this.apiUrl}`, resource)
      .pipe(
        tap(newResource => {
          const currentResources = this.resourcesSubject.value;
          this.resourcesSubject.next([...currentResources, newResource]);
        }),
        catchError(error => {
          console.error('Error creating resource', error);
          throw error;
        })
      );
    */
  }
  
  updateResource(id: string, updates: Partial<Resource>): Observable<Resource> {
    // Find and update resource in mock data
    const index = this.mockResources.findIndex(r => r.id === id);
    
    if (index === -1) {
      return of(null as any);
    }
    
    const updatedResource: Resource = {
      ...this.mockResources[index],
      ...updates,
      lastUpdated: new Date()
    };
    
    this.mockResources = [
      ...this.mockResources.slice(0, index),
      updatedResource,
      ...this.mockResources.slice(index + 1)
    ];
    
    this.resourcesSubject.next(this.mockResources);
    
    return of(updatedResource);
    
    // Real implementation would be:
    /*
    return this.http.patch<Resource>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap(updatedResource => {
          const currentResources = this.resourcesSubject.value;
          const index = currentResources.findIndex(r => r.id === id);
          
          if (index !== -1) {
            const newResources = [...currentResources];
            newResources[index] = updatedResource;
            this.resourcesSubject.next(newResources);
          }
        }),
        catchError(error => {
          console.error(`Error updating resource ${id}`, error);
          throw error;
        })
      );
    */
  }
  
  deleteResource(id: string): Observable<boolean> {
    // Remove resource from mock data
    const index = this.mockResources.findIndex(r => r.id === id);
    
    if (index === -1) {
      return of(false);
    }
    
    this.mockResources = [
      ...this.mockResources.slice(0, index),
      ...this.mockResources.slice(index + 1)
    ];
    
    this.resourcesSubject.next(this.mockResources);
    
    return of(true);
    
    // Real implementation would be:
    /*
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => {
          const currentResources = this.resourcesSubject.value;
          this.resourcesSubject.next(currentResources.filter(r => r.id !== id));
          return true;
        }),
        catchError(error => {
          console.error(`Error deleting resource ${id}`, error);
          return of(false);
        })
      );
    */
  }
  
  // Get resources that are in critical status (low quantity)
  getCriticalResources(): Observable<Resource[]> {
    const criticalResources = this.mockResources.filter(r => r.status === 'critical-low');
    return of(criticalResources);
  }
  
  // Calculate statistics for dashboard
  getResourceStats(): Observable<any> {
    const totalResources = this.mockResources.length;
    const totalQuantity = this.mockResources.reduce((sum, r) => sum + r.quantity, 0);
    
    const byType = this.mockResources.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byStatus = this.mockResources.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return of({
      totalResources,
      totalQuantity,
      byType,
      byStatus,
      criticalCount: byStatus['critical-low'] || 0
    });
  }
} 