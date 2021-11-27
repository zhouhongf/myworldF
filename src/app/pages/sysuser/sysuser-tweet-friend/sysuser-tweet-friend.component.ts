import { Component, OnInit } from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {APIService} from '../../../providers/api.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-sysuser-tweet-friend',
  templateUrl: './sysuser-tweet-friend.component.html',
  styleUrls: ['./sysuser-tweet-friend.component.scss'],
})
export class SysuserTweetFriendComponent implements OnInit {
  theData;
  userData;
  avatarPrefix = APIService.avatarPrefix;

  constructor(private baseService: BaseService, private toastController: ToastController) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.baseService.getWatchUsers().subscribe(data => {
      if (data) {
        this.userData = data.slice(0, 1);
        this.theData = data.slice(1);
        console.log('用户本人为：', this.userData);
      }
    })
  }

  async delUserWatch(data) {
    const toast = await this.toastController.create({
      message: '删除：' + data.nickname,
      position: 'bottom',
      color: 'danger',
      duration: 5000,
      cssClass: 'text-center',
      buttons: [
        {
          side: 'start',
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('选择了取消按钮');
          }
        }, {
          text: '确定',
          handler: () => {
            console.log('选择了确定按钮');
            this.doDelUserWatch(data.id)
          }
        }
      ]
    });
    toast.present();
  }

  doDelUserWatch(userWidWatch) {
    this.baseService.httpDelete(APIService.SYSUSER.delUserWatch, {userWidWatch}, data => {
      if (data.code === 0) {
        this.delUserWatchLocal(userWidWatch);
      } else {
        this.baseService.presentToast(data.msg);
      }
    })
  }

  delUserWatchLocal(userWidWatch) {
    for (let i=0; i < this.theData.length; i++) {
      const one = this.theData[i]
      if (one.id === userWidWatch) {
        this.theData.splice(i, 1)
        break;
      }
    }
  }

  syncWatchUsers() {
    this.baseService.syncWatchUsers().subscribe(data => {
      if (data) {
        this.userData = data.slice(0, 1);
        this.theData = data.slice(1);
      }
    })
  }


}
