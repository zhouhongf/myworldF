import { Component, OnInit } from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {bankNameLink} from '../../../models/bank-name';

@Component({
  selector: 'app-bank-hr-detail',
  templateUrl: './bank-hr-detail.component.html',
  styleUrls: ['./bank-hr-detail.component.scss'],
})
export class BankHrDetailComponent implements OnInit {
  backUrl;
  backTarget;

  dataShow;
  linkPattern = new RegExp(APIService.linkPattern, 'i');

  isFavor = false;
  isLogin = false;

  constructor(
      private baseService: BaseService,
      private route: ActivatedRoute,
      private storage: Storage,
      private router: Router) {
  }

  ngOnInit() {
    this.getRouteParams();
  }

  getRouteParams() {
    this.route.paramMap.subscribe(data => {
      const targetId = data.get('id');
      this.backUrl = data.get('backUrl');
      this.backTarget = data.get('target');
      this.isLogin = this.baseService.isLogin();
      if (targetId) {
        this.getData(targetId);
      }
    });
  }

  getData(targetId: string) {
    this.dataShow = undefined;
    this.storage.get(APIService.SAVE_STORAGE.favorJobs).then(data => {
      if (data) {
        for (const one of data) {
          if (targetId === one.id) {
            this.isFavor = true;
            this.dataShow = one;
            break;
          }
        }
        if (this.dataShow) {
          return;
        }
      }
      return this.getDataRemote(targetId);
    })
  }

  getDataRemote(targetId: string) {
    this.baseService.httpGet(APIService.WEALTH.jobDetail + targetId, null, data => {
      if (data.code === 0) {
        this.dataShow = data.data;
      }
    });
  }

  goToExternal(value: string) {
    const resultOne = this.linkPattern.test(value);
    if (resultOne) {
      window.open(value, '_self', 'location=no')
    }
  }

  goBack() {
    if (this.backTarget) {
      return this.router.navigate([this.backUrl, {target: this.backTarget}]);
    } else {
      return this.router.navigateByUrl(this.backUrl);
    }
  }


  setFavor() {
    if (this.isFavor) {
      this.delFavor();
    } else {
      this.addFavor();
    }
  }

  addFavor() {
    const theId = this.dataShow.id;
    this.storage.get(APIService.SAVE_STORAGE.favorJobs).then(data => {
      if (data) {
        for (const one of data) {
          if (one.id === theId) {
            this.isFavor = true;
            break;
          }
        }
        if (this.isFavor) {
          return;
        }
        this.isFavor = true;
        data.push(this.dataShow);
        return this.storage.set(APIService.SAVE_STORAGE.favorJobs, data);
      }
      this.isFavor = true;
      const dataNew = [];
      dataNew.push(this.dataShow);
      return this.storage.set(APIService.SAVE_STORAGE.favorJobs, dataNew);
    })
  }

  delFavor() {
    const theId = this.dataShow.id;
    this.storage.get(APIService.SAVE_STORAGE.favorJobs).then(data => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const one = data[i];
          if (one.id === theId) {
            data.splice(i, 1);
            break;
          }
        }
        this.isFavor = false;
        return this.storage.set(APIService.SAVE_STORAGE.favorJobs, data);
      }
    })
  }
}