import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-auth-login-sms',
    templateUrl: './auth-login-sms.component.html',
    styleUrls: ['./auth-login-sms.component.scss']
})
export class AuthLoginSmsComponent implements OnInit {
    isMobile = false;
    smsLoginForm: FormGroup;
    usernamePattern = APIService.usernamePattern;

    tips = '获取验证码';
    disabled = false;

    playerType: string;

    constructor(private formBuilder: FormBuilder, private baseService: BaseService, private route: ActivatedRoute, private router: Router) {
        this.isMobile = this.baseService.isMobile();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.smsLoginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
            smsCode: ['', Validators.required],
        });
    }

    get username() {
        return this.smsLoginForm.get('username');
    }

    get smsCode() {
        return this.smsLoginForm.get('smsCode');
    }


    tryGetCode(event: any) {
        this.baseService.doseUserExists(this.username.value.trim()).subscribe(
            data => {
                if (data['code'] === -2) {
                    this.baseService.presentConfirmToast('用户名不存在');
                    this.username.reset();
                } else {
                    this.getCode(event);
                }
            });
    }

    getCode(event: any) {
        this.baseService.getSmsCode(this.username.value)
            .subscribe(data => {
                console.log('成功获取短信验证码');
            });
        let anumber = 60;
        this.disabled = true;
        const that = this;
        that.tips = anumber + 's倒计时';
        const timer = setInterval( () => {
            anumber --;
            if (anumber === 0) {
                that.disabled = false;
                that.tips = '获取验证码';
                clearInterval(timer);
            } else {
                that.tips = anumber + 's倒计时';
            }
        }, 1000);
    }


    smsLogin() {
        const username = this.username.value.trim();
        this.baseService.smsLogin(username, this.smsCode.value.trim()).subscribe(
            data => {
                if (data['code'] === 0) {
                    const userData = data['data'];
                    this.playerType = userData['playerType'];
                    this.baseService.setCurrentUser(userData);
                    const currentUser = JSON.parse(this.baseService.cDecrypt(userData));

                    console.log('currentUser是：', currentUser);
                    const roles = currentUser.roles;
                    let urlNext = '/';
                    for (const role of roles) {
                        if (role.startsWith('ADMIN')) {
                            urlNext = '/sysadmin';
                            break;
                        }
                    }
                    return this.router.navigate([urlNext]);
                    // return window.location.replace('http://localhost:8100');
                } else {
                    this.baseService.presentToast('登录失败');
                }
            },
            error => {
                this.baseService.presentToast(error);
            });
        this.smsLoginForm.reset();
    }

}

