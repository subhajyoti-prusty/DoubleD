<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';

interface Disaster {
  id: number;
  name: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  date: Date;
  status: 'Active' | 'Resolved' | 'Monitoring';
  lat: number;
  lng: number;
}

interface ResourceStatus {
  type: string;
  available: number;
  allocated: number;
  needed: number;
}
=======
import { Component } from '@angular/core';
>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
<<<<<<< HEAD
export class DashboardComponent implements OnInit {
  // Since we don't have real APIs yet, using mock data
  disasters: Disaster[] = [];
  resources: ResourceStatus[] = [];
  volunteers: { registered: number, active: number, onLocation: number } = { registered: 0, active: 0, onLocation: 0 };
  selectedDisaster: Disaster | null = null;

  ngOnInit() {
    // Mock data loading
    this.loadMockData();
  }

  loadMockData() {
    // Mock disaster data
    this.disasters = [
      { id: 1, name: 'Hurricane Alpha', location: 'Florida, USA', severity: 'High', date: new Date('2023-09-15'), status: 'Active', lat: 27.9944, lng: -81.7603 },
      { id: 2, name: 'Flood Beta', location: 'Kerala, India', severity: 'Medium', date: new Date('2023-08-20'), status: 'Monitoring', lat: 10.8505, lng: 76.2711 },
      { id: 3, name: 'Earthquake Charlie', location: 'California, USA', severity: 'Critical', date: new Date('2023-10-01'), status: 'Active', lat: 36.7783, lng: -119.4179 },
      { id: 4, name: 'Wildfire Delta', location: 'Victoria, Australia', severity: 'High', date: new Date('2023-09-25'), status: 'Active', lat: -37.8136, lng: 144.9631 }
    ];

    // Mock resource data
    this.resources = [
      { type: 'Food', available: 1200, allocated: 800, needed: 2500 },
      { type: 'Water', available: 5000, allocated: 3500, needed: 10000 },
      { type: 'Medical Supplies', available: 350, allocated: 200, needed: 600 },
      { type: 'Shelter', available: 50, allocated: 35, needed: 100 }
    ];

    // Mock volunteer data
    this.volunteers = {
      registered: 568,
      active: 342,
      onLocation: 215
    };

    // Set default selected disaster
    this.selectedDisaster = this.disasters[0];
  }

  getActiveDisastersCount(): number {
    return this.disasters.filter(d => d.status === 'Active').length;
  }

  getTotalResources(): number {
    return this.resources.reduce((total, res) => total + res.available, 0);
  }

  getResourcePercentage(resource: ResourceStatus): number {
    return (resource.available / resource.needed) * 100;
  }

  selectDisaster(disaster: Disaster) {
    this.selectedDisaster = disaster;
  }
=======
export class DashboardComponent {

>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c
}
