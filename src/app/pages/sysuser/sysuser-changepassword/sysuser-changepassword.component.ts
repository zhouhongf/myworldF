import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseService} from '../../../providers/base.service';
import {Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';

@Component({
    selector: 'app-sysuser-changepassword',
    templateUrl: './sysuser-changepassword.component.html',
    styleUrls: ['./sysuser-changepassword.component.scss']
})
export class SysuserChangepasswordComponent implements OnInit {

    changepasswordForm: FormGroup;
    passwordPattern = APIService.passwordPattern;

    isShowPassword = false;

    constructor(private baseService: BaseService, private router: Router) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    goBack() {
        this.router.navigate(['/sysuser/home']);
    }

    createForm() {
        this.changepasswordForm = new FormGroup({
            passwordold: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
            password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
            passwordConfirm: new FormControl('', {validators: Validators.required, updateOn: 'blur'}),
        }, passwordMatchValidator);

        function passwordMatchValidator(g: FormGroup) {
            return g.get('password').value === g.get('passwordConfirm').value ? null : {'mismatch' : true};
        }
    }

    get passwordold() {
        return this.changepasswordForm.get('passwordold');
    }

    get password() {
        return this.changepasswordForm.get('password');
    }

    get passwordConfirm() {
        return this.changepasswordForm.get('passwordConfirm');
    }


    showPassword($event) {
        $event.preventDefault();
        this.isShowPassword = !this.isShowPassword;
    }

    changePassword() {
        if (this.password.value === this.passwordold.value) {
            return this.baseService.presentToast('新密码不能与原来的密码相同');
        }
        this.baseService.changePassword(this.passwordold.value.trim(), this.password.value.trim()).subscribe(data => {
            if (data['code'] === 0) {
                this.router.navigate(['/sysuser/home']).then(() => {
                    this.baseService.presentToast('成功修改密码');
                });
            } else {
                this.baseService.presentToast('修改密码失败');
            }
        });
        this.changepasswordForm.reset();
        this.passwordConfirm.reset();
    }

}

