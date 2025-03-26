import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

    constructor(private readonly authService: AuthService,
        private readonly router: Router) {
    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        try {
            const isLoggedIn = this.authService.isAuthenticated();
            if (isLoggedIn) {
                this.router.navigate(['dashboard']);
                return false
            } else {
                return true
            }
        } catch (error) {
            this.router.navigate(['/login']);
            return false;
        }
    }

}