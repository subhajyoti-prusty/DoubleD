import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../../core/service/loading-spinner.service';
import { AuthService } from '../../core/service/auth.service';
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
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingSpinnerService,
    private readonly router: Router 
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLoginFormSubmitted(e: Event) {
    e.preventDefault();
    if (!this.loginForm.valid) {
      this.toastService.showErrorToast('Please enter valid email and password');
      return;
    }

    try {
      this.loadingService.show();
      const credentials = {
        ...this.loginForm.value,
        email: this.loginForm.value.email.toLowerCase()
      };
      await this.authService.login(credentials);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login error:', error);
      this.toastService.showErrorToast('Invalid email or password');
    } finally {
      this.loadingService.hide();
    }
  }

  redirectToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
