import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerService } from './core/service/loading-spinner.service';
import { Subscription } from 'rxjs';
import { SideMenuService } from './core/service/side-menu.service';
import { AuthService } from './core/service/auth.service';
import { Location } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'edtech-core';

  showSpinner = false;
  isSidebarOpen: boolean = false;
  private readonly subscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;

  constructor(private readonly loadingService: LoadingSpinnerService,
    private readonly sidebarService: SideMenuService,
    private readonly authService: AuthService,
    private readonly location: Location,
    private readonly router: Router
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });

    this.loadingService.loading$.subscribe((data: boolean) => {
      setTimeout(() => {
        this.showSpinner = data || false;
      });
    });

    this.authService.currentUser.subscribe(data => {
      this.isLoggedIn = data;
    });

  }

  ngOnInit(): void {
    this.subscription.add(
      this.sidebarService.sidebarVisible$.subscribe(visible => {
        this.isSidebarOpen = visible;
      })
    );
  }

  onToggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

}
