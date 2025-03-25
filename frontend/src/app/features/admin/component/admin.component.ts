import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

interface Volunteer {
  name: string;
  email: string;
  location: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    TableModule
  ]
})
export class AdminComponent {
  adminForm: FormGroup;
  volunteers: Volunteer[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.adminForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.adminForm.valid) {
      // TODO: Implement API call to add news
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'News item added successfully!'
      });
      this.adminForm.reset();
    }
  }

  viewVolunteers() {
    // TODO: Implement API call to fetch volunteers
    this.volunteers = [
      { name: 'John Doe', email: 'john@example.com', location: 'New York' },
      { name: 'Jane Smith', email: 'jane@example.com', location: 'Los Angeles' },
      { name: 'Mike Johnson', email: 'mike@example.com', location: 'Chicago' }
    ];
  }
} 