import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseService} from '../../../providers/base.service';
import {NativeService} from '../../../providers/native.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {APIService} from '../../../providers/api.service';
import {FormControl, Validators} from '@angular/forms';
import {PreviewimgService} from '../../../providers/previewimg.service';

@Component({
    selector: 'app-sysuser-settings',
    templateUrl: './sysuser-settings.component.html',
    styleUrls: ['./sysuser-settings.component.scss'],
})
export class SysuserSettingsComponent implements OnInit {
    isMobile;
    userAvatar: string;
    showNickname = false;
    nickname = new FormControl('', [Validators.required, Validators.pattern(APIService.nicknamePattern)]);
    intro = new FormControl('');

    constructor(
        private baseService: BaseService,
        private nativeService: NativeService,
        private router: Router,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private previewimgService: PreviewimgService
    ) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        this.baseService.getUserOutline().subscribe(data => {
            if (data) {
                this.nickname.patchValue(data.nickname);
                this.intro.patchValue(data.intro);
            }
        })
    }

    goBack() {
        return this.router.navigate(['/sysuser/home']);
    }

    updateUserAvatar() {
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
        // inputObj.setAttribute('accept', 'image/jpeg,image/png,application/pdf,text/plain');
        // inputObj.setAttribute('directory', '');
        document.body.appendChild(inputObj);
        inputObj.addEventListener('change', event => {
            const files = event.target['files'];
            if (files.length === 1) {
                // const path = event['path'][0];
                // const filePath = path['value'];
                const file = files[0];
                const fileType = file.type;
                if (fileType === 'image/jpeg' || fileType === 'image/png') {
                    this.previewimgService.readAsDataUrlWithCompress(file, 200).then(data => {
                        console.log('转换成base64的数据为：', data);
                        this.userAvatar = data.toString();
                        this.uploadPhotoBase64(this.userAvatar);
                    });

                } else {
                    this.baseService.presentToast('只能上传jpeg, jpg, png类型的图片');
                }
            }
        });
        inputObj.click();                           // 模拟点击
        document.body.removeChild(inputObj);        // 从DOM中移除input
    }

    async openFileMobile() {
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            targetWidth: 150,
            targetHeight: 150,
        };
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.CAMERA;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.userAvatar = data;
                            this.uploadPhotoBase64(this.userAvatar);
                        });
                    }
                },
                {
                    text: '相册',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.userAvatar = data;
                            this.uploadPhotoBase64(this.userAvatar);
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

    uploadPhotoBase64(base64Str: string) {
        this.baseService.httpPost(APIService.FILEAPI.uploadUserAvatarBase64, null, base64Str, data => {
            if (data.code === 0) {
                localStorage.setItem(APIService.SAVE_LOCAL.userAvatar, base64Str);
                this.goBack();
            } else {
                this.baseService.presentConfirmToast('失败，请重新上传头像');
            }
        }, true);
    }


    saveNickname() {
        const nickname = this.nickname.value.trim();
        const userIntro = this.intro.value.trim();
        this.baseService.httpPost(APIService.SYSUSER.setNickname, {nickname}, userIntro, data => {
            if (data.code === 0) {
                this.showNickname = false;
                localStorage.setItem(APIService.SAVE_LOCAL.nickname, nickname);
                localStorage.setItem(APIService.SAVE_LOCAL.userIntro, userIntro);
            } else {
                this.baseService.presentToast(data.msg);
            }
        }, true);
        this.nickname.reset();
    }

    saveNicknameLocal() {
        const nickname = this.nickname.value.trim();
        const userIntro = this.intro.value.trim();
        this.showNickname = false;
        localStorage.setItem(APIService.SAVE_LOCAL.nickname, nickname);
        localStorage.setItem(APIService.SAVE_LOCAL.userIntro, userIntro);
        this.nickname.reset();
        this.baseService.presentToast('已修改昵称为：' + nickname);
    }

}
