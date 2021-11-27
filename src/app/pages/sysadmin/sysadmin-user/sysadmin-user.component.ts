import {Component, OnInit} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {AlertController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {playerTypeData} from '../../../models/system-data';

@Component({
    selector: 'app-sysadmin-user',
    templateUrl: './sysadmin-user.component.html',
    styleUrls: ['./sysadmin-user.component.scss'],
})
export class SysadminUserComponent implements OnInit {
    showDetail = false;
    toDelete = false;
    player: string;

    elementData;
    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize;
    pageTotal = 1;
    pageCount = 1;

    adminForm: FormGroup;
    isShowPassword = false;
    showEdit = false;
    playerTypes = playerTypeData;

    constructor(private baseService: BaseService, private alertController: AlertController, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.createForm();
    }

    getList(player) {
        this.player = player;
        this.getData();
        this.showDetail = true;
    }

    closeList() {
        this.showDetail = false;
        this.pageTotal = 1;
        this.pageCount = 1;
        this.elementData = undefined;
    }

    getData() {
        const params = {playerType: this.player, pageSize: this.pageSize, pageIndex: this.pageIndex};
        this.baseService.httpGet(APIService.SYSADMIN.getUserList, params, data => {
            if (data.code === 0) {
                this.pageTotal = data.num;
                this.pageCount = Math.ceil(this.pageTotal / this.pageSize);
                this.elementData = data.data;
            }
        });
    }

    doPage() {
        if (this.pageCount > 1) {
            if (this.pageIndex === 0) {
                this.pageIndex += 1;
                this.getData();
            }
        }
    }

    doPageNext() {
        if (this.pageCount > 1) {
            if (this.pageIndex < this.pageCount) {
                this.pageIndex += 1;
                this.getData();
            }
        }
    }

    doPagePrevious() {
        if (this.pageIndex > 0) {
            this.pageIndex -= 1;
            this.getData();
        }
    }

    createForm() {
        this.adminForm = this.formBuilder.group({
            wid: '',
            username: ['', [Validators.required, Validators.pattern(APIService.usernamePattern)]],
            password: ['', [Validators.required, Validators.pattern(APIService.passwordPattern)]],
            passwordConfirm: ['', Validators.required],
            roles: ['', Validators.required],
        });
    }

    get wid() {
        return this.adminForm.get('wid');
    }

    get username() {
        return this.adminForm.get('username');
    }

    get password() {
        return this.adminForm.get('password');
    }

    get passwordConfirm() {
        return this.adminForm.get('passwordConfirm');
    }

    get roles() {
        return this.adminForm.get('roles');
    }

    resetForm(data) {
        this.wid.patchValue(data.wid);
        this.username.patchValue(data.username);
        const listRoles = data.sysroles.split(',')
        this.roles.patchValue(listRoles);
        this.showEdit = true;
    }

    createUser() {
        this.toDelete = false;
        this.adminForm.reset();
        this.showEdit = true;
    }

    choose(data) {
        if (this.toDelete) {
            this.del(data);
        } else {
            this.resetForm(data);
        }
    }

    doCreateUser() {
        if (this.password.value.trim() !== this.passwordConfirm.value.trim()) {
            return this.baseService.alert('两次输入的密码不一致');
        }
        this.baseService.setUser(this.username.value.trim(), this.password.value.trim(), this.roles.value, this.wid.value).subscribe(data => {
            if (data['code'] === 0) {
                this.getData();
                this.showEdit = false;
                this.adminForm.reset();
            } else {
                this.baseService.presentToast(data['msg']);
            }
        });
    }


    async del(data) {
        const alertMessage = '<br>' +
            '<div>账号：<strong>' + data.username + '</strong></div>\n' +
            '<br>';

        const alert = await this.alertController.create({
            header: '删除以下用户：',
            message: alertMessage,
            buttons: [
                {
                    text: '确定',
                    cssClass: 'btn btn-danger',
                    handler: () => {
                        this.doDelete(data.wid);
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                }
            ]
        });
        await alert.present();
    }

    doDelete(wid) {
        this.baseService.httpPost(APIService.SYSADMIN.delUser, null, wid, data => {
            if (data.code === 0) {
                for (let i = 0; i < this.elementData.length; i++) {
                    const value = this.elementData[i];
                    if (value.wid === wid) {
                        this.elementData.splice(i, 1);
                    }
                }
                this.toDelete = false;
            }
            this.baseService.presentToast(data.msg);
        });
    }


}

