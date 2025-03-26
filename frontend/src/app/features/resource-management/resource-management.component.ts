import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Resource {
  id: number;
  type: string;
  name: string;
  quantity: number;
  location: string;
  status: 'Available' | 'Allocated' | 'In Transit';
  lastUpdated: Date;
}

@Component({
  selector: 'app-resource-management',
  templateUrl: './resource-management.component.html',
  styleUrl: './resource-management.component.scss'
})
export class ResourceManagementComponent implements OnInit {
  resources: Resource[] = [];
  resourceForm!: FormGroup;
  editMode = false;
  currentResourceId: number | null = null;
  loading = false;

  resourceTypes = ['Food', 'Water', 'Medical Supplies', 'Shelter', 'Clothing', 'Tools', 'Fuel'];
  resourceStatuses = ['Available', 'Allocated', 'In Transit'];
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadMockResources();
  }

  initForm(): void {
    this.resourceForm = this.fb.group({
      type: ['Food', Validators.required],
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      status: ['Available', Validators.required]
    });
  }

  loadMockResources(): void {
    this.resources = [
      { id: 1, type: 'Food', name: 'Canned Goods', quantity: 500, location: 'Miami Warehouse', status: 'Available', lastUpdated: new Date('2023-09-10') },
      { id: 2, type: 'Water', name: 'Bottled Water', quantity: 1000, location: 'Orlando Distribution Center', status: 'In Transit', lastUpdated: new Date('2023-09-12') },
      { id: 3, type: 'Medical Supplies', name: 'First Aid Kits', quantity: 200, location: 'Tampa General Hospital', status: 'Allocated', lastUpdated: new Date('2023-09-15') },
      { id: 4, type: 'Shelter', name: 'Emergency Tents', quantity: 50, location: 'Jacksonville Storage', status: 'Available', lastUpdated: new Date('2023-09-08') },
      { id: 5, type: 'Food', name: 'MREs', quantity: 1000, location: 'Miami Warehouse', status: 'Available', lastUpdated: new Date('2023-09-14') }
    ];
  }

  onSubmit(): void {
    if (this.resourceForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call delay
    setTimeout(() => {
      if (this.editMode) {
        this.updateResource();
      } else {
        this.addResource();
      }
      this.loading = false;
      this.resetForm();
    }, 800);
  }

  addResource(): void {
    const newResource: Resource = {
      id: this.getNextId(),
      ...this.resourceForm.value,
      lastUpdated: new Date()
    };
    
    this.resources.unshift(newResource);
  }

  updateResource(): void {
    if (this.currentResourceId === null) return;
    
    const index = this.resources.findIndex(r => r.id === this.currentResourceId);
    if (index !== -1) {
      this.resources[index] = {
        ...this.resources[index],
        ...this.resourceForm.value,
        lastUpdated: new Date()
      };
    }
  }

  editResource(resource: Resource): void {
    this.editMode = true;
    this.currentResourceId = resource.id;
    
    this.resourceForm.patchValue({
      type: resource.type,
      name: resource.name,
      quantity: resource.quantity,
      location: resource.location,
      status: resource.status
    });
  }

  deleteResource(id: number): void {
    this.resources = this.resources.filter(r => r.id !== id);
  }

  resetForm(): void {
    this.editMode = false;
    this.currentResourceId = null;
    this.resourceForm.reset({
      type: 'Food',
      quantity: 0,
      status: 'Available'
    });
  }

  private getNextId(): number {
    return Math.max(...this.resources.map(r => r.id), 0) + 1;
  }
}
