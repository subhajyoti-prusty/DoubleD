import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceManagementComponent } from './resource-management.component';

const routes: Routes = [
  {
    path: '',
    component: ResourceManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceManagementRoutingModule { }
