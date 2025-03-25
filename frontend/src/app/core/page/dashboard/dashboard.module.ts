import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TabViewModule } from 'primeng/tabview';

// Feature Modules
import { NewsModule } from '@app/features/news/modules/news.module';
import { VolunteerModule } from '@app/features/volunteer/module/volunteer.module';
import { AdminModule } from '@app/features/admin/module/admin.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    TabViewModule,
    NewsModule,
    VolunteerModule,
    AdminModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
