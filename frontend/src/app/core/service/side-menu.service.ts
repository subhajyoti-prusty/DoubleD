import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SideMenuService {

  private sidebarVisibleSubject = new BehaviorSubject<boolean>(true);
  public sidebarVisible$ = this.sidebarVisibleSubject.asObservable();

  constructor() { }

  // Toggle the sidebar visibility
  toggleSidebar() {
    this.sidebarVisibleSubject.next(!this.sidebarVisibleSubject.value);
  }

  // Set sidebar visibility directly
  setSidebarVisibility(visible: boolean) {
    this.sidebarVisibleSubject.next(visible);
  }
}
