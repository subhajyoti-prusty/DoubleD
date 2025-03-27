import { Component, OnInit } from '@angular/core';

interface MapMarker {
  id: number;
  type: 'disaster' | 'resource' | 'volunteer';
  name: string;
  lat: number;
  lng: number;
  status: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss'
})
export class MapsComponent implements OnInit {
  markers: MapMarker[] = [];
  selectedMarkerId: number | null = null;
  mapFilters = {
    showDisasters: true,
    showResources: true,
    showVolunteers: true
  };
  
  defaultCenter = { lat: 33.7490, lng: -84.3880 };  // Atlanta, GA
  zoom = 5;

  ngOnInit(): void {
    this.loadMockMapData();
  }

  loadMockMapData(): void {
    this.markers = [
      // Disasters
      { 
        id: 1, 
        type: 'disaster', 
        name: 'Hurricane Alpha', 
        lat: 27.9944, 
        lng: -81.7603, 
        status: 'Active', 
        description: 'Category 3 hurricane with winds up to 120 mph',
        icon: 'assets/icons/hurricane.png'
      },
      { 
        id: 2, 
        type: 'disaster', 
        name: 'Flood Beta', 
        lat: 10.8505, 
        lng: 76.2711, 
        status: 'Monitoring', 
        description: 'Severe flooding affecting coastal areas',
        icon: 'assets/icons/flood.png'
      },
      
      // Resources
      { 
        id: 101, 
        type: 'resource', 
        name: 'Miami Supply Center', 
        lat: 25.7617, 
        lng: -80.1918, 
        status: 'Operational', 
        description: 'Main supply distribution center for South Florida',
        icon: 'assets/icons/supply.png'
      },
      { 
        id: 102, 
        type: 'resource', 
        name: 'Mobile Medical Unit', 
        lat: 26.1224, 
        lng: -80.1373, 
        status: 'Deployed', 
        description: 'Fully equipped mobile medical treatment center',
        icon: 'assets/icons/medical.png'
      },
      
      // Volunteers
      { 
        id: 201, 
        type: 'volunteer', 
        name: 'Search & Rescue Team Alpha', 
        lat: 27.3644, 
        lng: -80.4997, 
        status: 'Active', 
        description: '12 member team with rescue equipment',
        icon: 'assets/icons/volunteer.png'
      }
    ];
  }

  selectMarker(id: number): void {
    this.selectedMarkerId = id;
  }

  getSelectedMarker(): MapMarker | undefined {
    return this.markers.find(m => m.id === this.selectedMarkerId);
  }

  getFilteredMarkers(): MapMarker[] {
    return this.markers.filter(marker => {
      if (marker.type === 'disaster' && !this.mapFilters.showDisasters) return false;
      if (marker.type === 'resource' && !this.mapFilters.showResources) return false;
      if (marker.type === 'volunteer' && !this.mapFilters.showVolunteers) return false;
      return true;
    });
  }

  toggleFilter(filterName: keyof typeof this.mapFilters): void {
    this.mapFilters[filterName] = !this.mapFilters[filterName];
  }
}
