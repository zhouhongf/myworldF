import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';
import {BaseService} from '../../../providers/base.service';


@Component({
    selector: 'app-show-blog-detail',
    templateUrl: './show-blog-detail.component.html',
    styleUrls: ['./show-blog-detail.component.scss']
})
export class ShowBlogDetailComponent implements OnInit, OnDestroy {
    theAvatarUrl: string;
    nickname: string;
    theShowBlog;
    navigationSubscription;

    showPhotoPrefix = APIService.domain + '/getPhotoShowLocation/';

    constructor(private storage: Storage, private router: Router, private baseService: BaseService) {
    }

    ngOnInit() {
        this.theAvatarUrl = localStorage.getItem(APIService.SAVE_LOCAL.userAvatar);
        this.baseService.getUserOutline().subscribe(data => {
            if (data) {
                this.nickname = data.nickname;
                console.log('昵称是：', this.nickname);
            }
        })
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/show/blogDetail') {
                    this.getData();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    getData() {
        this.storage.get(APIService.SAVE_STORAGE.userShowBlogCurrent).then(data => {
            this.theShowBlog = data;
        });
    }

    delShowBlog() {
        this.baseService.httpGet(APIService.CHAT.delShowBlog, {blogIdDetail: this.theShowBlog.id}, data => {
           if (data['code'] === 0) {
               return this.router.navigate(['/show/blog']);
           } else {
               this.baseService.presentToast(data['msg']);
           }
        });
    }
}
