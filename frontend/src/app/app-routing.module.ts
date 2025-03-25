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
    path: '**',
    redirectTo: '/dashboard'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CoreModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
