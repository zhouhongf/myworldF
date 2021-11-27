import { Component, OnInit } from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {NativeService} from '../../../providers/native.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {Router} from '@angular/router';
import {PreviewimgService} from '../../../providers/previewimg.service';
import {APIService} from '../../../providers/api.service';

@Component({
  selector: 'app-show-social-make',
  templateUrl: './show-social-make.component.html',
  styleUrls: ['./show-social-make.component.scss'],
})
export class ShowSocialMakeComponent implements OnInit {
  isMobile;
  hideBadge = true;
  base64List = [];
  editorContent;
  isAnonymous = false;

  theUserWid: string;
  nickname: string;
  company: string;
  position: string;

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
    this.theUserWid = this.baseService.getWidLocal();
    this.baseService.getUserOutline().subscribe(data => {
      if (data) {
        this.nickname = data.nickname;
        this.company = data.company;
        this.position = data.position;
      }
    })
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
    if (!this.nickname) {
      return this.baseService.alert('必须设置昵称后，才能发布内容。')
    }
    // anonymous为1则是匿名，为0则非匿名
    const params = {}
    if (this.isAnonymous === true) {
      params['anonymous'] = 1;
    } else {
      params['anonymous'] = 0;
    }
    this.baseService.httpPost(APIService.WEALTH.createShowSocial, params, this.editorContent, data => {
      if (data['code'] === 0) {
        this.uploadBase64Photos(data['data']);
      } else {
        this.baseService.presentToast(data['msg']);
      }
    });
  }

  uploadBase64Photos(blogIdDetail?: string) {
    if (blogIdDetail && this.base64List.length > 0) {
      this.baseService.httpPost(APIService.FILEAPI.uploadTweetPhotoBase64, {blogIdDetail}, this.base64List, data => {
        if (data['code'] === 0) {
          return this.router.navigate(['/show/social']);
        } else {
          this.baseService.presentToast(data['msg']);
        }
      }, true);
    } else {
      return this.router.navigate(['/show/social']);
    }
  }
}
