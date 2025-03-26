import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Volunteer {
  id: string;
  userId?: string; // If linked to a user account
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  state: string;
  zipCode: string;
  skills: string[];
  availability: {
    weekdays: boolean;
    weekends: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  certifications?: string[];
  languages?: string[];
  hasVehicle: boolean;
  medicalTraining: boolean;
  background: {
    isCompleted: boolean;
    dateCompleted?: Date;
    status?: 'pending' | 'approved' | 'denied';
  };
  preferredDisasterTypes?: ('earthquake' | 'flood' | 'hurricane' | 'tornado' | 'wildfire' | 'other')[];
  registrationDate: Date;
  deploymentStatus: 'available' | 'deployed' | 'unavailable';
  currentAssignment?: {
    disasterId: string;
    assignmentDate: Date;
    role: string;
    location: string;
  };
  deploymentHistory?: {
    disasterId: string;
    startDate: Date;
    endDate?: Date;
    role: string;
    location: string;
    hoursLogged: number;
    feedback?: string;
  }[];
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private volunteersSubject = new BehaviorSubject<Volunteer[]>([]);
  public volunteers$ = this.volunteersSubject.asObservable();
  
  // In a production app, this would be an environment variable
  private apiUrl = 'api/volunteers'; // This would be the actual API URL
  
  // Mock data
  private mockVolunteers: Volunteer[] = [
    {
      id: 'vol-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(415) 555-1234',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      skills: ['first aid', 'search and rescue', 'disaster assessment'],
      availability: {
        weekdays: true,
        weekends: true,
        mornings: true,
        afternoons: true,
        evenings: false
      },
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Spouse',
        phone: '(415) 555-5678'
      },
      certifications: ['Red Cross First Aid', 'CPR'],
      languages: ['English', 'Spanish'],
      hasVehicle: true,
      medicalTraining: true,
      background: {
        isCompleted: true,
        dateCompleted: new Date('2023-01-15'),
        status: 'approved'
      },
      preferredDisasterTypes: ['earthquake', 'wildfire'],
      registrationDate: new Date('2022-11-10'),
      deploymentStatus: 'deployed',
      currentAssignment: {
        disasterId: 'sf-earthquake-2023',
        assignmentDate: new Date('2023-10-15T12:00:00'),
        role: 'Medical Support',
        location: 'San Francisco General Hospital'
      },
      deploymentHistory: [
        {
          disasterId: 'la-wildfire-2023',
          startDate: new Date('2023-09-05'),
          endDate: new Date('2023-09-12'),
          role: 'Evacuation Assistant',
          location: 'Angeles National Forest',
          hoursLogged: 56,
          feedback: 'Excellent work coordinating evacuations.'
        }
      ],
      notes: 'Fluent in Spanish, preferred for translation duties.'
    },
    {
      id: 'vol-2',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      phone: '(510) 555-9012',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94610',
      skills: ['medical assistance', 'shelter management', 'counseling'],
      availability: {
        weekdays: false,
        weekends: true,
        mornings: false,
        afternoons: true,
        evenings: true
      },
      emergencyContact: {
        name: 'Carlos Garcia',
        relationship: 'Brother',
        phone: '(510) 555-3456'
      },
      languages: ['English', 'Spanish', 'Portuguese'],
      hasVehicle: false,
      medicalTraining: true,
      background: {
        isCompleted: true,
        dateCompleted: new Date('2023-02-20'),
        status: 'approved'
      },
      preferredDisasterTypes: ['hurricane', 'flood'],
      registrationDate: new Date('2022-12-05'),
      deploymentStatus: 'available',
      deploymentHistory: [
        {
          disasterId: 'miami-hurricane-2023',
          startDate: new Date('2023-08-20'),
          endDate: new Date('2023-08-27'),
          role: 'Medical Support',
          location: 'Miami Emergency Shelter',
          hoursLogged: 48,
          feedback: 'Excellent medical skills and communication with victims.'
        }
      ]
    },
    {
      id: 'vol-3',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      phone: '(408) 555-7890',
      address: '789 Oak Avenue',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95123',
      skills: ['heavy equipment operation', 'construction', 'logistics'],
      availability: {
        weekdays: true,
        weekends: false,
        mornings: true,
        afternoons: true,
        evenings: false
      },
      emergencyContact: {
        name: 'Sarah Johnson',
        relationship: 'Wife',
        phone: '(408) 555-2345'
      },
      certifications: ['Heavy Equipment Operator License', 'Hazardous Materials Handling'],
      hasVehicle: true,
      medicalTraining: false,
      background: {
        isCompleted: true,
        dateCompleted: new Date('2023-03-10'),
        status: 'approved'
      },
      preferredDisasterTypes: ['earthquake', 'tornado'],
      registrationDate: new Date('2023-01-20'),
      deploymentStatus: 'deployed',
      currentAssignment: {
        disasterId: 'sf-earthquake-2023',
        assignmentDate: new Date('2023-10-16T08:00:00'),
        role: 'Debris Removal Coordinator',
        location: 'Marina District'
      }
    }
  ];
  
  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.volunteersSubject.next(this.mockVolunteers);
  }
  
  getAllVolunteers(): Observable<Volunteer[]> {
    // For demo purposes, return mock data
    return of(this.mockVolunteers);
    
    // Real implementation would be:
    /*
    return this.http.get<Volunteer[]>(`${this.apiUrl}`)
      .pipe(
        tap(volunteers => {
          this.volunteersSubject.next(volunteers);
        }),
        catchError(error => {
          console.error('Error fetching volunteers', error);
          return of([]);
        })
      );
    */
  }
  
  getAvailableVolunteers(): Observable<Volunteer[]> {
    // Filter mock data to available volunteers
    const availableVolunteers = this.mockVolunteers.filter(v => v.deploymentStatus === 'available');
    return of(availableVolunteers);
    
    // Real implementation would be:
    /*
    return this.http.get<Volunteer[]>(`${this.apiUrl}/status/available`)
      .pipe(
        catchError(error => {
          console.error('Error fetching available volunteers', error);
          return of([]);
        })
      );
    */
  }
  
  getVolunteersByDisaster(disasterId: string): Observable<Volunteer[]> {
    // Filter mock data by current assignment disasterId
    const assignedVolunteers = this.mockVolunteers.filter(
      v => v.currentAssignment && v.currentAssignment.disasterId === disasterId
    );
    return of(assignedVolunteers);
    
    // Real implementation would be:
    /*
    return this.http.get<Volunteer[]>(`${this.apiUrl}/disaster/${disasterId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching volunteers for disaster ${disasterId}`, error);
          return of([]);
        })
      );
    */
  }
  
  getVolunteersWithSkill(skill: string): Observable<Volunteer[]> {
    // Filter mock data by skill
    const skilledVolunteers = this.mockVolunteers.filter(
      v => v.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    return of(skilledVolunteers);
    
    // Real implementation would be:
    /*
    return this.http.get<Volunteer[]>(`${this.apiUrl}/skill/${encodeURIComponent(skill)}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching volunteers with skill ${skill}`, error);
          return of([]);
        })
      );
    */
  }
  
  getVolunteerById(id: string): Observable<Volunteer | null> {
    // Find volunteer by ID in mock data
    const volunteer = this.mockVolunteers.find(v => v.id === id);
    return of(volunteer || null);
    
    // Real implementation would be:
    /*
    return this.http.get<Volunteer>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching volunteer ${id}`, error);
          return of(null);
        })
      );
    */
  }
  
  registerVolunteer(volunteer: Omit<Volunteer, 'id' | 'registrationDate' | 'deploymentStatus'>): Observable<Volunteer> {
    // Create a new volunteer with a generated ID
    const newVolunteer: Volunteer = {
      ...volunteer,
      id: `vol-${this.mockVolunteers.length + 1}`,
      registrationDate: new Date(),
      deploymentStatus: 'available'
    };
    
    // Add to mock data
    this.mockVolunteers = [...this.mockVolunteers, newVolunteer];
    this.volunteersSubject.next(this.mockVolunteers);
    
    return of(newVolunteer);
    
    // Real implementation would be:
    /*
    return this.http.post<Volunteer>(`${this.apiUrl}/register`, volunteer)
      .pipe(
        tap(newVolunteer => {
          const currentVolunteers = this.volunteersSubject.value;
          this.volunteersSubject.next([...currentVolunteers, newVolunteer]);
        }),
        catchError(error => {
          console.error('Error registering volunteer', error);
          throw error;
        })
      );
    */
  }
  
  updateVolunteer(id: string, updates: Partial<Volunteer>): Observable<Volunteer> {
    // Find and update volunteer in mock data
    const index = this.mockVolunteers.findIndex(v => v.id === id);
    
    if (index === -1) {
      return of(null as any);
    }
    
    const updatedVolunteer: Volunteer = {
      ...this.mockVolunteers[index],
      ...updates
    };
    
    this.mockVolunteers = [
      ...this.mockVolunteers.slice(0, index),
      updatedVolunteer,
      ...this.mockVolunteers.slice(index + 1)
    ];
    
    this.volunteersSubject.next(this.mockVolunteers);
    
    return of(updatedVolunteer);
    
    // Real implementation would be:
    /*
    return this.http.patch<Volunteer>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap(updatedVolunteer => {
          const currentVolunteers = this.volunteersSubject.value;
          const index = currentVolunteers.findIndex(v => v.id === id);
          
          if (index !== -1) {
            const newVolunteers = [...currentVolunteers];
            newVolunteers[index] = updatedVolunteer;
            this.volunteersSubject.next(newVolunteers);
          }
        }),
        catchError(error => {
          console.error(`Error updating volunteer ${id}`, error);
          throw error;
        })
      );
    */
  }
  
  assignVolunteer(volunteerId: string, assignment: { 
    disasterId: string, 
    role: string, 
    location: string 
  }): Observable<Volunteer> {
    // Find and update volunteer's assignment in mock data
    const index = this.mockVolunteers.findIndex(v => v.id === volunteerId);
    
    if (index === -1) {
      return of(null as any);
    }
    
    const updatedVolunteer: Volunteer = {
      ...this.mockVolunteers[index],
      deploymentStatus: 'deployed',
      currentAssignment: {
        ...assignment,
        assignmentDate: new Date()
      }
    };
    
    this.mockVolunteers = [
      ...this.mockVolunteers.slice(0, index),
      updatedVolunteer,
      ...this.mockVolunteers.slice(index + 1)
    ];
    
    this.volunteersSubject.next(this.mockVolunteers);
    
    return of(updatedVolunteer);
    
    // Real implementation would be:
    /*
    return this.http.post<Volunteer>(`${this.apiUrl}/${volunteerId}/assign`, assignment)
      .pipe(
        tap(updatedVolunteer => {
          const currentVolunteers = this.volunteersSubject.value;
          const index = currentVolunteers.findIndex(v => v.id === volunteerId);
          
          if (index !== -1) {
            const newVolunteers = [...currentVolunteers];
            newVolunteers[index] = updatedVolunteer;
            this.volunteersSubject.next(newVolunteers);
          }
        }),
        catchError(error => {
          console.error(`Error assigning volunteer ${volunteerId}`, error);
          throw error;
        })
      );
    */
  }
  
  completeAssignment(volunteerId: string, feedback?: string, hoursLogged?: number): Observable<Volunteer> {
    // Find volunteer and complete their current assignment
    const index = this.mockVolunteers.findIndex(v => v.id === volunteerId);
    
    if (index === -1 || !this.mockVolunteers[index].currentAssignment) {
      return of(null as any);
    }
    
    const volunteer = this.mockVolunteers[index];
    const currentAssignment = volunteer.currentAssignment!;
    
    // Create history entry from current assignment
    const historyEntry = {
      disasterId: currentAssignment.disasterId,
      startDate: currentAssignment.assignmentDate,
      endDate: new Date(),
      role: currentAssignment.role,
      location: currentAssignment.location,
      hoursLogged: hoursLogged || 0,
      feedback
    };
    
    // Update volunteer with completed assignment
    const updatedVolunteer: Volunteer = {
      ...volunteer,
      deploymentStatus: 'available',
      currentAssignment: undefined,
      deploymentHistory: [
        ...(volunteer.deploymentHistory || []),
        historyEntry
      ]
    };
    
    this.mockVolunteers = [
      ...this.mockVolunteers.slice(0, index),
      updatedVolunteer,
      ...this.mockVolunteers.slice(index + 1)
    ];
    
    this.volunteersSubject.next(this.mockVolunteers);
    
    return of(updatedVolunteer);
    
    // Real implementation would be:
    /*
    return this.http.post<Volunteer>(
      `${this.apiUrl}/${volunteerId}/complete-assignment`, 
      { feedback, hoursLogged }
    ).pipe(
      tap(updatedVolunteer => {
        const currentVolunteers = this.volunteersSubject.value;
        const index = currentVolunteers.findIndex(v => v.id === volunteerId);
        
        if (index !== -1) {
          const newVolunteers = [...currentVolunteers];
          newVolunteers[index] = updatedVolunteer;
          this.volunteersSubject.next(newVolunteers);
        }
      }),
      catchError(error => {
        console.error(`Error completing assignment for volunteer ${volunteerId}`, error);
        throw error;
      })
    );
    */
  }
  
  // Get volunteer statistics for dashboard
  getVolunteerStats(): Observable<any> {
    const totalVolunteers = this.mockVolunteers.length;
    const availableVolunteers = this.mockVolunteers.filter(v => v.deploymentStatus === 'available').length;
    const deployedVolunteers = this.mockVolunteers.filter(v => v.deploymentStatus === 'deployed').length;
    
    const bySkill = this.mockVolunteers.reduce((acc, v) => {
      v.skills.forEach(skill => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const volunteersByDisaster = this.mockVolunteers.reduce((acc, v) => {
      if (v.currentAssignment) {
        const disasterId = v.currentAssignment.disasterId;
        acc[disasterId] = (acc[disasterId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return of({
      totalVolunteers,
      availableVolunteers,
      deployedVolunteers,
      bySkill,
      volunteersByDisaster
    });
  }
} 