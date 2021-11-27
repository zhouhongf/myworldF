import {Injectable} from '@angular/core';
import {APIService} from './api.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import {Observable} from 'rxjs';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Contacts} from '@ionic-native/contacts/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    charsFull = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    charsNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    theDomain = APIService.domain;
    // Cryptojs加密
    cKey = CryptoJS.enc.Utf8.parse('myworldmypasskey');

    constructor(
        private platform: Platform,
        private geolocation: Geolocation,
        private http: HttpClient,
        private contacts: Contacts,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private storage: Storage,
        private httpAdv: HTTP
    ) {
    }

    getWeather(cityCode: string) {
        const timestamp = new Date().getTime();
        const url = APIService.weatherUrl + cityCode + '.html';
        const referer = APIService.weatherReferer + cityCode + '.shtml';
        // this.httpAdv.setHeader('*', 'Referer', referer);
        if (this.isMobile()) {
            this.httpAdv.get(url, {_: timestamp.toString()}, {Referer: referer})
                .then(data => {
                    if (data.status === 200) {
                        // console.log(data.data);
                        const dataRaw = data.data.toString();
                        const dataNet = dataRaw.substring(12);
                        const dataJson = JSON.parse(dataNet);
                        const temp = dataJson.temp;
                        const weather = dataJson.weather;
                        this.presentToast('温度是：' + temp + ', 天气是：' + weather);
                        if (temp) {
                            localStorage.setItem(APIService.SAVE_LOCAL.cityTemp, temp + '°C');
                        }
                        if (weather) {
                            localStorage.setItem(APIService.SAVE_LOCAL.cityWeather, weather);
                        }
                    }
                })
                .catch(error => {
                    console.log(error.error);
                });
        } else {
            console.log('不是手机...');
        }
    }

    isMobile(): boolean {
        const deviceType = localStorage.getItem(APIService.SAVE_LOCAL.deviceType);
        if (deviceType) {
            return deviceType === APIService.mobile;
        } else {
            return this.platform.is('mobile');
        }
    }

    cEncrypt(data: string): string {
        const encrypted = CryptoJS.AES.encrypt(data, this.cKey, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString();
        return encrypted;
    }

    cDecrypt(data: string): string {
        const decrypted = CryptoJS.AES.decrypt(data, this.cKey, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        return CryptoJS.enc.Utf8.stringify(decrypted).toString();
    }

    addSaltPassword(word: string): string {
        let saltWord = '';
        if (word.length < 6) {
            return null;
        } else {
            const wordLeft = word.substring(6);
            for (let i = 0; i < 6; i++) {
                const letter = word.charAt(i);
                let theSalt = '';
                for (let n = 0; n < (i + 1); n++) {
                    const id = Math.ceil(Math.random() * 35);
                    const theChar = this.charsFull[id];
                    theSalt = theSalt + theChar.toString();
                }
                saltWord = saltWord + letter.toString() + theSalt;
            }
            return saltWord + wordLeft;
        }
    }

    addSaltUsername(word: string): string {
        let saltWord = '';
        if (word.length < 11) {
            return null;
        } else {
            const one = word.charAt(0).toString();
            const two = word.substr(1, 2);
            const three = word.substr(3, 3);
            const four = word.substr(6, 4);
            const five = word.substring(10);
            const theList = [one, two, three, four, five];
            for (let i = 0; i < 5; i++) {
                const theWord = theList[i];
                let theSalt = '';
                for (let n = 0; n < (i + 1); n++) {
                    const id = Math.ceil(Math.random() * 9);
                    const theChar = this.charsNum[id];
                    theSalt = theSalt + theChar.toString();
                }
                saltWord = saltWord + theWord + theSalt;
            }
            return saltWord;
        }
    }


    // 对参数进行编码
    encode(params) {
        let str = '';
        if (params) {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = '?' + str.substring(0, str.length - 1);
        }
        return str;
    }

    async httpGet(url, params, callback?, loader: boolean = false) {
        const loading = await this.loadingCtrl.create({});
        if (loader) {
            await loading.present();
        }
        this.http.get(this.theDomain + url + this.encode(params)).subscribe(
            async data => {
                if (loader) {
                    await loading.dismiss();
                }
                callback(data == null || data['code'] === 9 ? '[]' : data);
            },
            async error => {
                if (loader) {
                    await loading.dismiss();
                }
                this.handleError(error);
            });
    }

    async httpPost(url, params, body, callback?, loader: boolean = false) {
        const loading = await this.loadingCtrl.create();
        if (loader) {
            await loading.present();
        }
        this.http.post(this.theDomain + url + this.encode(params), body).subscribe(
            async data => {
                if (loader) {
                    await loading.dismiss();
                }
                callback(data == null || data['code'] === 9 ? '[]' : data);
            },
            async error => {
                if (loader) {
                    await loading.dismiss();
                }
                this.handleError(error);
            });
    }


    async httpDelete(url, params, callback?, loader: boolean = false) {
        const loading = await this.loadingCtrl.create({});
        if (loader) {
            await loading.present();
        }
        this.http.delete(this.theDomain + url + this.encode(params)).subscribe(
            async data => {
                if (loader) {
                    await loading.dismiss();
                }
                callback(data == null || data['code'] === 9 ? '[]' : data);
            },
            async error => {
                if (loader) {
                    await loading.dismiss();
                }
                this.handleError(error);
            });
    }


    handleError(error: Response | any) {
        let msg = '';
        if (error.status === 400) {
            msg = '请求无效(code：404)';
            console.log('请检查参数类型是否匹配');
        }
        if (error.status === 404) {
            msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (error.status === 500) {
            msg = '服务器发生错误(code：500)';
            console.error(msg + '，请检查路径是否正确');
        }
        console.log(error);
        if (msg !== '') {
            this.presentToast(msg);
        }
    }

    async alert(message, callback?) {
        if (callback) {
            const alert = await this.alertCtrl.create({
                header: '提示',
                message,
                buttons: [{
                    text: '确定', handler: data => {
                        callback();
                    }
                }]
            });
            await alert.present();
        } else {
            const alert = await this.alertCtrl.create({
                header: '提示',
                message,
                buttons: ['确定']
            });
            await alert.present();
        }
    }


    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({message, duration: 3000});
        toast.present().then(value => {
            return value;
        });
    }

    async presentConfirmToast(message: string) {
        const toast = await this.toastCtrl.create({message});
        toast.onDidDismiss().then(() => {
            return null;
        });
        toast.present().then(value => {
            return value;
        });
    }


    getImageCode() {
        const rand = Math.random();
        const value = Math.floor(rand * 10000 + 1);
        const codeKey = (Date.now().toString() + value.toString());
        sessionStorage.setItem(APIService.SAVE_SESSION.imageCodeParam, codeKey);
        return this.http.get(this.theDomain + '/validatecode/image?random=' + codeKey);
    }

    getSmsCode(phone: string) {
        const saltUsername = this.addSaltUsername(phone);
        const codedUsername = this.cEncrypt(saltUsername);
        return this.http.get(this.theDomain + '/validatecode/sms?mobile=' + codedUsername);
    }

    login(username: string, password: string, imagecode: string) {
        // 重要，用于匹配服务端缓存的验证码的key
        const imageCodeParam = sessionStorage.getItem(APIService.SAVE_SESSION.imageCodeParam);
        const headers = new HttpHeaders({imageCodeParam});
        const saltUsername = this.addSaltUsername(username);
        const codedUsername = this.cEncrypt(saltUsername);
        const saltPassword = this.addSaltPassword(password);
        const codedPassword = this.cEncrypt(saltPassword);
        return this.http.post(this.theDomain + '/cauth/doLogin?username=' + codedUsername + '&password=' + codedPassword + '&imageCode=' + imagecode, null, {headers});
    }

    smsLogin(username: string, smsCode: string) {
        const saltUsername = this.addSaltUsername(username);
        const codedUsername = this.cEncrypt(saltUsername);
        return this.http.post(this.theDomain + '/cauth/doSmsLogin?mobile=' + codedUsername + '&smsCode=' + smsCode, null);
    }

    register(username: string, smsCode: string, password: string) {
        const saltUsername = this.addSaltUsername(username);
        const codedUsername = this.cEncrypt(saltUsername);
        const saltPassword = this.addSaltPassword(password);
        const codedPassword = this.cEncrypt(saltPassword);
        return this.http.post(this.theDomain + '/cauth/doRegister?mobile=' + codedUsername + '&smsCode=' + smsCode, codedPassword);
    }

    // 管理员创建Sysuser
    setUser(username: string, password: string, sysroles: Array<any>, wid?: string) {
        const saltUsername = this.addSaltUsername(username);
        const codedUsername = this.cEncrypt(saltUsername);
        const saltPassword = this.addSaltPassword(password);
        const codedPassword = this.cEncrypt(saltPassword);
        let url = this.theDomain + '/cauth/adminSetUser?username=' + codedUsername + '&password=' + codedPassword;
        if (wid) {
            url = url + '&wid=' + wid;
        }
        return this.http.post(url, sysroles);
    }

    logout() {
        localStorage.removeItem(APIService.SAVE_LOCAL.currentUser);
        localStorage.removeItem(APIService.SAVE_LOCAL.nickname);
        localStorage.removeItem(APIService.SAVE_LOCAL.userAvatar);
        localStorage.removeItem(APIService.SAVE_LOCAL.contactTags);
        localStorage.removeItem(APIService.SAVE_LOCAL.currentFriendTemp);
        this.storage.remove(APIService.SAVE_STORAGE.allContacts);
        this.storage.remove(APIService.SAVE_STORAGE.phoneContacts);
        this.storage.remove(APIService.SAVE_STORAGE.friendApplies);
    }

    doseUserExists(username: string) {
        const saltUsername = this.addSaltUsername(username);
        const codedUsername = this.cEncrypt(saltUsername);
        return this.http.get(this.theDomain + '/cauth/exists?username=' + codedUsername);
    }

    changeUsername(usernameold: string, username: string, smsCode: string, idnumber: string) {
        const saltUsernameold = this.addSaltUsername(usernameold);
        const codedUsernameold = this.cEncrypt(saltUsernameold);
        const saltUsername = this.addSaltUsername(username);
        const codedUsername = this.cEncrypt(saltUsername);
        const codedIdnumber = this.cEncrypt(idnumber);
        return this.http.post(this.theDomain + '/cauth/doChangeUsername?usernameold=' + codedUsernameold + '&mobile=' + codedUsername + '&smsCode=' + smsCode, codedIdnumber);
    }

    changePassword(passwordold: string, password: string) {
        const saltPasswordold = this.addSaltPassword(passwordold);
        const codedPasswordold = this.cEncrypt(saltPasswordold);
        const saltPassword = this.addSaltPassword(password);
        const codedPassword = this.cEncrypt(saltPassword);
        return this.http.post(this.theDomain + '/cauth/doChangePassword?passwordold=' + codedPasswordold, codedPassword);
    }

    resetPassword(username: string, password: string, smsCode: string) {
        const saltUsername = this.addSaltUsername(username);
        const codedUsername = this.cEncrypt(saltUsername);
        const saltPassword = this.addSaltPassword(password);
        const codedPassword = this.cEncrypt(saltPassword);
        return this.http.post(this.theDomain + '/cauth/doResetPassword?mobile=' + codedUsername + '&smsCode=' + smsCode, codedPassword);
    }

    isLogin(): boolean {
        const data = this.getCurrentUser();
        if (data) {
            const deadline = data.expireTime;
            if (deadline != null) {
                if (Date.now() < deadline) {
                    return true;
                }
            }
        }
        return false;
    }

    getWidLocal(): string {
        const data = this.getCurrentUser();
        if (data) {
            const wid = data.wid;
            if (wid) {
                return wid;
            }
        }
        return null;
    }

    checkWidNicknameAvatar(): boolean {
        if (!localStorage.getItem(APIService.SAVE_LOCAL.nickname)) {
            return false;
        }
        if (!localStorage.getItem(APIService.SAVE_LOCAL.userAvatar)) {
            return false;
        }
        const wid = this.getWidLocal();
        return wid !== null;
    }

    setCurrentUser(userData: string) {
        localStorage.setItem(APIService.SAVE_LOCAL.currentUser, userData);
    }

    getCurrentUser() {
        const value = localStorage.getItem(APIService.SAVE_LOCAL.currentUser);
        const currentUser = value ? JSON.parse(this.cDecrypt(value)) : null;
        console.log('currentUser是：', currentUser);
        return currentUser;
    }

    delCurrentUser() {
        localStorage.removeItem(APIService.SAVE_LOCAL.currentUser);
    }

    getUserOutline(): Observable<any> {
        return new Observable<any>(observer => {
            const value = localStorage.getItem(APIService.SAVE_LOCAL.userOutline);
            let userOutline = value ? JSON.parse(value) : null;
            if (userOutline) {
                return observer.next(userOutline);
            }
            this.httpGet(APIService.SYSUSER.getUserOutline, {}, data => {
                if (data.code === 0) {
                    userOutline = data.data;
                    localStorage.setItem(APIService.SAVE_LOCAL.userOutline, JSON.stringify(userOutline));
                    return observer.next(userOutline);
                } else {
                    console.log(data.msg);
                    return observer.next(null);
                }
            })
        });
    }

    getWatchUsers(): Observable<any> {
        return new Observable<any>(observer => {
            this.storage.get(APIService.SAVE_STORAGE.watchUsers).then(value => {
                if (value) {
                    return observer.next(value);
                } else {
                    this.httpGet(APIService.SYSUSER.getWatchUsers, null, data => {
                        if (data.code === 0) {
                            const watchUsers = data.data;
                            this.storage.set(APIService.SAVE_STORAGE.watchUsers, watchUsers).then(() => {
                                return observer.next(watchUsers);
                            })
                        } else {
                            console.log(data.msg);
                            return observer.next(null);
                        }
                    })
                }
            })
        });
    }

    syncWatchUsers(): Observable<any> {
        return new Observable<any>(observer => {
            this.httpGet(APIService.SYSUSER.getWatchUsers, null, data => {
                if (data.code === 0) {
                    const watchUsers = data.data;
                    this.storage.set(APIService.SAVE_STORAGE.watchUsers, watchUsers).then(() => {
                        return observer.next(watchUsers);
                    })
                } else {
                    console.log(data.msg);
                    return observer.next(null);
                }
            }, true)
        });
    }

    addUserWatchLocal(userWatchData) {
        this.storage.get(APIService.SAVE_STORAGE.watchUsers).then(data => {
            if (data) {
                let isExist = false;
                const userWidWatch = userWatchData.id;
                for (const one of data) {
                    if (one.id === userWidWatch) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist === false) {
                    data.push(userWatchData);
                    this.storage.set(APIService.SAVE_STORAGE.watchUsers, data);
                }
            } else {
                this.storage.set(APIService.SAVE_STORAGE.watchUsers, [userWatchData]);
            }
        })
    }

    delUserWatchLocal(userWidWatch) {
        this.storage.get(APIService.SAVE_STORAGE.watchUsers).then(data => {
            if (data) {
                for (let i=0; i < data.length; i++) {
                    const one = data[i]
                    if (one.id === userWidWatch) {
                        data.splice(i, 1)
                        break;
                    }
                }
                this.storage.set(APIService.SAVE_STORAGE.watchUsers, data);
            }
        })
    }


    isExpire(expireTime): boolean {
        const nowTime = new Date().getTime();
        return nowTime > Number(expireTime);
    }

    makeExpireTimeMonthly() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const theMonthBeginStr = year + '\/' + month + '\/1';
        const theMonthBegin = new Date(theMonthBeginStr);
        const expireTime = theMonthBegin.getTime() + APIService.cityDataValidTime;
        return expireTime;
    }

    getTodayBegin() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const d = new Date(year, month, day, 0, 0, 0, 0);
        return d.getTime();
    }

    getYearBegin() {
        const date = new Date();
        const year = date.getFullYear();
        const d = new Date(year, 0, 1, 0, 0, 0, 0);
        return d.getTime();
    }

    // 下载文件
    downloadFile(officialName: string) {
        return this.http.get(APIService.domain + APIService.FILEAPI.downloadFile + officialName, {responseType: 'blob'});
    }


    /**
     * 判断客户端是手机，还是非手机
     * 更新访问者信息，并返回当前城市和经纬度信息
     */
    updateVisitor() {
        if (this.isMobile()) {
            localStorage.setItem(APIService.SAVE_LOCAL.deviceType, APIService.mobile);
        } else {
            localStorage.setItem(APIService.SAVE_LOCAL.deviceType, APIService.browse);
        }

        this.http.get(APIService.domain + APIService.SYSUSER.updateVisitor).subscribe(data => {
            if (data['code'] === 0) {
                const cityData = data['data'];
                const lngLat = cityData.lngLat;
                const city = cityData.city;
                const temp = cityData.temp;
                const weather = cityData.weather;

                if (city) {
                    localStorage.setItem(APIService.SAVE_LOCAL.currentCity, city);
                }
                if (lngLat) {
                    const lngLatList = lngLat.split(',');
                    const cityLngLat = {lng: lngLatList[0], lat: lngLatList[1]};
                    // 通过IP地址得到的城市经纬度后，需要转换为高德坐标系，不过不转也没关系
                    localStorage.setItem(APIService.SAVE_LOCAL.cityLngLat, JSON.stringify(cityLngLat));
                }
                if (temp) {
                    localStorage.setItem(APIService.SAVE_LOCAL.cityTemp, temp + '&#176;C');
                }
                if (weather) {
                    localStorage.setItem(APIService.SAVE_LOCAL.cityWeather, weather);
                }
            } else {
                this.presentToast(data['msg']);
            }
        });
    }




    /**
     * 获取银行网点地址
     */
    getBankLocations(bankName): Observable<any> {
        const cityname = localStorage.getItem(APIService.SAVE_LOCAL.currentCity);
        const key = cityname + '-' + bankName;

        return new Observable<any>(observer => {
            this.storage.get(key).then(locations => {
                if (locations) {
                    return observer.next(locations);
                }
                this.httpGet(APIService.WEALTH.bankLocations,{cityname, bankName}, data => {
                    if (data.code === 0) {
                        const locationsRemote = data.data;
                        if (locationsRemote && locationsRemote.length > 0) {
                            this.storage.set(key, locationsRemote);
                            return observer.next(locationsRemote);
                        }
                    }
                    this.presentToast(data.msg);
                    return observer.next(null);
                }, true);
            });
        });
    }


    /**
     * 以下为理财板块 实时 数据检查和获取
     */
    saveWealthRankData(key, data) {
        const updateTimeStr = data[0].updateTime;
        const updateTime = new Date(updateTimeStr).getTime();
        const expireTime = updateTime + APIService.dataValidTime;
        this.storage.set(key, {expireTime, data});
    }
}
