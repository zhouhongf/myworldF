import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {NativeService} from '../../../providers/native.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {NavigationEnd, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';
import {PreviewimgService} from '../../../providers/previewimg.service';

@Component({
    selector: 'app-show-blog',
    templateUrl: './show-blog.component.html',
    styleUrls: ['./show-blog.component.scss']
})
export class ShowBlogComponent implements OnInit, OnDestroy {
    theImgUrl = 'assets/images/beautyHill.jpg';
    navigationSubscription;
    isMobile;
    showPhotoPrefix = APIService.domain + '/getPhotoShowLocation/';

    theUserWid: string;
    theAvatarUrl: string;
    nickname: string;

    blogShowList = [];
    totalBlogLength: number;
    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize;

    yearBegin;

    constructor(
        private baseService: BaseService,
        private storage: Storage,
        private nativeService: NativeService,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private router: Router,
        private previewImgService: PreviewimgService
    ) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        this.yearBegin = this.baseService.getYearBegin();
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/show/blog') {
                    this.getCurrentUser();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    getCurrentUser() {
        this.theUserWid = this.baseService.getWidLocal();
        const userAvatar = localStorage.getItem(APIService.SAVE_LOCAL.userAvatar);
        this.theAvatarUrl = userAvatar ? userAvatar : APIService.avatarPrefix + this.theUserWid;
        this.nickname = localStorage.getItem(APIService.SAVE_LOCAL.nickname);
        const blogPhoto = localStorage.getItem(APIService.SAVE_LOCAL.userBlogPhoto);
        if (blogPhoto) {
            this.theImgUrl = blogPhoto;
        }
        this.getShowBlogList();
    }

    getShowBlogList() {
        const params = {pageSize: this.pageSize, pageIndex: this.pageIndex};
        this.baseService.httpGet(APIService.CHAT.getShowBlogList, params, data => {
            if (data.code === 0) {
                this.totalBlogLength = data.num;
                const showBlogs = data.data;
                if (showBlogs && showBlogs.length > 0) {
                    if (this.pageIndex === 0) {
                        this.blogShowList = showBlogs;
                    } else {
                        this.blogShowList = this.blogShowList.concat(showBlogs);
                    }
                }
            }
        });
    }

    doInfinite(event) {
        const num = this.blogShowList.length;
        if (num > 0 && (num % this.pageSize === 0)) {                                       // 当前项目总数除以pageSize是求余，如果余数不为0，那么就是最后一页了
            this.pageIndex = Math.floor(this.blogShowList.length / this.pageSize) + 1;   // 当前项目总数 除以 每页数量 得出当前页码数
            this.getShowBlogList();
        }
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }


    changeBlogPhoto() {
        if (this.isMobile) {
            this.openFileMobile();
        } else {
            this.openFileBrowse();
        }
    }

    openFileBrowse() {
        const inputObj = document.createElement('input');
        inputObj.setAttribute('id', '_ef');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('style', 'visibility:hidden');
        inputObj.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        document.body.appendChild(inputObj);
        inputObj.addEventListener('change', event => {
            const files = event.target['files'];
            if (files.length > 1) {
                this.baseService.presentToast('只能选择一张照片');
            } else {
                this.previewImgService.readAsDataUrlWithCompress(files[0], 400).then(value => {
                    this.uploadBlogPanelPhotoBase64(value);
                });
            }
        });
        inputObj.click();
        document.body.removeChild(inputObj);
    }

    async openFileMobile() {
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            targetWidth: 400,
            targetHeight: 300,
        };
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.CAMERA;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.uploadBlogPanelPhotoBase64(data);
                        });
                    }
                },
                {
                    text: '相册',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.uploadBlogPanelPhotoBase64(data);
                        });
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    uploadBlogPanelPhotoBase64(photo) {
        this.baseService.httpPost(APIService.FILEAPI.uploadBlogPanelPhotoBase64, null, photo, data => {
            if (data['code'] === 0) {
                this.theImgUrl = APIService.domain + '/getBlogPanelPhotoLocation/' + this.theUserWid;
                localStorage.setItem(APIService.SAVE_LOCAL.userBlogPhoto, this.theImgUrl);
            } else {
                this.baseService.presentToast(data['msg']);
            }
        }, true);
    }



    goToBlogMake() {
        return this.router.navigate(['/show/blogMake']).then(() => {
            this.blogShowList = [];
            this.totalBlogLength = undefined;
            this.pageIndex = APIService.pageIndex;
            this.pageSize = APIService.pageSize;
        });
    }

    goToBlogDetail(data) {
        this.storage.set(APIService.SAVE_STORAGE.userShowBlogCurrent, data).then(() => {
            return this.router.navigate(['/show/blogDetail']);
        });
    }
}
