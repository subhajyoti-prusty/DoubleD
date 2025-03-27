import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly authService: AuthService,
    private readonly router: Router) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const isLoggedIn = this.authService.isAuthenticated();
      console.log('AuthGuard: isLoggedIn =', isLoggedIn);
      
      if (isLoggedIn) {
        const userProfile = this.authService.getUserProfile();
        console.log('AuthGuard: userProfile =', userProfile);
        
        if (userProfile) {
          return true;
        }
      }
      
      console.log('AuthGuard: Redirecting to login');
      this.router.navigate(['/login']);
      return false;
    } catch (error) {
      console.error('AuthGuard error:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }

}