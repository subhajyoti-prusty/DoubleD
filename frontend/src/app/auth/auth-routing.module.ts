import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
<<<<<<< HEAD
import { RegisterComponent } from './register/register.component';
=======
>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
<<<<<<< HEAD
    path: 'register',
    component: RegisterComponent
  },
  {
=======
>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c
    path: 'forgot-password', 
    component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
