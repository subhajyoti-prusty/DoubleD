import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AppEnvConfigConstant } from '../../constants/app.constant';
import { link } from 'fs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  sidebarVisible: boolean = false;
  menuItems: any = [];

  public appEnvConfigConstant = AppEnvConfigConstant;

  constructor(private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  ngOnInit() {

    console.log('Header Side menu', this.sidebarVisible);

    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        link: 'dashboard'
      },
      {
        label: 'Leave Application',
        icon: 'pi pi-file-edit',
        items: [
          {
            label: 'Apply Leave',
            icon: 'pi pi-file-edit',
            link: '/leave-application/add-leave'
          },
          {
            label: 'View Leave',
            icon: 'pi pi-file',
            link: '/leave-application/view-leave',
          },
        ]
      },
      {
        label: 'Employee Information',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Create Employee',
            icon: 'pi pi-user-plus',
            link: '/employee/add-employee'
          },
          {
            label: 'Edit Employee',
            icon: 'pi pi-user-edit',
            link: '/employee/edit-employee',            
          },
          {
            label: 'View Employee',
            icon: 'pi pi-users',
            link: '/employee/view-employee',
          },
        ]
      },
      {
        label: 'Employee Attendance',
        icon: 'pi pi-check-circle',
        link: 'employee-attendance'
      },
      {
        label: 'Hostel Management',
        icon: 'pi pi-building',
        items:[
          {
            label:'Hostel Management',
            icon: 'pi pi-circle-on',
            link: '/hostel-seat/hostel',
          },
          {
            label:'Floor Management',
            icon: 'pi pi-circle-on',
            link: '/hostel-seat/floor',
          },
          {
            label:'Room Management',
            icon: 'pi pi-circle-on',
            link: '/hostel-seat/room',
          },
          {
            label:'Bed Management',
            icon: 'pi pi-circle-on',
            link: '/hostel-seat/bed',
          },
          {
            label:'View All Details',
            icon: 'pi pi-circle-on',
            link: '/hostel-seat/view-all',
          }
        ]
      },
      // {
      //   label: 'Student Admission',
      //   icon: 'pi pi-user',
      //   items: [
      //     {
      //       label: '',
      //       icon: 'pi pi-user-plus',
      //       link: ''
      //     },
      //     {
      //       label: '',
      //       icon: 'pi pi-user-edit',
      //       link: '',            
      //     },
      //     {
      //       label: '',
      //       icon: 'pi pi-users',
      //       link: '',
      //     },
      //   ]
      // },
      
    ]
  }

  sideMenu() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  navigateRoute(item: any) {
    if (item?.link) this.router.navigateByUrl(item.link);
  }

  logout() {
    this.authService.logout();
  }
}
