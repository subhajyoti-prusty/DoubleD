import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { VolunteerDashboardComponent } from './volunteer-dashboard/volunteer-dashboard.component';
import { NewsDashboardComponent } from './news-dashboard/news-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminDashboardComponent,
    VolunteerDashboardComponent,
    NewsDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule
  ]
})
export class DashboardModule { } 