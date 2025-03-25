import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../../core/service/loading-spinner.service';
import { AuthenticationService } from '../service/authentication.service';
import { ILoginModel } from '../interface/login.interface';
import { ToastService } from '../../core/service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingSpinnerService,
    private readonly router: Router 
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onLoginFormSubmitted(e: Event) {
    e.preventDefault();
    if (!this.loginForm.valid) {
      this.toastService.showErrorToast(`Please enter User ID and Password`);
    } else {
      this.loadingService.show();
      this.authenticateUser();
    }
  }

  authenticateUser() {
    const credentials: ILoginModel = this.loginForm.value;
    this.authenticationService.login(credentials).subscribe({
      next: (resp) => {
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
      }
    });
  }

  redirectToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  
}
