import {Component, OnInit} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {writingTypeData} from '../../../models/system-data';


@Component({
  selector: 'app-sysadmin-writing',
  templateUrl: './sysadmin-writing.component.html',
  styleUrls: ['./sysadmin-writing.component.scss']
})
export class SysadminWritingComponent implements OnInit {
  writingTypeData = writingTypeData;
  showDetail = false;
  toDelete = false;

  elementData;
  writingType: string;

  constructor(private baseService: BaseService, private alertController: AlertController, private router: Router) {
  }

  ngOnInit() {
  }

  getList(value) {
    this.writingType = value;
    this.getData();
  }

  getData() {
    const params = {type: this.writingType};
    this.baseService.httpGet(APIService.SYSADMIN.getWritingList, params, data => {
      if (data.code === 0) {
        this.elementData = data.data;
        this.showDetail = true;
      }
    }, true);
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {event.target.complete(); }, 2000);
  }

  choose(data) {
    if (this.toDelete) {
      this.del(data);
    } else {
      this.look(data);
    }
  }

  create() {
    return this.router.navigate(['/sysadmin/writingDetail']).then(() => {
      this.toDelete = false;
      this.showDetail = false;
    });
  }

  look(data) {
    return this.router.navigate(['/sysadmin/writingDetail', {id: data.id}]).then(() => {
      this.showDetail = false;
    });
  }

  async del(data) {
    const alertMessage = '<br>' +
        '<div>标题：<strong>' + data.title + '</strong></div>\n' +
        '<div>作者：<strong>' + data.author + '</strong></div>' +
        '<br>';

    const alert = await this.alertController.create({
      header: '删除以下文章：',
      message: alertMessage,
      buttons: [
        {
          text: '确定',
          cssClass: 'btn btn-danger',
          handler: () => {
            this.doDelete(data.idDetail);
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

  doDelete(idDetail) {
    this.baseService.httpDelete(APIService.SYSADMIN.delWriting, {idDetail}, data => {
      if (data.code === 0) {
        for (let i = 0; i < this.elementData.length; i++) {
          const value = this.elementData[i];
          if (value.idDetail === idDetail) {
            this.elementData.splice(i, 1);
          }
        }
      }
      this.baseService.presentToast(data.msg);
    });
  }

}

