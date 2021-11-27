import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Route,
    Router,
    CanActivateChild, CanLoad
} from '@angular/router';
import { Observable } from 'rxjs';
import {BaseService} from '../../providers/base.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private router: Router, private baseService: BaseService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log('canActive方法中的state.url是：', state.url);
        return this.checkLogin(state.url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        const url = `/${route.path}`;
        console.log('canLoad方法中的route.path是：', url);
        return this.checkLogin(url);
    }

    checkLogin(url: string): Observable<boolean> | Promise<boolean> | boolean {
        const data = this.baseService.getCurrentUser();
        if (data) {
            const deadline = data.expireTime;
            if (deadline != null) {
                if (Date.now() < deadline) {
                    return true;
                }
            }
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
}
