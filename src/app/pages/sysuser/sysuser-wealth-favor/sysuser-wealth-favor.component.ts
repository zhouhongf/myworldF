import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {Storage} from '@ionic/storage';
import {NavigationEnd, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';

@Component({
  selector: 'app-sysuser-wealth-favor',
  templateUrl: './sysuser-wealth-favor.component.html',
  styleUrls: ['./sysuser-wealth-favor.component.scss'],
})
export class SysuserWealthFavorComponent implements OnInit, OnDestroy {
  navigationSubscription;
  dataWealth = [];
  totalNum = 0;
  pageIndex = APIService.pageIndex;
  pageSize = APIService.pageSize;

  constructor(private baseService: BaseService, private storage: Storage, private router: Router) {
  }

  ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/sysuser/wealthFavor') {
          this.getData();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getData() {
    this.dataWealth = [];
    this.totalNum = 0;
    this.storage.get(APIService.SAVE_STORAGE.favorWealths).then(data => {
      if (data) {
        this.dataWealth = data;
        this.prepareData();
      }
    })
  }

  getDataRemote() {
    this.baseService.httpGet(APIService.WEALTH.getFavorWealths, null, data => {
      if (data.code === 0) {
        this.dataWealth = data;
        this.prepareData();
        this.storage.set(APIService.SAVE_STORAGE.favorWealths, data);
      }
    }, true)
  }

  prepareData() {
    for (const one of this.dataWealth) {
      const amountBuyMin = Math.round(one.amountBuyMin / 10000);
      let rate;
      if (one.rateMin && one.rateMax){
        if (one.rateMin === one.rateMax) {
          rate = one.rateMin;
        } else {
          rate = one.rateMin + '~' + one.rateMax;
        }
      } else if (one.rateMin) {
        rate = one.rateMin;
      } else if (one.rateMax) {
        rate = one.rateMax;
      } else {
        rate = '详见产品说明书'
      }
      one.rate = rate;
      one.amountBuyMin = amountBuyMin;
    }
  }

  goToDetailWealth(one) {
    return this.router.navigate(['/wealth/detail', {id: one.id, backUrl: '/sysuser/wealthFavor'}])
  }
}
