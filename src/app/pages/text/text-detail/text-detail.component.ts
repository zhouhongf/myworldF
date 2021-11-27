import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {bankNameLink} from '../../../models/bank-name';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {TextToSpeech} from '@ionic-native/text-to-speech/ngx';
import {Storage} from '@ionic/storage';


@Component({
    selector: 'app-text-detail',
    templateUrl: './text-detail.component.html',
    styleUrls: ['./text-detail.component.scss'],
})
export class TextDetailComponent implements OnInit {
    backUrl;
    backTarget;

    dataShow;
    bankLogoUrl;
    bankNameList = [];
    linkPattern = new RegExp(APIService.linkPattern, 'i');
    isSpeaking = false;

    isFavor = false;
    isLogin = false;

    constructor(
        private baseService: BaseService,
        private route: ActivatedRoute,
        private storage: Storage,
        private router: Router,
        private inAppBrowser: InAppBrowser,
        private tts: TextToSpeech) {
    }

    ngOnInit() {
        this.getRouteParams();
        for (const one of bankNameLink) {
            this.bankNameList.push(one.name);
        }
    }

    getRouteParams() {
        this.route.paramMap.subscribe(data => {
            const targetId = data.get('id');
            this.backUrl = data.get('backUrl');
            this.backTarget = data.get('target');
            this.isLogin = this.baseService.isLogin();
            if (targetId) {
                this.getData(targetId);
            }
        });
    }

    getData(targetId: string) {
        this.dataShow = undefined;
        this.storage.get(APIService.SAVE_STORAGE.favorTexts).then(data => {
            if (data) {
                for (const one of data) {
                    if (targetId === one.id) {
                        this.isFavor = true;
                        this.dataShow = one;
                        const name = this.dataShow.bankName;
                        if (this.bankNameList.indexOf(name) !== -1) {
                            this.bankLogoUrl = APIService.assetsBankLogoSmall + name + '.png';
                        }
                        break;
                    }
                }
                if (this.dataShow) {
                    return;
                }
            }
            return this.getDataRemote(targetId);
        })
    }

    getDataRemote(targetId: string) {
        this.baseService.httpGet(APIService.WEALTH.text + targetId, null, data => {
            if (data.code === 0) {
                // console.log('data是：', data.data);
                this.dataShow = data.data;
                const name = this.dataShow.bankName;
                if (this.bankNameList.indexOf(name) !== -1) {
                    this.bankLogoUrl = APIService.assetsBankLogoSmall + name + '.png';
                }
            }
        });
    }

    goToExternal(value: string) {
        const resultOne = this.linkPattern.test(value);
        if (resultOne) {
            return this.inAppBrowser.create(value, '_self', 'location=no');
        }
    }

    goBack() {
        if (this.backTarget) {
            return this .router.navigate([this.backUrl, {target: this.backTarget}]);
        } else {
            return this.router.navigateByUrl(this.backUrl);
        }
    }

    startRead(content) {
        this.isSpeaking = true;
        this.tts.speak({text: content, locale: 'zh-CN', rate: 0.75})
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
    }

    stopRead() {
        this.isSpeaking = false;
        this.tts.stop()
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
    }


    setFavor() {
        if (this.isFavor) {
            this.delFavor();
        } else {
            this.addFavor();
        }
    }

    addFavor() {
        const wealthId = this.dataShow.id;
        this.storage.get(APIService.SAVE_STORAGE.favorTexts).then(data => {
            if (data) {
                for (const one of data) {
                    if (one.id === wealthId) {
                        this.isFavor = true;
                        break;
                    }
                }
                if (this.isFavor) {
                    return;
                }
                this.isFavor = true;
                data.push(this.dataShow);
                return this.storage.set(APIService.SAVE_STORAGE.favorTexts, data);
            }
            this.isFavor = true;
            const dataNew = [];
            dataNew.push(this.dataShow);
            return this.storage.set(APIService.SAVE_STORAGE.favorTexts, dataNew);
        })
    }

    delFavor() {
        const wealthId = this.dataShow.id;
        this.storage.get(APIService.SAVE_STORAGE.favorTexts).then(data => {
            if (data) {
                for (let i=0; i<data.length; i++) {
                    const one = data[i];
                    if (one.id === wealthId) {
                        data.splice(i, 1);
                        break;
                    }
                }
                this.isFavor = false;
                return this.storage.set(APIService.SAVE_STORAGE.favorTexts, data);
            }
        })
    }

}
