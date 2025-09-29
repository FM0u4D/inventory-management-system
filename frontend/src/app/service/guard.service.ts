import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from './api.service';


@Injectable({
    providedIn: 'root'
})
export class GuardService implements CanActivate {
    // adapt to auth storage / JWT decode
    private getRole(): string | null {
        return localStorage.getItem('role');
    }
    isAdmin(): boolean {
        return this.getRole() === 'ADMIN';
    }

    constructor(private router: Router, private apiService: ApiService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const requiresAdmin = route.data['requiresAdmin'] === true;

        const token = this.apiService.getFromStorageAndDecrypt('token');
        const role = this.apiService.getFromStorageAndDecrypt('role');

        // Not logged in → redirect to login
        if (!token) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // Admin route required but user is not ADMIN → redirect to /forbidden
        if (requiresAdmin && role !== 'ADMIN') {
            this.router.navigate(['/forbidden']);
            return false;
        }

        // Additional rule: allow MANAGER access to specific routes
        const managerAllowedRoutes = ['/transactions', '/purchase', '/sell'];
        if (role === 'MANAGER') {
            if (managerAllowedRoutes.includes(state.url)) {
                return true;
            } else if (requiresAdmin) {
                this.router.navigate(['/forbidden']);
                return false;
            }
        }

        return true;
    }

}
