import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseService} from '../../providers/base.service';
import {APIService} from '../../providers/api.service';
import {Router} from '@angular/router';
import {ChatService} from '../../providers/chat.service';
import {Storage} from '@ionic/storage';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

    worker;
    constructor(private baseService: BaseService, private chatService: ChatService, private storage: Storage, private router: Router) {
    }

    ngOnInit() {
        this.getAllContacts();
        this.chatService.checkPhoneApplies();
        const widNicknameAvatar = this.baseService.checkWidNicknameAvatar();
        if (widNicknameAvatar === false) {
            return this.router.navigate(['/sysuser/home']).then(() => {
                this.baseService.presentToast('请先设置昵称和头像');
            });
        }
        this.chatService.makeHttpSession();
    }

    ngOnDestroy() {
        if (this.worker) {
            this.worker.terminate();
        }
    }

    getAllContacts() {
        this.baseService.httpGet(APIService.CHAT.getAllContacts, null, data => {
            if (data.code === 0) {
                this.makeFormatContacts(data.data);
            } else {
                console.log(data.msg);
            }
        });
    }

    makeFormatContacts(data) {
        if (typeof Worker !== 'undefined') {
            this.worker = new Worker('./chat.worker', {type: 'module'});
            this.worker.onmessage = (dataOut) => {
                this.storage.set(APIService.SAVE_STORAGE.allContacts, dataOut.data);
            };
            const dataIn = {avatarPrefix: APIService.avatarPrefix, contacts: data};
            this.worker.postMessage(dataIn);
        } else {
            console.log('不支持Web Workers，请自定义需要后台运行的方法逻辑');
        }
    }
}
