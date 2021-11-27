import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MenuController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {BaseService} from './providers/base.service';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import {File} from '@ionic-native/file/ngx';
import {APIService} from './providers/api.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {NavigationEnd, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

    navigationSubscription;
    mediaQueryList: MediaQueryList;
    private _mediaQueryListener: () => void;
    private _eventType = 'resize';

    weatherCodesData: Array<object>;
    worker;

    userAvatarDefault = 'assets/images/ionic-person.svg';
    nickname = '昵称';
    userAvatar = this.userAvatarDefault;
    isSysadmin = false;

    theSearchPages = [
        {title: '银行搜索', url: '/bank'},
        {title: '新闻搜索', url: '/text/search'},
        {title: '理财搜索', url: '/wealth/search'},
        {title: '搜索历史', url: '/search/history'}
    ];

    theSocialPages = [
        {title: '社交圈', url: '/show/social'},
        {title: '关注圈', url: '/show/socialWatch'}
    ];

    theWealthPages = [
        {title: '银行理财', url: '/wealth/home'},
        {title: '公司金融', url: '/bank/work', target: '公司金融'},
        {title: '个人金融', url: '/bank/work', target: '个人金融'},
    ];

    theNewsPages = [
        {title: '银行新闻', url: '/text/home', target: '新闻'},
        {title: '银行公告', url: '/text/home', target: '公告'},
        {title: '银行招聘', url: '/bank/hr'}
    ];

    theSysadminPages = [
        {title: '后台主页', url: '/sysadmin/home'},
        {title: '用户管理', url: '/sysadmin/user'},
        {title: '文章管理', url: '/sysadmin/writing'},
        {title: '文件管理', url: '/sysadmin/file'},
        {title: '广告管理', url: '/sysadmin/slide'},
        {title: '访问统计', url: '/sysadmin/visitor'},
        {title: '开发测试', url: '/sysadmin/test'},
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private backgroundMode: BackgroundMode,
        private androidPermissions: AndroidPermissions,
        private speechRecognition: SpeechRecognition,
        private ionicFile: File,
        private baseService: BaseService,
        private changeDetectorRef: ChangeDetectorRef,
        private mediaMatcher: MediaMatcher,
        private router: Router,
        private menu: MenuController,
        private http: HttpClient,
    ) {
        this.initializeApp();
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                const url = event.url;
                this.isSysadmin = false;
                if (url === '/search/home' || url === '/search' || url === '/') {
                    this.getData();
                } else if (url.indexOf('sysadmin') !== -1) {
                    this.isSysadmin = true;
                }
            }
        });
    }

    initializeApp() {
        this.backgroundMode.enable();
        this.baseService.updateVisitor();
        this.platform.ready().then(res => {
            this.statusBar.overlaysWebView(true);
            this.splashScreen.hide();
            this.requestPermission();
        });
    }

    requestPermission() {
        const isAndroid = this.platform.is('android');
        if (isAndroid === true) {
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
                .then(
                    result => {
                        if (!result.hasPermission) {
                            this.androidPermissions.requestPermissions([
                                this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
                                this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
                                this.androidPermissions.PERMISSION.READ_PHONE_STATE,
                                this.androidPermissions.PERMISSION.CAMERA,
                                this.androidPermissions.PERMISSION.RECORD_AUDIO,
                                this.androidPermissions.PERMISSION.READ_CONTACTS,
                                this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
                                this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
                                this.androidPermissions.PERMISSION.GET_ACCOUNTS,
                                this.androidPermissions.PERMISSION.READ_SMS,
                            ]);
                        }
                    }, error => {
                        alert('鉴权error内容是：' + error.toString());
                    }
                ).catch(
                err => alert('需要手动开启权限：' + err.toString())
            );
        }
    }

    requestSpeechPermission() {
        this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
            if (hasPermission === false) {
                this.speechRecognition.requestPermission().then(
                    () => console.log('Granted'),
                    () => console.log('Denied')
                );
            }
        });
    }

    ngOnInit() {
        this.setMobileQuery();
        this.startWorker();
        this.baseService.getWatchUsers();
    }

    setMobileQuery() {
        this.mediaQueryList = this.mediaMatcher.matchMedia('(min-width: 3600px)');
        this._mediaQueryListener = () => this.changeDetectorRef.detectChanges();
        this.mediaQueryList.addEventListener(this._eventType, this._mediaQueryListener);
    }

    ngOnDestroy() {
        this.mediaQueryList.removeEventListener(this._eventType, this._mediaQueryListener);
        if (this.worker) {
            this.worker.terminate();
        }
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    logout() {
        this.menu.close('mains');
        this.nickname = '昵称';
        this.userAvatar = this.userAvatarDefault;
        this.baseService.logout();
        return this.router.navigate(['/']);
    }

    startWorker() {
        const city = localStorage.getItem(APIService.SAVE_LOCAL.currentCity);
        if (city) {
            this.http.get<any>('assets/jsons/weatherCity.json').subscribe(res => {
                this.weatherCodesData = res;

                if (typeof Worker !== 'undefined') {
                    this.worker = new Worker('./app.worker', {type: 'module'});
                    this.worker.onmessage = (dataOut) => {
                        const idNeed = dataOut.data;
                        if (idNeed) {
                            this.baseService.getWeather(dataOut.data);
                        }
                    };
                    const dataIn = {city, cityCodes: this.weatherCodesData};
                    this.worker.postMessage(dataIn);
                } else {
                    console.log('不支持Web Workers，请自定义需要后台运行的方法逻辑');
                }
            });
        }
    }

    getData() {
        if (this.baseService.isLogin()) {
            this.baseService.getUserOutline().subscribe(data => {
                if (data) {
                    this.nickname = data.nickname ? data.nickname : undefined;
                }
            })
            this.userAvatar = localStorage.getItem(APIService.SAVE_LOCAL.userAvatar);
            if (!this.userAvatar) {
                this.getAvatar();
            }
        }
    }

    getAvatar() {
        this.baseService.httpGet(APIService.SYSUSER.getAvatar, null, data => {
            if (data.code === 0) {
                this.userAvatar = data.data;
                localStorage.setItem(APIService.SAVE_LOCAL.userAvatar, this.userAvatar);
            }
        });
    }

    goToPage(page) {
        const commands = page.target ? [page.url, {target: page.target}] : [page.url];
        return this.router.navigate(commands).then(() => {
            this.menu.close('mains');
        });
    }
}
