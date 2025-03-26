import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  items = [
    { label: 'Latest News', icon: 'pi pi-newspaper' },
    { label: 'Volunteer Registration', icon: 'pi pi-users' },
    { label: 'Admin Dashboard', icon: 'pi pi-cog' }
  ];
}
