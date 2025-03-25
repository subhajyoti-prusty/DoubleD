import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-volunteer-dashboard',
  template: `
    <div class="volunteer-container">
      <p-card header="Volunteer Registration">
        <form [formGroup]="volunteerForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              pInputText 
              formControlName="email"
              placeholder="Enter your email to receive disaster alerts"
            />
          </div>
          <div class="field">
            <label for="location">Preferred Location (Optional)</label>
            <input 
              id="location" 
              type="text" 
              pInputText 
              formControlName="location"
              placeholder="Enter your preferred location for volunteering"
            />
          </div>
          <p-button 
            type="submit" 
            label="Register" 
            [disabled]="!volunteerForm.valid"
            styleClass="mt-3"
          ></p-button>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .volunteer-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
    }
  `]
})
export class VolunteerDashboardComponent {
  volunteerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.volunteerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      location: ['']
    });
  }

  onSubmit() {
    if (this.volunteerForm.valid) {
      // TODO: Implement API call to save volunteer data
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Thank you for registering as a volunteer!'
      });
      this.volunteerForm.reset();
    }
  }
} 