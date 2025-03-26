import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VolunteerService } from './volunteer.service';

export interface Volunteer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: 'active' | 'inactive';
  registrationDate: Date;
}

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss',
  providers: [MessageService]
})
export class VolunteerComponent implements OnInit {
  volunteers: Volunteer[] = [];
  volunteerForm: FormGroup;
  displayDialog: boolean = false;
  selectedVolunteer: Volunteer | null = null;
  skills: string[] = ['Teaching', 'Mentoring', 'Administration', 'Event Planning', 'Technical Support', 'Other'];
  loading: boolean = false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private volunteerService: VolunteerService
  ) {
    this.volunteerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      skills: [[]],
      availability: ['', Validators.required],
      status: ['active']
    });
  }

  ngOnInit() {
    this.loadVolunteers();
  }

  loadVolunteers() {
    this.loading = true;
    this.volunteerService.getVolunteers().subscribe({
      next: (data) => {
        this.volunteers = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.message || 'Failed to load volunteers' 
        });
        this.loading = false;
      }
    });
  }

  onPage(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // In a real application, you would make an API call here with pagination parameters
  }

  showAddDialog() {
    this.selectedVolunteer = null;
    this.volunteerForm.reset();
    this.displayDialog = true;
  }

  showEditDialog(volunteer: Volunteer) {
    this.selectedVolunteer = volunteer;
    this.volunteerForm.patchValue(volunteer);
    this.displayDialog = true;
  }

  saveVolunteer() {
    if (this.volunteerForm.valid) {
      const volunteerData = {
        ...this.volunteerForm.value,
        registrationDate: new Date()
      };

      if (this.selectedVolunteer) {
        // Update existing volunteer
        this.volunteerService.updateVolunteer(this.selectedVolunteer.id!, volunteerData).subscribe({
          next: (updatedVolunteer) => {
            const index = this.volunteers.findIndex(v => v.id === this.selectedVolunteer?.id);
            if (index !== -1) {
              this.volunteers[index] = updatedVolunteer;
            }
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Volunteer updated successfully' 
            });
            this.displayDialog = false;
          },
          error: (error) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: error.message || 'Failed to update volunteer' 
            });
          }
        });
      } else {
        // Add new volunteer
        this.volunteerService.createVolunteer(volunteerData).subscribe({
          next: (newVolunteer) => {
            this.volunteers.push(newVolunteer);
            this.totalRecords++;
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Volunteer added successfully' 
            });
            this.displayDialog = false;
          },
          error: (error) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: error.message || 'Failed to add volunteer' 
            });
          }
        });
      }
    }
  }

  deleteVolunteer(volunteer: Volunteer) {
    if (confirm('Are you sure you want to delete this volunteer?')) {
      this.volunteerService.deleteVolunteer(volunteer.id!).subscribe({
        next: () => {
          this.volunteers = this.volunteers.filter(v => v.id !== volunteer.id);
          this.totalRecords--;
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Volunteer deleted successfully' 
          });
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: error.message || 'Failed to delete volunteer' 
          });
        }
      });
    }
  }
}
