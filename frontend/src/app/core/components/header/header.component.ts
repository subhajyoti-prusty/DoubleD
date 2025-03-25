import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppEnvConfigConstant } from '../../constants/app.constant';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  sidebarVisible: boolean = false;
  menuItems: any = [];

  public appEnvConfigConstant = AppEnvConfigConstant;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        link: 'dashboard'
      }
    ];
  }

  navigateRoute(item: any) {
    if (item?.link) this.router.navigateByUrl(item.link);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
