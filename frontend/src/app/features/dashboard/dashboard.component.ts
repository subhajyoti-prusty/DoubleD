import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="dashboard-container">
      <p-tabView>
        <p-tabPanel header="Latest News">
          <router-outlet></router-outlet>
        </p-tabPanel>
        <p-tabPanel header="Volunteer Registration">
          <router-outlet></router-outlet>
        </p-tabPanel>
        <p-tabPanel header="Admin Dashboard">
          <router-outlet></router-outlet>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class DashboardComponent {
  items: MenuItem[] = [
    { label: 'Latest News', icon: 'pi pi-globe' },
    { label: 'Volunteer Registration', icon: 'pi pi-users' },
    { label: 'Admin Dashboard', icon: 'pi pi-cog' }
  ];
} 