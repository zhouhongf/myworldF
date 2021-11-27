import {Component, OnDestroy} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {NavigationEnd, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';

@Component({
    selector: 'app-sysuser-home',
    templateUrl: './sysuser-home.component.html',
    styleUrls: ['./sysuser-home.component.scss']
})
export class SysuserHomeComponent implements OnDestroy {
    navigationSubscription;
    userAvatar;
    nickname;
    userIntro;

    constructor(private baseService: BaseService, private router: Router) {
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/sysuser/home' || event.url === '/sysuser') {
                    this.getData();
                }
            }
        });
    }

    getData() {
        if (this.baseService.isLogin()) {
            this.baseService.getUserOutline().subscribe(data => {
                if (data) {
                    this.nickname = data.nickname ? data.nickname : undefined;
                    this.userIntro = data.intro ? data.intro : undefined;
                }
            })
            const userAvatar = localStorage.getItem(APIService.SAVE_LOCAL.userAvatar);
            this.userAvatar = userAvatar ? userAvatar : 'assets/images/ionic-person.svg';
        }
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    logout() {
        this.baseService.logout();
        return this.router.navigate(['/']);
    }
}
