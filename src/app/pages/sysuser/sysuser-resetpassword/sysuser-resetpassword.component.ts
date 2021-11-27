import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';

@Component({
    selector: 'app-sysuser-resetpassword',
    templateUrl: './sysuser-resetpassword.component.html',
    styleUrls: ['./sysuser-resetpassword.component.scss']
})
export class SysuserResetpasswordComponent implements OnInit {
    changepasswordForm: FormGroup;
    passwordPattern = APIService.passwordPattern;

    isShowPassword = false;

    tips = '获取验证码';
    disabled = false;
    username;

    constructor(private baseService: BaseService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.createForm();
        this.getUsername();
    }

    goBack() {
        this.router.navigate(['/sysuser/settings']);
    }

    getUsername() {
        this.baseService.httpGet(APIService.SYSUSER.getUsername, null, data => {
           if (data) {
               this.username = data.toString();
           }
        });
    }

    createForm() {
        this.changepasswordForm = new FormGroup({
            password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
            passwordConfirm: new FormControl('', Validators.required),
            smsCode: new FormControl('', Validators.required),
        });
    }

    get password() {
        return this.changepasswordForm.get('password');
    }

    get passwordConfirm() {
        return this.changepasswordForm.get('passwordConfirm');
    }

    get smsCode() {
        return this.changepasswordForm.get('smsCode');
    }

    showPassword(event) {
        event.preventDefault();
        this.isShowPassword = !this.isShowPassword;
    }


    resetPassword() {
        if (this.passwordConfirm.value !== this.password.value) {
            return this.baseService.presentToast('两次输入的密码不一致');
        }
        this.baseService.resetPassword(this.username, this.password.value.trim(), this.smsCode.value.trim()).subscribe(data => {
            if (data['code'] === 0) {
                this.goBack();
            }
            this.baseService.presentToast(data['msg']);
        });
        this.changepasswordForm.reset();
    }

    getCode(event: any) {
        this.baseService.getSmsCode(this.username).subscribe(
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
