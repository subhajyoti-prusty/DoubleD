import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DisasterService } from './disaster.service';
import { ResourceService } from './resource.service';
import { VolunteerService } from './volunteer.service';
import { MessageService } from './message.service';

export interface DashboardSummary {
  activeDisasters: number;
  totalDisasters: number;
  affectedPopulation: number;
  deployedVolunteers: number;
  availableVolunteers: number;
  resourcesAvailable: number;
  resourcesCritical: number;
  criticalAlerts: number;
  shelterCapacity: {
    total: number;
    used: number;
    percentage: number;
  };
  recentMessages: {
    unreadCount: number;
    emergencyCount: number;
  };
}

export interface DisasterOverview {
  id: string;
  name: string;
  type: string;
  status: string;
  severity: number;
  location: string;
  startDate: Date;
  affectedPopulation: number;
  evacuationOrders: boolean;
  resourcesDeployed: number;
  volunteersDeployed: number;
}

export interface ResourceOverview {
  type: string;
  available: number;
  deployed: number;
  critical: number;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  timestamp: Date;
  type: 'disaster' | 'resource' | 'volunteer' | 'message' | 'alert';
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  relatedEntityId?: string;
  relatedEntityType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Mock data for additional dashboard elements
  private mockShelterData = {
    total: 850,
    used: 643,
    percentage: 75.6
  };
  
  private mockRecentActivities: RecentActivity[] = [
    {
      id: 'activity-1',
      timestamp: new Date('2023-10-15T12:30:00'),
      type: 'alert',
      description: 'Aftershock detected in San Francisco (Magnitude 4.2)',
      importance: 'critical',
      relatedEntityId: 'sf-earthquake-2023',
      relatedEntityType: 'disaster'
    },
    {
      id: 'activity-2',
      timestamp: new Date('2023-10-15T12:15:00'),
      type: 'resource',
      description: 'Critical medical supplies deployed to SF General Hospital',
      importance: 'high',
      relatedEntityId: '3',
      relatedEntityType: 'resource'
    },
    {
      id: 'activity-3',
      timestamp: new Date('2023-10-15T12:00:00'),
      type: 'volunteer',
      description: '5 new medical volunteers deployed to Marina District',
      importance: 'medium',
      relatedEntityId: 'vol-2',
      relatedEntityType: 'volunteer'
    },
    {
      id: 'activity-4',
      timestamp: new Date('2023-10-15T11:45:00'),
      type: 'disaster',
      description: 'Evacuation zone expanded in Marina District',
      importance: 'high',
      relatedEntityId: 'sf-earthquake-2023',
      relatedEntityType: 'disaster'
    },
    {
      id: 'activity-5',
      timestamp: new Date('2023-10-15T11:30:00'),
      type: 'message',
      description: 'Emergency broadcast sent to all volunteers in affected areas',
      importance: 'medium',
      relatedEntityId: 'msg-2',
      relatedEntityType: 'message'
    }
  ];
  
  constructor(
    private http: HttpClient,
    private disasterService: DisasterService,
    private resourceService: ResourceService,
    private volunteerService: VolunteerService,
    private messageService: MessageService
  ) {}
  
  // Get summary data for the main dashboard
  getDashboardSummary(): Observable<DashboardSummary> {
    return combineLatest([
      this.disasterService.getDisasterStats(),
      this.resourceService.getResourceStats(),
      this.volunteerService.getVolunteerStats(),
      this.messageService.getUnreadCount(),
      this.messageService.getEmergencyMessages()
    ]).pipe(
      map(([disasterStats, resourceStats, volunteerStats, unreadCount, emergencyMessages]) => {
        return {
          activeDisasters: disasterStats.activeDisasters,
          totalDisasters: disasterStats.totalDisasters,
          affectedPopulation: disasterStats.totalImpacted,
          deployedVolunteers: volunteerStats.deployedVolunteers,
          availableVolunteers: volunteerStats.availableVolunteers,
          resourcesAvailable: resourceStats.totalResources - (resourceStats.byStatus['critical-low'] || 0),
          resourcesCritical: resourceStats.byStatus['critical-low'] || 0,
          criticalAlerts: emergencyMessages.length,
          shelterCapacity: this.mockShelterData,
          recentMessages: {
            unreadCount,
            emergencyCount: emergencyMessages.length
          }
        };
      }),
      catchError(error => {
        console.error('Error fetching dashboard summary', error);
        return of({
          activeDisasters: 0,
          totalDisasters: 0,
          affectedPopulation: 0,
          deployedVolunteers: 0,
          availableVolunteers: 0,
          resourcesAvailable: 0,
          resourcesCritical: 0,
          criticalAlerts: 0,
          shelterCapacity: {
            total: 0,
            used: 0,
            percentage: 0
          },
          recentMessages: {
            unreadCount: 0,
            emergencyCount: 0
          }
        });
      })
    );
  }
  
  // Get overview data for all active disasters
  getActiveDisastersOverview(): Observable<DisasterOverview[]> {
    return combineLatest([
      this.disasterService.getActiveDisasters(),
      this.resourceService.getAllResources(),
      this.volunteerService.getAllVolunteers()
    ]).pipe(
      map(([disasters, resources, volunteers]) => {
        return disasters.map(disaster => {
          // Count resources deployed for this disaster
          const resourcesDeployed = resources.filter(r => r.disasterId === disaster.id).length;
          
          // Count volunteers deployed for this disaster
          const volunteersDeployed = volunteers.filter(
            v => v.deploymentStatus === 'deployed' && 
            v.currentAssignment && 
            v.currentAssignment.disasterId === disaster.id
          ).length;
          
          return {
            id: disaster.id,
            name: disaster.name,
            type: disaster.type,
            status: disaster.status,
            severity: disaster.severity,
            location: `${disaster.location.city || ''}, ${disaster.location.state || ''}`.trim(),
            startDate: disaster.startDate,
            affectedPopulation: disaster.impactedPopulation || 0,
            evacuationOrders: disaster.evacuationOrders || false,
            resourcesDeployed,
            volunteersDeployed
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching active disasters overview', error);
        return of([]);
      })
    );
  }
  
  // Get resource distribution by type
  getResourceOverview(): Observable<ResourceOverview[]> {
    return this.resourceService.getAllResources().pipe(
      map(resources => {
        // Group resources by type
        const resourcesByType = resources.reduce((acc, resource) => {
          if (!acc[resource.type]) {
            acc[resource.type] = {
              available: 0,
              deployed: 0,
              critical: 0,
              total: 0
            };
          }
          
          acc[resource.type].total += 1;
          
          if (resource.status === 'available') {
            acc[resource.type].available += 1;
          } else if (resource.status === 'in-transit' || resource.status === 'deployed') {
            acc[resource.type].deployed += 1;
          } else if (resource.status === 'critical-low') {
            acc[resource.type].critical += 1;
          }
          
          return acc;
        }, {} as Record<string, { available: number, deployed: number, critical: number, total: number }>);
        
        // Convert to array format for the UI
        return Object.keys(resourcesByType).map(type => ({
          type,
          available: resourcesByType[type].available,
          deployed: resourcesByType[type].deployed,
          critical: resourcesByType[type].critical,
          percentage: Math.round((resourcesByType[type].available / resourcesByType[type].total) * 100)
        }));
      }),
      catchError(error => {
        console.error('Error fetching resource overview', error);
        return of([]);
      })
    );
  }
  
  // Get recent activity feed
  getRecentActivities(): Observable<RecentActivity[]> {
    // In a real app, this would combine data from multiple sources
    // For this mock, return the static data
    return of(this.mockRecentActivities);
    
    // Real implementation might look like:
    /*
    return this.http.get<RecentActivity[]>('api/dashboard/activities')
      .pipe(
        catchError(error => {
          console.error('Error fetching recent activities', error);
          return of([]);
        })
      );
    */
  }
  
  // Get critical resources that need attention
  getCriticalResources(): Observable<any[]> {
    return this.resourceService.getCriticalResources().pipe(
      map(resources => resources.map(resource => ({
        id: resource.id,
        name: resource.name,
        type: resource.type,
        quantity: resource.quantity,
        unit: resource.unit,
        location: resource.location.address,
        lastUpdated: resource.lastUpdated
      }))),
      catchError(error => {
        console.error('Error fetching critical resources', error);
        return of([]);
      })
    );
  }
  
  // Get volunteer distribution by skill
  getVolunteersBySkill(): Observable<any> {
    return this.volunteerService.getVolunteerStats().pipe(
      map(stats => {
        return {
          labels: Object.keys(stats.bySkill),
          data: Object.values(stats.bySkill)
        };
      }),
      catchError(error => {
        console.error('Error fetching volunteer skill distribution', error);
        return of({
          labels: [],
          data: []
        });
      })
    );
  }
  
  // Get disaster impact by type (for charts)
  getDisastersByType(): Observable<any> {
    return this.disasterService.getDisasterStats().pipe(
      map(stats => {
        return {
          labels: Object.keys(stats.byType),
          data: Object.values(stats.byType)
        };
      }),
      catchError(error => {
        console.error('Error fetching disaster type distribution', error);
        return of({
          labels: [],
          data: []
        });
      })
    );
  }
  
  // Get time series data for resource deployment (mock data for demo)
  getResourceDeploymentTimeSeries(): Observable<any> {
    // This would normally come from the backend
    const mockData = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Today'],
      datasets: [
        {
          label: 'Food',
          data: [10, 25, 45, 70, 85, 95]
        },
        {
          label: 'Water',
          data: [20, 40, 60, 80, 90, 100]
        },
        {
          label: 'Medical',
          data: [5, 15, 30, 50, 65, 85]
        },
        {
          label: 'Shelter',
          data: [0, 10, 30, 60, 80, 90]
        }
      ]
    };
    
    return of(mockData);
  }
  
  // Get current disaster focus - for displaying a highlighted disaster
  getCurrentDisasterFocus(): Observable<any> {
    return this.disasterService.getCurrentDisaster().pipe(
      map(disaster => {
        if (!disaster) return null;
        
        return {
          id: disaster.id,
          name: disaster.name,
          type: disaster.type,
          severity: disaster.severity,
          location: `${disaster.location.city || ''}, ${disaster.location.state || ''}`.trim(),
          startDate: disaster.startDate,
          description: disaster.description,
          impactedPopulation: disaster.impactedPopulation,
          evacuationOrders: disaster.evacuationOrders,
          emergencyContact: disaster.emergencyContactInfo
        };
      }),
      catchError(error => {
        console.error('Error fetching current disaster focus', error);
        return of(null);
      })
    );
  }
  
  // Get weather forecast for disaster area (mock data for demo)
  getWeatherForecast(location: string): Observable<any> {
    // This would normally call a weather API
    const mockWeatherData = {
      location: 'San Francisco, CA',
      current: {
        temp: 62,
        condition: 'Partly Cloudy',
        windSpeed: 12,
        humidity: 75,
        icon: 'partly-cloudy'
      },
      forecast: [
        { day: 'Today', high: 65, low: 55, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Tomorrow', high: 68, low: 57, condition: 'Sunny', icon: 'sunny' },
        { day: 'Wed', high: 64, low: 56, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Thu', high: 63, low: 54, condition: 'Rain', icon: 'rain' },
        { day: 'Fri', high: 62, low: 53, condition: 'Rain', icon: 'rain' }
      ],
      alerts: [
        { type: 'Aftershock Warning', description: 'Potential aftershocks expected in the next 24 hours' }
      ]
    };
    
    return of(mockWeatherData);
  }
}