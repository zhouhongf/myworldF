import {Component, OnDestroy, OnInit} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {Storage} from '@ionic/storage';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-sysuser-text-favor',
  templateUrl: './sysuser-text-favor.component.html',
  styleUrls: ['./sysuser-text-favor.component.scss'],
})
export class SysuserTextFavorComponent implements OnInit, OnDestroy {
  navigationSubscription;
  dataShow = [];
  totalNum = 0;
  pageIndex = APIService.pageIndex;
  pageSize = APIService.pageSize;

  constructor(private baseService: BaseService, private storage: Storage, private router: Router) {
  }

  ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/sysuser/textFavor') {
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
    this.dataShow = [];
    this.totalNum = 0;
    this.storage.get(APIService.SAVE_STORAGE.favorTexts).then(data => {
      if (data) {
        this.dataShow = data;
      }
    })
  }

  goToDetail(one) {
    return this.router.navigate(['/text/detail', {id: one.id, backUrl: '/sysuser/textFavor'}])
  }
}
