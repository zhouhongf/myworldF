import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Network} from '@ionic-native/network/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer/ngx';
import {Observable} from 'rxjs';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {APIService} from './api.service';
import {CameraOptions, Camera} from '@ionic-native/camera/ngx';
import {Storage} from '@ionic/storage';


declare let MediaPicker;

export class BackPhoto {
    src: string;
    style: string;
    path: string;

    constructor(src, style, path) {
        this.src = src;
        this.style = style;
        this.path = path;
    }
}

// baseService可以引用nativeService, 但nativeService不要引用baseService, 防止陷入死循环

@Injectable({
    providedIn: 'root'
})
export class NativeService {
    theDomain = APIService.domain;

    // 用于检查更新APP
    officialName = 'JINGRONGAPK';
    versionNumber;
    versionNumberOnline;
    iosDownloadUrl = ''; // 可能要设置为app store中的下载地址
    apkDownloadUrl = 'http://www.jingrongbank.com/shared/contactUs'; // 可以设置为本网站的下载地址
    updateProgress = -1; // app更新进度.默认为0,在app升级过程中会改变
    loadingStatus; // 文件上传进度

    constructor(
        private platform: Platform,
        private network: Network,
        private appVersion: AppVersion,
        private diagnostic: Diagnostic,
        private inAppBrowser: InAppBrowser,
        private ionicFile: File,
        private transfer: FileTransfer,
        private fileOpener: FileOpener,
        private camera: Camera,
        private http: HttpClient,
        private storage: Storage,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) {
    }

    isMobile(): boolean {
        return this.platform.is('mobile');
    }

    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }

    /**
     * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
     */
    getNetworkType(): string {
        return this.isMobile() ? this.network.type : 'wifi';
    }

    /**
     * 判断是否有网络
     */
    isConnecting(): boolean {
        return this.getNetworkType() !== 'none';
    }

    openUrlByBrowser(url: string) {
        this.inAppBrowser.create(url, '_system');
    }


    checkAppVersion() {
        if (!this.isMobile()) {
            return;
        }
        this.http.get(this.theDomain + '/getAppInfoOnline').subscribe(data => {
                if (data['code'] === 0) {
                    this.versionNumberOnline = data['data'];
                    this.getAppInfo();
                } else {
                    console.log('未能获取官方APP版本信息');
                }
            },
            err => {
                console.log('发生错误：' + JSON.stringify(err));
            });
    }

    getAppInfo() {
        this.appVersion.getVersionNumber().then(
            data => {
                this.versionNumber = data;
                this.checkAppVersionNumber();
            },
            err => {
                console.log('获取versionNumber失败', err);
            }
        );
    }

    checkAppVersionNumber() {
        const theVersionNumber = this.versionNumber.toString();
        const theVersionNumberOnline = this.versionNumberOnline.toString();
        const theVersionNumberArray = theVersionNumber.split('.');
        const theVersionNumberOnlineArray = theVersionNumberOnline.split('.');
        if (theVersionNumberArray[0] !== theVersionNumberOnlineArray[0]) {
            this.showUpdateAlert();
        }
    }

    async showUpdateAlert() {
        const alert = await this.alertCtrl.create({
            header: '版本更新',
            message: '检查到最新版本，是否进行更新',
            buttons: [
                {
                    text: '否', handler: () => {
                        console.log('用户选择不进行更新');
                    }
                },
                {
                    text: '是', handler: () => {
                        this.downloadApp();
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * 下载安装app
     */
    async downloadApp() {
        if (this.isIos()) { // ios打开网页下载
            return this.openUrlByBrowser(this.iosDownloadUrl);
        }
        if (this.isAndroid()) { // android本地下载
            let backgroundProcess = false; // 是否后台下载
            const alert = await this.alertCtrl.create({ // 显示下载进度
                header: '下载进度：0%',
                backdropDismiss: false,
                buttons: [{
                    text: '后台下载', handler: () => {
                        backgroundProcess = true;
                    }
                }]
            });
            await alert.present();

            const fileTransfer: FileTransferObject = this.transfer.create();
            const apk = this.ionicFile.externalRootDirectory + 'download/jingrongbank.apk'; // apk保存的目录

            // 下载并安装apk
            fileTransfer.download(this.theDomain + '/downloadFile/' + this.officialName, apk).then(
                async () => {
                    await alert.dismiss();
                    this.fileOpener.open(apk, 'application/vnd.android.package-archive');
                },
                async err => {
                    await alert.dismiss();
                    const alertTwo = await this.alertCtrl.create({
                        header: '前往网页下载',
                        message: '本地升级失败',
                        buttons: [{
                            text: '确定', handler: () => {
                                this.openUrlByBrowser(this.apkDownloadUrl); // 打开网页下载
                            }
                        }
                        ]
                    });
                    await alertTwo.present();
                });

            let timer = null; // 由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
            fileTransfer.onProgress((event: ProgressEvent) => {
                const progress = Math.floor(event.loaded / event.total * 100); // 下载进度
                this.updateProgress = progress;
                if (!timer) {
                    // 更新下载进度
                    timer = setTimeout(async () => {
                        if (progress === 100) {
                            await alert.dismiss();
                        } else {
                            if (!backgroundProcess) {
                                const title = document.getElementsByClassName('alert-title')[0];
                                title.innerHTML = `下载进度：${progress}%`;
                            }
                        }
                        clearTimeout(timer);
                        timer = null;
                    }, 1000);
                }
            });
        }
    }

    // 上传文件
    uploadFileTransfer(photoName: string, photoUrl: string): Observable<string> {
        const transfer: FileTransferObject = this.transfer.create();
        const fileType = APIService.getFileType(photoUrl);
        const fileName = APIService.getFileName(photoUrl);
        const fileMimeType = APIService.getFileMimeType(fileType);
        const options: FileUploadOptions = {
            fileKey: 'file',
            fileName: fileName,
            mimeType: fileMimeType,
            headers: {},
            params: {photoName}
        };
        const uploadFileUrl = APIService.domain + APIService.FILEAPI.uploadIdPhoto;

        return new Observable(observer => {
            // 上传进度
            transfer.onProgress(ProgressEvent => {
                if (ProgressEvent.lengthComputable) {
                    this.loadingStatus = Number(Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)).toFixed(2).toString() + '%';
                } else {
                    this.loadingStatus = 0;
                }
            });

            // 上传文件到服务器
            transfer.upload(photoUrl, uploadFileUrl, options, false)
                .then(data => {
                    const theData = data.response;
                    const fileLocation = JSON.parse(theData);
                    const theAvatarUrl = APIService.domain + fileLocation['location'];
                    observer.next(theAvatarUrl);
                }, err => {
                    alert(err.code);
                    observer.error();
                });
        });
    }

    createDir(dir: string): Promise<any> {
        // 判断文件夹是否存在 不存在创建 这里必须是外部文件
        return new Promise((resolve, reject) => {
            this.ionicFile.checkDir(this.ionicFile.dataDirectory, dir).then(_ => {
                resolve(true);
            }).catch(error => {
                this.ionicFile.createDir(this.ionicFile.dataDirectory, dir, true).then(result => {
                    resolve(true);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    downloadFileTransfer(theData) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const url = APIService.domain + APIService.FILEAPI.downloadFile + theData.officialName;
        fileTransfer.download(url, this.ionicFile.dataDirectory + theData.fileName).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            const fileType = APIService.getFileType(theData.fileName);
            const fileMIMEType = APIService.getFileMimeType(fileType);
            this.fileOpener.open(this.ionicFile.dataDirectory + theData.fileName, fileMIMEType)
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file: ' + JSON.stringify(e)));
        }, (error) => {
            console.log('下载错误：' + JSON.stringify(error));
        });
    }

    downloadByFileTransfer(url) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const fileName = APIService.getFileName(url);
        this.createDir('mydir');

        alert('准备下载：' + url);
        fileTransfer.download(url, this.ionicFile.externalDataDirectory + fileName).then((entry) => {
            alert('下载完成: ' + entry.toURL());
            const fileType = APIService.getFileType(fileName);
            const fileMIMEType = APIService.getFileMimeType(fileType);
            alert('下载文件的位置：' + this.ionicFile.externalDataDirectory + fileName);
            this.fileOpener.open(this.ionicFile.externalDataDirectory + fileName, fileMIMEType)
                .then(() => console.log('文件已打开'))
                .catch(e => alert('文件打开错误: ' + JSON.stringify(e)));
        }, (error) => {
            console.log('下载错误：' + JSON.stringify(error));
        });
    }

    /**
     * 使用mediaPicker拍照，手机上打不开，有点问题
     */
    takePhoto(options: CameraOptions): Observable<any> {
        return new Observable(observer => {
            const ops: CameraOptions = {
                // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, // 图片来源,CAMERA:1,拍照,PHOTOLIBRARY:2,相册
                // quality: 100, // 图像质量，范围为0 - 100
                // targetWidth: 150, // 缩放图像的宽度（像素）
                // targetHeight: 150, // 缩放图像的高度（像素）
                // mediaType: this.camera.MediaType.PICTURE,
                allowEdit: true, // 选择图片前是否允许编辑
                encodingType: this.camera.EncodingType.JPEG,
                saveToPhotoAlbum: true, // 是否保存到相册
                correctOrientation: true,
                ...options
            };
            const medias = [];
            MediaPicker.takePhoto(ops, media => {
                media.index = 0;
                medias.push(media);
                observer.next(medias);
            }, e => {
                console.log(e);
            });
        });
    }

    /**
     * 使用mediaPicker打开媒体相册，可多选
     */
    getMedias(maxSelectCount: number): Observable<any> {
        return new Observable(observer => {
            const args = {
                selectMode: 101,                // 101=picker image and video , 100=image , 102=video
                maxSelectCount: maxSelectCount, // default 40 (Optional)
                maxSelectSize: 188743680,       // 188743680=180M (Optional)
            };
            MediaPicker.getMedias(args, value => {
                observer.next(value);
            }, e => console.log(e));
        });
    }

    /**
     * 使用mediaPicker转换成base64文件
     */
    getThumbnail(media): Promise<BackPhoto> {
        return new Promise((resolve, reject) => {
            MediaPicker.extractThumbnail(
                media,
                data => {
                    const src = 'data:image/jpeg;base64,' + data.thumbnailBase64;
                    const style = 'transform:rotate(' + data.exifRotate + 'deg)';
                    const path = data.path;
                    const oneMedia = new BackPhoto(src, style, path);
                    resolve(oneMedia);  // 返回base64字符串集合
                },
                e => console.log(e)
            );
        });
    }

    /**
     * 使用camera拍照或打开媒体相册
     */
    getPicture(options: CameraOptions = {}): Observable<any> {
        return new Observable(observer => {
            const ops: CameraOptions = {
                // sourceType: this.camera.PictureSourceType.CAMERA, // 图片来源,CAMERA:1,拍照,PHOTOLIBRARY:2,相册
                // destinationType: this.camera.DestinationType.DATA_URL,
                // quality: 100,        // 图像质量，范围为0 - 100
                // targetWidth: 150,    // 缩放图像的宽度（像素）
                // targetHeight: 150,   // 缩放图像的高度（像素）
                mediaType: this.camera.MediaType.PICTURE,
                allowEdit: true,        // 选择图片前是否允许编辑
                encodingType: this.camera.EncodingType.JPEG,
                saveToPhotoAlbum: true, // 是否保存到相册
                correctOrientation: true,
                ...options
            };
            this.camera.getPicture(ops).then(image => {
                if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
                    observer.next('data:image/jpeg;base64,' + image);
                } else {
                    const filePath = image.slice(7);
                    observer.next(filePath);
                }
            }, error => {
                console.log('Error: ' + error);
                observer.error(false);
            }).catch(
                err => {
                    if (err === 20) {
                        alert('没有权限,请在设置中开启权限');
                    } else if (String(err).indexOf('cancel') !== -1) {
                        console.log('用户点击了取消按钮');
                    } else {
                        console.log(err, '使用cordova-plugin-camera获取照片失败');
                        alert('获取照片失败');
                    }
                    observer.error(false);
                });
        });
    }

    /**
     * HTML5定位
     * 如果在高德地图上显示，需转换为高德坐标系
     */
    getLocationHTML5() {
        if (navigator.geolocation) {
            const options = {enableHighAccuracy: true, timeout: 60000, maximumAge: 10000};
            navigator.geolocation.getCurrentPosition(this.show_position, this.show_error, options);
        } else {
            console.log('不支持HTML5地理定位');
        }
    }

    show_position(position) {
        // 存储经纬度
        const lngPosition = position.coords.longitude;
        const latPosition = position.coords.latitude;
        const theLocation = {lng: lngPosition, lat: latPosition};
        return JSON.stringify(theLocation);
    }

    show_error(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('用户拒绝请求地理定位');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('位置信息不可用');
                break;
            case error.TIMEOUT:
                alert('超时');
                break;
            case error.UNKNOWN_ERROR:
                alert('定位系统失效');
                break;
        }
        return null;
    }


    async downloadXHR(url: string, fileName: string, fileMIMEType: string) {
        const loading = await this.loadingCtrl.create({});

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'blob';
        xhr.addEventListener('loadstart', async ev => {
            await loading.present(); //  开始下载事件：下载进度条的显示
        });
        xhr.addEventListener('progress', ev => {
            const progress = '进度：' + Math.round(100.0 * ev.loaded / ev.total) + '%';  // 下载中事件：计算下载进度
            console.log(progress);
        });
        xhr.addEventListener('load', (ev) => {
            const blob = xhr.response;  // 下载完成事件：处理下载文件
            if (blob) {
                const path = this.ionicFile.externalDataDirectory;
                this.ionicFile.writeFile(path, fileName, blob, {
                    replace: true
                }).then(() => {
                    this.fileOpener.open(path + fileName, fileMIMEType);
                }).catch((err => {
                    alert(err);
                }));
            }
        });
        xhr.addEventListener('loadend', async ev => {   // 结束下载事件：下载进度条的关闭
            await loading.dismiss();
        });
        xhr.addEventListener('error', (ev) => {
            console.log(ev);
        });
        xhr.addEventListener('abort', (ev) => {
        });
        xhr.send();
    }


    async uploadXHR(url: string, blob: Blob, filename?: string) {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', url);

        xhr.onload = () => {
            if (xhr.status !== 200) {
                console.log('HTTP Error: ' + xhr.status);
                return;
            }

            const json = JSON.parse(xhr.responseText);
            if (!json || typeof json.location !== 'string') {
                console.log('Invalid JSON: ' + xhr.responseText);
                return;
            }
            return json.data;
        };

        const formData = new FormData();
        if (filename) {
            formData.append('file', blob, filename);
        } else {
            formData.append('file', blob);
        }
        xhr.send(formData);
    }


}
