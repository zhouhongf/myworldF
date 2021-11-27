import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sysuser-changephone',
    templateUrl: './sysuser-changephone.component.html',
    styleUrls: ['./sysuser-changephone.component.scss']
})
export class SysuserChangephoneComponent implements OnInit {

    changephoneForm: FormGroup;
    usernamePattern = APIService.usernamePattern;
    accountStatus: string;

    tips = '获取验证码';
    disabled = false;

    constructor(private formBuilder: FormBuilder, private baseService: BaseService, private router: Router) {
        this.createForm();
    }

    ngOnInit() {
        this.accountStatus = localStorage.getItem(APIService.SAVE_LOCAL.accountStatus);
    }

    goBack() {
        this.router.navigate(['/sysuser']);
    }

    createForm() {
        this.changephoneForm = this.formBuilder.group({
            idnumber: ['', Validators.required],
            usernameold: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
            username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
            smsCode: ['', Validators.required],
        });
    }

    get idnumber() {
        return this.changephoneForm.get('idnumber');
    }

    get username() {
        return this.changephoneForm.get('username');
    }

    get usernameold() {
        return this.changephoneForm.get('usernameold');
    }

    get smsCode() {
        return this.changephoneForm.get('smsCode');
    }


    tryGetCode(event: any) {
        if (this.usernameold.value === this.username.value) {
            return this.baseService.presentConfirmToast('两次输入的手机号码不能相同');
        }

        this.baseService.doseUserExists(this.username.value).subscribe(data => {
            if (data['code'] === -2) {
                this.getCode(event);
            } else {
                this.baseService.presentConfirmToast('新用户名已存在');
                this.username.reset();
            }
        });
    }


    getCode(event: any) {
        this.baseService.getSmsCode(this.username.value)
            .subscribe(data => {
                console.log('成功获取短信验证码');
            });
        let number = 60;
        this.disabled = true;
        const that = this;
        that.tips = number + 's倒计时';
        const timer = setInterval(function () {
            number --;
            if (number === 0) {
                that.disabled = false;
                that.tips = '获取验证码';
                clearInterval(timer);
            } else {
                that.tips = number + 's倒计时';
            }
        }, 1000);
    }

    changeUsername() {
        this.baseService.changeUsername(this.usernameold.value.trim(), this.username.value.trim(), this.smsCode.value.trim(), this.idnumber.value.trim()).subscribe(data => {
            if (data['code'] === 0) {
                this.baseService.logout();
                this.router.navigate(['/auth/login']).then(() => {
                    this.baseService.presentToast('修改账号成功，请重新登录');
                });
            } else {
                this.baseService.presentToast(data['msg']);
            }
        });
        this.changephoneForm.reset();
        this.smsCode.reset();
    }


}
