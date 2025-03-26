import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule]
})
export class VolunteerComponent {
  volunteerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.volunteerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.volunteerForm.valid) {
      // TODO: Implement API call to register volunteer
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Thank you for registering as a volunteer!'
      });
      this.volunteerForm.reset();
    }
  }
} 