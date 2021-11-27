import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
    isMobile: boolean;
    loginForm: FormGroup;
    imageURL;

    usernamePattern = APIService.usernamePattern;
    passwordPattern = APIService.passwordPattern;

    constructor(private baseService: BaseService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
        this.createForm();
        this.isMobile = this.baseService.isMobile();
        this.baseService.logout();
    }

    ngOnInit() {
        this.route.paramMap.subscribe(data => {
            if (data) {
                const theUsername = data.get('username');
                this.username.setValue(theUsername);
            }
            this.getCode();
        });
    }

    createForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
            password: new FormControl('', {validators: [Validators.required, Validators.pattern(this.passwordPattern)], updateOn: 'blur'}),
            imagecode: ['', Validators.required]
        });
    }

    get username() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }

    get imagecode() {
        return this.loginForm.get('imagecode');
    }

    getCode() {
        this.baseService.getImageCode().subscribe(data => {
            if (data['code'] === 0) {
                this.imageURL = data['data'];
            }
        });
    }

    login() {
        this.baseService.login(this.username.value.trim(), this.password.value.trim(), this.imagecode.value.trim()).subscribe(
            data => {
                if (data['code'] === 0) {
                    const userData = data['data'];
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
                    this.baseService.presentToast('登录不成功, ' + data['msg']);
                }
            },
            error => {
                this.baseService.presentConfirmToast(JSON.stringify(error));
            });
        this.loginForm.reset();
    }

}
