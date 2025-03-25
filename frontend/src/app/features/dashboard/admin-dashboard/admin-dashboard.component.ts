import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Volunteer {
  id: string;
  email: string;
  location: string;
  registrationDate: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h2>Admin Dashboard</h2>
        <p-button 
          label="Add New Alert" 
          icon="pi pi-plus" 
          (onClick)="showNewAlertDialog()"
        ></p-button>
      </div>

      <div class="admin-section">
        <h3>Volunteer Management</h3>
        <p-table 
          [value]="volunteers" 
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          responsiveLayout="scroll"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Email</th>
              <th>Location</th>
              <th>Registration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-volunteer>
            <tr>
              <td>{{volunteer.email}}</td>
              <td>{{volunteer.location}}</td>
              <td>{{volunteer.registrationDate}}</td>
              <td>
                <span [class]="'status-badge ' + volunteer.status">
                  {{volunteer.status}}
                </span>
              </td>
              <td>
                <p-button 
                  icon="pi pi-trash" 
                  severity="danger" 
                  text
                  (onClick)="deleteVolunteer(volunteer)"
                ></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="alertDialogVisible" 
        header="Create New Alert" 
        [modal]="true"
        [style]="{width: '50vw'}"
      >
        <form [formGroup]="alertForm" (ngSubmit)="onSubmitAlert()">
          <div class="field">
            <label for="title">Alert Title</label>
            <input 
              id="title" 
              type="text" 
              pInputText 
              formControlName="title"
            />
          </div>
          <div class="field">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              pInputTextarea 
              formControlName="description"
              [rows]="3"
            ></textarea>
          </div>
          <div class="field">
            <label for="severity">Severity</label>
            <p-dropdown 
              id="severity"
              [options]="severityOptions" 
              formControlName="severity"
              placeholder="Select Severity"
            ></p-dropdown>
          </div>
          <div class="dialog-footer">
            <p-button 
              type="submit" 
              label="Create Alert" 
              [disabled]="!alertForm.valid"
            ></p-button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .admin-section {
      margin-bottom: 30px;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: uppercase;
    }
    .status-badge.active {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .status-badge.inactive {
      background-color: #ffebee;
      color: #c62828;
    }
    .field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .dialog-footer {
      margin-top: 1rem;
      text-align: right;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  volunteers: Volunteer[] = [
    {
      id: '1',
      email: 'volunteer1@example.com',
      location: 'New York',
      registrationDate: '2024-03-25',
      status: 'active'
    },
    {
      id: '2',
      email: 'volunteer2@example.com',
      location: 'Los Angeles',
      registrationDate: '2024-03-24',
      status: 'inactive'
    }
  ];

  alertDialogVisible = false;
  alertForm: FormGroup;
  severityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];

  constructor(private fb: FormBuilder) {
    this.alertForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['', Validators.required]
    });
  }

  ngOnInit() {
    // TODO: Implement API calls to fetch real data
  }

  showNewAlertDialog() {
    this.alertDialogVisible = true;
  }

  onSubmitAlert() {
    if (this.alertForm.valid) {
      // TODO: Implement API call to create new alert
      this.alertDialogVisible = false;
      this.alertForm.reset();
    }
  }

  deleteVolunteer(volunteer: Volunteer) {
    // TODO: Implement API call to delete volunteer
    this.volunteers = this.volunteers.filter(v => v.id !== volunteer.id);
  }
} 