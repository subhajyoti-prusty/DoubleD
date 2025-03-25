import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { VolunteerDashboardComponent } from './volunteer-dashboard/volunteer-dashboard.component';
import { NewsDashboardComponent } from './news-dashboard/news-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'volunteer', component: VolunteerDashboardComponent },
      { path: 'news', component: NewsDashboardComponent },
      { path: '', redirectTo: 'news', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 