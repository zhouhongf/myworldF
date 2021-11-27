import { Component, OnInit } from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {usernameExistValidator} from '../../../tool/directives/username-exist.directive';

@Component({
    selector: 'app-auth-register',
    templateUrl: './auth-register.component.html',
    styleUrls: ['./auth-register.component.scss']
})
export class AuthRegisterComponent implements OnInit {
    isMobile = false;
    registrationForm: FormGroup;
    usernamePattern = APIService.usernamePattern;
    passwordPattern = APIService.passwordPattern;
    tips = '获取验证码';
    disabled = false;

    isShowPassword = false;

    constructor(private formBuilder: FormBuilder, private baseService: BaseService, private route: ActivatedRoute, private router: Router) {
        this.isMobile = baseService.isMobile();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.registrationForm = this.formBuilder.group({
            username: new FormControl('', {validators: [Validators.required, Validators.pattern(this.usernamePattern)], asyncValidators: usernameExistValidator(this.baseService), updateOn: 'blur'}),
            password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
            passwordConfirm: new FormControl('', {validators: Validators.required, updateOn: 'blur'}),
            smsCode: ['', Validators.required],
            isagree: true,
        });
    }

    get username() {
        return this.registrationForm.get('username');
    }

    get password() {
        return this.registrationForm.get('password');
    }

    get passwordConfirm() {
        return this.registrationForm.get('passwordConfirm');
    }

    get smsCode() {
        return this.registrationForm.get('smsCode');
    }

    get isagree() {
        return this.registrationForm.get('isagree');
    }

    showPassword(event) {
        event.preventDefault();
        this.isShowPassword = !this.isShowPassword;
    }

    onSignup() {
        if (this.password.value !== this.passwordConfirm.value) {
            this.baseService.presentToast('两次输入的密码不一致');
        } else {
            const theUsername = this.username.value.trim();
            this.baseService.register(this.username.value.trim(), this.smsCode.value.trim(), this.password.value.trim()).subscribe(
                data => {
                    if (data['code'] === 0) {
                        if (this.isMobile) {
                            return this.router.navigate(['/auth/login', {username: theUsername}]).then(() => {
                                this.baseService.presentToast('注册成功，请登录！');
                            });
                        } else {
                            this.baseService.presentToast('注册成功，请登录！');
                            // window.location.replace('http://www.jingrongbank.com/#/auth/login');
                            window.location.replace('http://localhost:8100/#/auth/login');
                        }
                    } else {
                        this.baseService.presentToast(data['msg']);
                    }
                },
                error => {
                    this.baseService.presentToast(error);
                });
            this.registrationForm.reset();
        }
    }


    getCode(event: any) {
        this.baseService.getSmsCode(this.username.value).subscribe(
            data => {
                console.log('成功获取验证码');
            });

        let anumber = 60;
        this.disabled = true;
        const that = this;
        that.tips = anumber + 's倒计时';
        const timer = setInterval(() => {
            anumber--;
            if (anumber === 0) {
                that.disabled = false;
                that.tips = '获取验证码';
                clearInterval(timer);
            } else {
                that.tips = anumber + 's倒计时';
            }
        }, 1000);
    }

}
