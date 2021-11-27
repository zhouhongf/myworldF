import { Component, OnInit } from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {FormControl, Validators} from '@angular/forms';
import {saveAs} from 'file-saver';
import {NativeService} from '../../../providers/native.service';

@Component({
    selector: 'app-sysadmin-file',
    templateUrl: './sysadmin-file.component.html',
    styleUrls: ['./sysadmin-file.component.scss']
})
export class SysadminFileComponent implements OnInit {
    isMobile;
    showDetail = false;
    toDelete = false;

    elementData;
    file: File;
    officialNamePattern = APIService.officialNamePattern;
    versionPattern = APIService.versionPattern;
    officialName = new FormControl('', [Validators.required, Validators.pattern(this.officialNamePattern)]);
    versionNumber = new FormControl('', [Validators.required, Validators.pattern(this.versionPattern)]);

    constructor(private baseService: BaseService, private alertController: AlertController, private loadingCtrl: LoadingController, private nativeService: NativeService) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        this.getData();
    }

    getData() {
        this.baseService.httpGet(APIService.SYSADMIN.getFileList, null, data => {
            if (data.code === 0) {
                this.elementData = data.data;
            }
        });
    }

    choose(data) {
        if (this.toDelete) {
            this.del(data);
        } else {
            this.downloadFile(data);
        }
    }

    downloadFile(theData) {
        if (this.isMobile) {
            this.downLoadFileMobile(theData);
        } else {
            this.downLoadFileBrowser(theData);
            // this.downLoadFileMobile(theData);
        }
    }

    async downLoadFileBrowser(theData) {
        const loading = await this.loadingCtrl.create({});
        await loading.present();
        this.baseService.downloadFile(theData.officialName).subscribe(
            async data => {
                await loading.dismiss();
                const theBlob = new Blob([data], {type: 'application/octet-stream'});
                const filename = theData.officialName + '.' + theData.extensionType;
                saveAs(theBlob, filename);
            }, async err => {
                await loading.dismiss();
                this.baseService.presentToast(err);
            });
    }

    downLoadFileMobile(theData) {
        const fileName = theData.fileName;
        const fileType = APIService.getFileType(fileName);
        const fileMIMEType = APIService.getFileMimeType(fileType);
        const url = APIService.domain + APIService.FILEAPI.downloadFile + theData.officialName;
        this.nativeService.downloadXHR(url, fileName, fileMIMEType);
    }

    async del(data) {
        const alertMessage = '<br>' +
            '<div>名称：<strong>' + data.officialName + '</strong></div>\n' +
            '<div>版本：<strong>' + data.versionNumber + '</strong></div>' +
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

    doDelete(myfile) {
        this.baseService.httpDelete(APIService.FILEAPI.adminDeleteFile + myfile.id, null, data => {
            if (data.code === 0) {
                for (let i = 0; i < this.elementData.length; i++) {
                    const value = this.elementData[i];
                    if (value.id === myfile.id) {
                        this.elementData.splice(i, 1);
                        break;
                    }
                }
                this.toDelete = false;
            }
            this.baseService.presentToast(data.msg);
        });
    }

    onChangeFile(event) {
        this.file = event.target.files[0];
    }

    uploadFile() {
        if (this.file) {
            const formdata: FormData = new FormData();
            formdata.append('officialName', this.officialName.value.trim());
            formdata.append('versionNumber', this.versionNumber.value.trim());
            formdata.append('file', this.file);
            this.baseService.httpPost(APIService.FILEAPI.adminUploadFile, null, formdata, data => {
                if (data.code === 0) {
                    this.getData();
                    this.officialName.reset();
                    this.versionNumber.reset();
                    this.toDelete = false;
                    this.showDetail = false;
                } else {
                    this.baseService.presentToast(data.msg);
                }
            }, true);
        } else {
            this.baseService.presentToast('请重新选择文件');
        }

    }

    doRefresh(event) {
        this.getData();
        setTimeout(() => {event.target.complete(); }, 2000);
    }

}
