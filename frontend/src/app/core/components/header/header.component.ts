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
        label: 'Admin',
        icon: 'pi pi-user',
        link: 'admin'
      },
      {
        label: 'News',
        icon: 'pi pi-newspaper',
        link: 'news'
      },
      {
        label: 'Maps',
        icon: 'pi pi-map',
        link: 'maps'
      },
      {
        label: 'Volunteers',
        icon: 'pi pi-users',
        link: 'volunteers'
      },
      {
        label: 'Resource Management',
        icon: 'pi pi-briefcase',
        link: 'resource-management'
      }
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
