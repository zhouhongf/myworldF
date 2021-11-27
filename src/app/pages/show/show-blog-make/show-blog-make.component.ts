import {Component, OnInit} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {NativeService} from '../../../providers/native.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {Router} from '@angular/router';
import {PreviewimgService} from '../../../providers/previewimg.service';


@Component({
    selector: 'app-show-blog-make',
    templateUrl: './show-blog-make.component.html',
    styleUrls: ['./show-blog-make.component.scss']
})
export class ShowBlogMakeComponent implements OnInit {
    isMobile;
    hideBadge = true;
    base64List = [];
    editorContent;
    tagSelect = 'ALL';
    tagList = [];

    constructor(
        private baseService: BaseService,
        private nativeService: NativeService,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private router: Router,
        private previewImgService: PreviewimgService
    ) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        this.tagList = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.contactTags));
    }



    delShowPhoto(index) {
        if (this.hideBadge === false) {
            this.base64List.splice(index, 1);
        }
    }

    createShowPhoto() {
        this.hideBadge = true;
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
        inputObj.multiple = true;
        document.body.appendChild(inputObj);
        inputObj.addEventListener('change', event => {
            const files = event.target['files'];
            const theLength = this.base64List.length + files.length;
            if (theLength > 9) {
                this.baseService.presentToast('最多只能发9张图片');
            } else {
                this.addFilesToBase64List(files);
            }
        });
        inputObj.click();
        document.body.removeChild(inputObj);
    }

    async openFileMobile() {
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            targetWidth: 800,
            targetHeight: 600,
        };
        const maxSelectCount = 9;
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.CAMERA;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.addPhotosToBase64List(data);
                        });
                    }
                },
                {
                    text: '相册',
                    handler: () => {
                        this.nativeService.getMedias(maxSelectCount).subscribe(data => {
                            this.addPhotosToBase64List(data);
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

    addFilesToBase64List(files: Array<File>) {
        for (const file of files) {
            this.previewImgService.readAsDataUrlWithCompress(file, 800).then(value => {
                if (this.base64List.length < 9) {
                    this.base64List.push(value);
                }
            });
        }
    }

    addPhotosToBase64List(datas) {
        for (const data of datas) {
            this.nativeService.getThumbnail(data).then(value => {
                if (this.base64List.length < 9) {
                    const base64 = value.src;
                    this.base64List.push(base64);
                }
            });
        }
    }


    releaseBlog() {
        const params = {contactTag: this.tagSelect};
        this.baseService.httpPost(APIService.CHAT.createShowBlog, params, this.editorContent, data => {
            if (data['code'] === 0) {
                this.uploadBase64Photos(data['data']);
            } else {
                this.baseService.presentToast(data['msg']);
            }
        });
    }

    uploadBase64Photos(blogIdDetail?: string) {
        if (blogIdDetail && this.base64List.length > 0) {
            this.baseService.httpPost(APIService.FILEAPI.uploadShowPhotoBase64, {blogIdDetail}, this.base64List, data => {
                if (data['code'] === 0) {
                    return this.router.navigate(['/show/blog']);
                } else {
                    this.baseService.presentToast(data['msg']);
                }
            }, true);
        }
    }
}
