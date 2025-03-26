import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DisasterService, Disaster } from './disaster.service';
import { ResourceService, Resource } from './resource.service';
import { VolunteerService, Volunteer } from './volunteer.service';

export interface MapMarker {
  id: string;
  type: 'disaster' | 'resource' | 'volunteer' | 'shelter' | 'hospital' | 'distribution-center';
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  icon?: string;
  description?: string;
  status?: string;
  severity?: number; // For disasters
  resourceType?: string; // For resources
  quantity?: number; // For resources
  lastUpdated?: Date;
}

export interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  mapTypeId: string;
  mapTypeControl: boolean;
  fullscreenControl: boolean;
  streetViewControl: boolean;
}

export interface HeatmapData {
  positions: Array<{
    lat: number;
    lng: number;
    weight?: number;
  }>;
  radius: number;
  opacity: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private markersSubject = new BehaviorSubject<MapMarker[]>([]);
  public markers$ = this.markersSubject.asObservable();
  
  private configSubject = new BehaviorSubject<MapConfig>({
    center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    zoom: 12,
    mapTypeId: 'roadmap',
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: false
  });
  public config$ = this.configSubject.asObservable();
  
  private heatmapDataSubject = new BehaviorSubject<HeatmapData | null>(null);
  public heatmapData$ = this.heatmapDataSubject.asObservable();
  
  // Mock data for additional map elements
  private mockShelters: MapMarker[] = [
    {
      id: 'shelter-1',
      type: 'shelter',
      position: { lat: 37.7830, lng: -122.4375 },
      title: 'Marina Middle School Shelter',
      description: 'Emergency shelter with capacity for 200 people. Services include food, water, and basic medical attention.',
      status: 'open',
      lastUpdated: new Date('2023-10-15T11:00:00')
    },
    {
      id: 'shelter-2',
      type: 'shelter',
      position: { lat: 37.7841, lng: -122.4100 },
      title: 'Civic Center Evacuation Center',
      description: 'Main evacuation center with capacity for 500 people. Full services available including medical, food, and counseling.',
      status: 'open',
      lastUpdated: new Date('2023-10-15T10:30:00')
    },
    {
      id: 'shelter-3',
      type: 'shelter',
      position: { lat: 37.7694, lng: -122.4270 },
      title: 'Mission Community Center',
      description: 'Community shelter with capacity for 150 people. Basic services available.',
      status: 'near-capacity',
      lastUpdated: new Date('2023-10-15T12:15:00')
    }
  ];
  
  private mockHospitals: MapMarker[] = [
    {
      id: 'hospital-1',
      type: 'hospital',
      position: { lat: 37.7751, lng: -122.4193 },
      title: 'San Francisco General Hospital',
      description: 'Level 1 Trauma Center. Currently at 85% capacity with emergency services fully operational.',
      status: 'operational',
      lastUpdated: new Date('2023-10-15T12:00:00')
    },
    {
      id: 'hospital-2',
      type: 'hospital',
      position: { lat: 37.7841, lng: -122.4406 },
      title: 'UCSF Medical Center',
      description: 'Accepting non-critical patients. Specialized care available.',
      status: 'limited-capacity',
      lastUpdated: new Date('2023-10-15T11:45:00')
    }
  ];
  
  private mockDistributionCenters: MapMarker[] = [
    {
      id: 'dist-1',
      type: 'distribution-center',
      position: { lat: 37.7857, lng: -122.4011 },
      title: 'Embarcadero Resource Distribution',
      description: 'Distribution center for water, food, and emergency supplies. Currently well-stocked.',
      status: 'fully-stocked',
      lastUpdated: new Date('2023-10-15T09:30:00')
    },
    {
      id: 'dist-2',
      type: 'distribution-center',
      position: { lat: 37.7775, lng: -122.4300 },
      title: 'Hayes Valley Supply Point',
      description: 'Distribution of emergency kits and medical supplies. Limited water available.',
      status: 'low-supplies',
      lastUpdated: new Date('2023-10-15T10:15:00')
    }
  ];
  
  constructor(
    private http: HttpClient,
    private disasterService: DisasterService,
    private resourceService: ResourceService,
    private volunteerService: VolunteerService
  ) {
    // Initialize by loading all map data
    this.loadAllMapData();
  }
  
  // Load all map data from various services
  private loadAllMapData(): void {
    // Get all disasters
    this.disasterService.getAllDisasters().subscribe(disasters => {
      // Get all resources
      this.resourceService.getAllResources().subscribe(resources => {
        // Get deployed volunteers
        this.volunteerService.getAllVolunteers().subscribe(volunteers => {
          const deployedVolunteers = volunteers.filter(v => v.deploymentStatus === 'deployed' && v.currentAssignment);
          
          // Convert all entities to map markers
          const markers: MapMarker[] = [
            ...this.disastersToMarkers(disasters),
            ...this.resourcesToMarkers(resources),
            ...this.volunteersToMarkers(deployedVolunteers),
            ...this.mockShelters,
            ...this.mockHospitals,
            ...this.mockDistributionCenters
          ];
          
          this.markersSubject.next(markers);
          
          // Generate heatmap data based on disaster severity and affected areas
          this.generateHeatmapData(disasters);
        });
      });
    });
  }
  
  // Convert disaster objects to map markers
  private disastersToMarkers(disasters: Disaster[]): MapMarker[] {
    return disasters.map(disaster => ({
      id: disaster.id,
      type: 'disaster',
      position: {
        lat: disaster.location.lat,
        lng: disaster.location.lng
      },
      title: disaster.name,
      description: disaster.description,
      status: disaster.status,
      severity: disaster.severity,
      lastUpdated: disaster.lastUpdated
    }));
  }
  
  // Convert resource objects to map markers
  private resourcesToMarkers(resources: Resource[]): MapMarker[] {
    return resources.map(resource => ({
      id: resource.id,
      type: 'resource',
      position: {
        lat: resource.location.lat,
        lng: resource.location.lng
      },
      title: resource.name,
      description: `${resource.quantity} ${resource.unit} of ${resource.type}`,
      status: resource.status,
      resourceType: resource.type,
      quantity: resource.quantity,
      lastUpdated: resource.lastUpdated
    }));
  }
  
  // Convert volunteer objects to map markers
  private volunteersToMarkers(volunteers: Volunteer[]): MapMarker[] {
    return volunteers
      .filter(v => v.currentAssignment) // Only include volunteers with assignments
      .map(volunteer => {
        // In a real app, we would have the volunteer's current location
        // For this mock, we're using a simulated location based on the disaster
        const disasterId = volunteer.currentAssignment?.disasterId;
        let position = { lat: 37.7749, lng: -122.4194 }; // Default to SF
        
        // This would be replaced with actual volunteer location data
        if (disasterId === 'sf-earthquake-2023') {
          // Add a small random offset to avoid stacking markers
          position = {
            lat: 37.7749 + (Math.random() - 0.5) * 0.01,
            lng: -122.4194 + (Math.random() - 0.5) * 0.01
          };
        } else if (disasterId === 'la-wildfire-2023') {
          position = {
            lat: 34.0522 + (Math.random() - 0.5) * 0.01,
            lng: -118.2437 + (Math.random() - 0.5) * 0.01
          };
        } else if (disasterId === 'miami-hurricane-2023') {
          position = {
            lat: 25.7617 + (Math.random() - 0.5) * 0.01,
            lng: -80.1918 + (Math.random() - 0.5) * 0.01
          };
        }
        
        return {
          id: volunteer.id,
          type: 'volunteer',
          position: position,
          title: `${volunteer.firstName} ${volunteer.lastName}`,
          description: `${volunteer.currentAssignment?.role} at ${volunteer.currentAssignment?.location}`,
          status: 'deployed'
        };
      });
  }
  
  // Generate heatmap data based on disaster severity and affected areas
  private generateHeatmapData(disasters: Disaster[]): void {
    if (disasters.length === 0) {
      this.heatmapDataSubject.next(null);
      return;
    }
    
    // For each disaster, create multiple points around the center based on severity and affected area
    const heatmapPositions: Array<{lat: number, lng: number, weight: number}> = [];
    
    disasters.forEach(disaster => {
      // Only generate heatmap for active disasters
      if (disaster.status !== 'active') return;
      
      // Center point with highest intensity
      heatmapPositions.push({
        lat: disaster.location.lat,
        lng: disaster.location.lng,
        weight: disaster.severity * 20 // Scale weight by severity
      });
      
      // Add additional points around the center based on affected area
      const pointCount = Math.min(50, Math.max(10, disaster.affectedArea / 10));
      const radiusInDegrees = Math.sqrt(disaster.affectedArea) * 0.005; // Rough conversion to degrees
      
      for (let i = 0; i < pointCount; i++) {
        // Create a random point within the affected radius
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * radiusInDegrees;
        const offsetLat = Math.sin(angle) * radius;
        const offsetLng = Math.cos(angle) * radius;
        
        // Intensity decreases as we move away from center
        const distanceRatio = Math.sqrt(offsetLat * offsetLat + offsetLng * offsetLng) / radiusInDegrees;
        const weight = disaster.severity * 20 * (1 - distanceRatio);
        
        heatmapPositions.push({
          lat: disaster.location.lat + offsetLat,
          lng: disaster.location.lng + offsetLng,
          weight: weight
        });
      }
    });
    
    this.heatmapDataSubject.next({
      positions: heatmapPositions,
      radius: 20,
      opacity: 0.7
    });
  }
  
  // Get markers filtered by type
  getMarkersByType(type: string): Observable<MapMarker[]> {
    return this.markers$.pipe(
      map(markers => markers.filter(marker => marker.type === type))
    );
  }
  
  // Get markers for a specific disaster
  getMarkersByDisaster(disasterId: string): Observable<MapMarker[]> {
    return this.markers$.pipe(
      map(markers => markers.filter(marker => 
        (marker.type === 'disaster' && marker.id === disasterId) || 
        (marker.type === 'resource' && marker.id.includes(disasterId)) ||
        (marker.type === 'volunteer' && marker.description?.includes(disasterId))
      ))
    );
  }
  
  // Get marker by ID
  getMarkerById(id: string): Observable<MapMarker | undefined> {
    return this.markers$.pipe(
      map(markers => markers.find(marker => marker.id === id))
    );
  }
  
  // Update map configuration (center, zoom, etc.)
  updateMapConfig(config: Partial<MapConfig>): void {
    const currentConfig = this.configSubject.value;
    this.configSubject.next({
      ...currentConfig,
      ...config
    });
  }
  
  // Center map on a specific marker
  centerOnMarker(markerId: string): void {
    const marker = this.markersSubject.value.find(m => m.id === markerId);
    
    if (marker) {
      this.updateMapConfig({
        center: marker.position,
        zoom: 15 // Zoom in closer
      });
    }
  }
  
  // Center map on a disaster area
  centerOnDisaster(disasterId: string): void {
    this.disasterService.getDisasterById(disasterId).subscribe(disaster => {
      if (disaster) {
        // Calculate an appropriate zoom level based on affected area
        const areaRadius = Math.sqrt(disaster.affectedArea);
        const zoom = Math.max(8, Math.min(15, Math.round(14 - Math.log(areaRadius) / Math.log(2))));
        
        this.updateMapConfig({
          center: {
            lat: disaster.location.lat,
            lng: disaster.location.lng
          },
          zoom: zoom
        });
        
        // Generate heatmap specific to this disaster
        this.generateHeatmapData([disaster]);
      }
    });
  }
  
  // Get driving directions to a location (in a real app, this would use Google Maps Directions API)
  getDirectionsTo(markerId: string): Observable<string> {
    const marker = this.markersSubject.value.find(m => m.id === markerId);
    
    if (!marker) {
      return of('Marker not found.');
    }
    
    // In a real app, this would make an API call
    // For this mock, just return a formatted Google Maps URL
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}&travelmode=driving`;
    
    return of(directionsUrl);
  }
  
  // Refresh all map data
  refreshMapData(): void {
    this.loadAllMapData();
  }
  
  // Add a custom marker (e.g., for incident reporting)
  addCustomMarker(marker: Omit<MapMarker, 'id'>): Observable<MapMarker> {
    const newMarker: MapMarker = {
      ...marker,
      id: `custom-${Date.now()}`,
      lastUpdated: new Date()
    };
    
    const currentMarkers = this.markersSubject.value;
    this.markersSubject.next([...currentMarkers, newMarker]);
    
    return of(newMarker);
    
    // In a real implementation, this would also save to the server:
    /*
    return this.http.post<MapMarker>('api/map/markers', newMarker).pipe(
      tap(savedMarker => {
        const currentMarkers = this.markersSubject.value;
        this.markersSubject.next([...currentMarkers, savedMarker]);
      }),
      catchError(error => {
        console.error('Error adding custom marker', error);
        throw error;
      })
    );
    */
  }
  
  // Get a static map image URL for sharing (would use Google Static Maps API in production)
  getStaticMapImageUrl(center: {lat: number, lng: number}, zoom: number, markers: MapMarker[]): string {
    // In a real app, this would generate a proper Google Static Maps API URL with API key
    // This is just a simple mock implementation
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const size = '600x400';
    const centerParam = `${center.lat},${center.lng}`;
    
    let markerParams = '';
    markers.forEach(marker => {
      // Different colors based on marker type
      let color = 'red';
      if (marker.type === 'resource') color = 'blue';
      if (marker.type === 'volunteer') color = 'green';
      if (marker.type === 'shelter') color = 'yellow';
      if (marker.type === 'hospital') color = 'purple';
      
      markerParams += `&markers=color:${color}|${marker.position.lat},${marker.position.lng}`;
    });
    
    // Note: In a real app, you'd add your API key
    return `${baseUrl}?center=${centerParam}&zoom=${zoom}&size=${size}&maptype=roadmap${markerParams}`;
  }
} 