import { Component, OnInit } from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {PreviewimgService} from '../../../providers/previewimg.service';
import {NativeService} from '../../../providers/native.service';

@Component({
  selector: 'app-sysadmin-slide',
  templateUrl: './sysadmin-slide.component.html',
  styleUrls: ['./sysadmin-slide.component.scss'],
})
export class SysadminSlideComponent implements OnInit {
  isMobile;
  showDetail = false;
  toDelete = false;

  elementData;
  slideForm: FormGroup;
  imageBase64;

  constructor(
      private baseService: BaseService,
      private previewimgService: PreviewimgService,
      private camera: Camera,
      private formBuilder: FormBuilder,
      private alertController: AlertController,
      private actionSheetCtrl: ActionSheetController,
      private nativeService: NativeService
  ) {
  }

  ngOnInit() {
    this.isMobile = this.baseService.isMobile();
    this.getData();
    this.createForm();
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {event.target.complete(); }, 2000);
  }

  getData() {
    this.baseService.httpGet(APIService.FILEAPI.getSlideList, null, data => {
      if (data.code === 0) {
        this.elementData = data.data;
      }
    });
  }

  createForm() {
    this.slideForm = this.formBuilder.group({
      id: '',
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      link: ['', Validators.required],
      updateTime: ''
    });
  }

  get id() {
    return this.slideForm.get('id');
  }

  get title() {
    return this.slideForm.get('title');
  }

  get description() {
    return this.slideForm.get('description');
  }

  get image() {
    return this.slideForm.get('image');
  }

  get link() {
    return this.slideForm.get('link');
  }

  get updateTime() {
    return this.slideForm.get('updateTime');
  }

  choose(data) {
    if (this.toDelete) {
      this.delete(data);
    } else {
      this.detail(data);
    }
  }

  detail(data) {
    this.id.patchValue(data.id);
    this.title.patchValue(data.title);
    this.description.patchValue(data.description);
    this.image.patchValue(data.image);
    this.link.patchValue(data.link);
    this.updateTime.patchValue(data.updateTime);
    this.imageBase64 = data.image;
    this.showDetail = true;
  }

  async delete(data) {
    const alertMessage = '<br>' +
        '<div>标题：<strong>' + data.title + '</strong></div>\n' +
        '<div>描述：<strong>' + data.description + '</strong></div>' +
        '<br>';

    const alert = await this.alertController.create({
      header: '删除以下文件：',
      message: alertMessage,
      buttons: [
        {
          text: '确定',
          cssClass: 'btn btn-danger',
          handler: () => {
            this.doDelete(data);
          }
        },
        {
          text: '取消',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

  doDelete(myslide) {
    this.baseService.httpDelete(APIService.FILEAPI.adminDelSlide + myslide.id, null, data => {
      if (data.code === 0) {
        for (let i = 0; i < this.elementData.length; i++) {
          const value = this.elementData[i];
          if (value.id === myslide.id) {
            this.elementData.splice(i, 1);
            break;
          }
        }
        this.toDelete = false;
      }
      this.baseService.presentToast(data.msg);
    });
  }

  create() {
    if (this.showDetail) {
      this.showDetail = false;
    } else {
      this.showDetail = true;
      this.slideForm.reset();
      this.imageBase64 = undefined;
    }
  }

  updateImage() {
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
          this.previewimgService.readAsDataUrlWithCompress(file, 800).then(data => {
            console.log('转换成base64的数据为：', data);
            this.imageBase64 = data.toString();
            this.image.patchValue(data.toString());
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
      targetWidth: 800,
      targetHeight: 600,
    };
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          handler: () => {
            options.sourceType = this.camera.PictureSourceType.CAMERA;
            this.nativeService.getPicture(options).subscribe(data => {
              this.image.patchValue(data);
              this.imageBase64 = data;
            });
          }
        },
        {
          text: '相册',
          handler: () => {
            options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.nativeService.getPicture(options).subscribe(data => {
              this.image.patchValue(data);
              this.imageBase64 = data;
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


  setSlide() {
    const formdata: FormData = new FormData();
    const params = {};
    if (this.id.value) {
      params['id'] = this.id.value;
    }
    formdata.append('title', this.title.value.trim());
    formdata.append('description', this.description.value.trim());
    formdata.append('link', this.link.value.trim());
    formdata.append('base64', this.image.value);
    this.baseService.httpPost(APIService.FILEAPI.adminSetSlide, params, formdata, data => {
      if (data.code === 0) {
        this.getData();
        this.toDelete = false;
        this.showDetail = false;
        this.imageBase64 = undefined;
        this.slideForm.reset();
      } else {
        this.baseService.presentToast(data.msg);
      }
    }, true);
  }
}
