import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthenticationService } from './service/authentication.service';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { LoadingSpinnerService } from '../core/service/loading-spinner.service';
import { ToastService } from '../core/service/toast.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule
  ],
  providers: [
    AuthenticationService,
    LoadingSpinnerService,
    ToastService
  ]
})
export class AuthModule { }
