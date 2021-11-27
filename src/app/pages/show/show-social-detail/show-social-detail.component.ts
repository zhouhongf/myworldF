import {Component, OnDestroy, OnInit} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';
import {NavigationEnd, Router} from '@angular/router';
import {BaseService} from '../../../providers/base.service';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-show-social-detail',
  templateUrl: './show-social-detail.component.html',
  styleUrls: ['./show-social-detail.component.scss'],
})
export class ShowSocialDetailComponent implements OnInit, OnDestroy {
  isLogin = false;
  navigationSubscription;
  theUserWid: string;
  nickname: string;
  company: string;
  position: string;

  showPhotoPrefix = APIService.domain + '/swealth/tweet/tweetPhoto/';
  avatarPrefix = APIService.avatarPrefix;
  anonymousPic = 'assets/images/anonymous.jpg';

  theData;
  tweetWid;
  tweetUserWid;
  dataList = [];
  totalDataLength: number;
  pageIndex = APIService.pageIndex;
  pageSize = APIService.pageSize;

  isWatch = false;

  constructor(
      private storage: Storage,
      private router: Router,
      private baseService: BaseService,
      private alertController: AlertController,
      private toastController: ToastController) {
  }

  ngOnInit() {
    this.isLogin = this.baseService.isLogin();
    if (this.isLogin) {
      this.theUserWid = this.baseService.getWidLocal();
      this.baseService.getUserOutline().subscribe(data => {
        if (data) {
          this.nickname = data.nickname;
          this.company = data.company;
          this.position = data.position;
          console.log('昵称是：', this.nickname);
        }
      })
    }

    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/show/socialDetail') {
          this.isLogin = this.baseService.isLogin();
          this.getLocalData();
        }
      }
    });
  }

  ngOnDestroy() {
    console.log('========== 执行onDestory方法 ==========');
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  getLocalData() {
    this.dataList = [];
    this.storage.get(APIService.SAVE_STORAGE.userShowSocialCurrent).then(data => {
      this.theData = data;
      console.log('取出来的内容是：', this.theData);
      this.tweetWid = this.theData.id;
      this.tweetUserWid = this.theData.userWid;
      if (this.tweetWid && this.tweetUserWid) {
        this.getRemoteData();
      }
    });
  }

  getRemoteData() {
    let pageIndex = 0;
    if (this.pageIndex > 0) {
      pageIndex = this.pageIndex - 1;
    }
    const params = {tweetWid: this.tweetWid, tweetUserWid: this.tweetUserWid, pageSize: this.pageSize, pageIndex};
    this.baseService.httpGet(APIService.WEALTH.getSocialComments, params, data => {
      if (data.code === 0) {
        const msg = data.msg;
        this.isWatch = msg === 'true';
        this.totalDataLength = data.num;
        const showData = data.data;
        if (showData && showData.length > 0) {
          if (this.pageIndex === 0) {
            this.dataList = showData;
          } else {
            this.dataList = this.dataList.concat(showData);
          }
          console.log('解析后的内容是：', this.dataList);
        }
      }
    });
  }

  doInfinite(event) {
    const num = this.dataList.length;
    if (num > 0 && (num % this.pageSize === 0)) {                                       // 当前项目总数除以pageSize是求余，如果余数不为0，那么就是最后一页了
      this.pageIndex = Math.floor(this.dataList.length / this.pageSize) + 1;          // 当前项目总数 除以 每页数量 得出当前页码数
      this.getRemoteData();
    }
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


  async makeComment(idAt: string, commentAtWid: string, commentAtDisplayName: string) {
    if (!this.isLogin) {
      return this.baseService.alert('您必须先登录！')
    }
    if (!this.theUserWid) {
      return this.baseService.alert('您必须登录后才能评论！')
    }
    if (!this.nickname) {
      return this.baseService.alert('必须有昵称后才能评论！')
    }

    if (idAt !== this.tweetWid && commentAtWid === this.theUserWid) {
      return this.baseService.presentToast('不能对自己的评论再评论');
    }
    let placeholderText = '';
    if (idAt !== this.tweetWid && commentAtWid !== this.theUserWid) {
      placeholderText = '回复' + commentAtDisplayName;
    }

    const alert = await this.alertController.create({
      header: '评论',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: placeholderText
        },
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('选择取消');
          }
        }, {
          text: '确定',
          handler: (value) => {
            console.log('选择确定');
            let content = ''
            if (placeholderText) {
              content = '回复<span style="font-weight: bold">' + commentAtDisplayName + ': </span>'
            }
            content = '<div>' + content + value.comment + '</div>'
            this.doComment(idAt, commentAtWid, content);
          }
        }
      ]
    });
    await alert.present();
  }

  doComment(idAt: string, commentatWid: string, comment: string) {
    // tweetWid是该博客的id, id是该评论的id, commenterWid是评论者的id，commentatWid是被评论者的id
    const params = {
      tweetWid: this.tweetWid,
      commenterWid: this.theUserWid,
      idAt,
      commentatWid
    };
    this.baseService.httpPost(APIService.WEALTH.commentOnSocial, params, comment, data => {
      if (data.code === 0) {
        params['id'] = data.data;
        params['nickname'] = this.nickname;
        params['position'] = this.position;
        params['company'] = this.company;
        params['comment'] = comment;
        params['createTime'] = new Date().getTime();
        this.dataList.unshift(params);
        this.theData['commentCount'] += 1;
      } else {
        this.baseService.presentToast(data.msg);
      }
    });
  }

  async delTweet() {
    const toast = await this.toastController.create({
      position: 'bottom',
      color: 'danger',
      duration: 5000,
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
            this.doDelTweet();
          }
        }
      ]
    });
    toast.present();
  }

  doDelTweet() {
    this.baseService.httpDelete(APIService.WEALTH.delShowSocial, {id: this.tweetWid, userWid: this.theUserWid}, data => {
      if (data.code === 0) {
        return this.router.navigate(['/show/social'])
      } else {
        this.baseService.presentToast(data.msg);
      }
    })
  }

  setUserWatch(data) {
    const userWidWatch = data.userWid;
    if (this.isWatch === true) {
      this.delUserWatch(userWidWatch);
    } else {
      this.addUserWatch(data);
    }
  }

  addUserWatch(data) {
    const userWidWatch = data.userWid;
    this.baseService.httpGet(APIService.SYSUSER.addUserWatch, {userWidWatch}, value => {
      if (value.code === 0) {
        this.isWatch = true;
        const userWatch = {id: userWidWatch, nickname: data.nickname, position: data.position, company: data.company, gender: '', industry: '', intro: ''}
        this.baseService.addUserWatchLocal(userWatch);
      }
    })
  }

  delUserWatch(userWidWatch) {
    this.baseService.httpDelete(APIService.SYSUSER.delUserWatch, {userWidWatch}, data => {
      if (data.code === 0) {
        this.isWatch = false;
        this.baseService.delUserWatchLocal(userWidWatch);
      }
    })
  }

}
