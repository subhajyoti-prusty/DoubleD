import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [NoAuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./core/page/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard]
  },
  {
    path: 'news',
    loadChildren: () => import('./features/news/news.module').then(m => m.NewsModule), canActivate: [AuthGuard]
  },
  {
    path: 'maps',
    loadChildren: () => import('./features/maps/maps.module').then(m => m.MapsModule), canActivate: [AuthGuard]
  },
  {
    path: 'volunteers',
    loadChildren: () => import('./features/volunteer/volunteer.module').then(m => m.VolunteerModule), canActivate: [AuthGuard]
  },
  {
    path: 'resource-management',
    loadChildren: () => import('./features/resource-management/resource-management.module').then(m => m.ResourceManagementModule), canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: '/dashboard'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CoreModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
