import {Component, OnDestroy, OnInit} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {Storage} from '@ionic/storage';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-sysuser-hr-favor',
  templateUrl: './sysuser-hr-favor.component.html',
  styleUrls: ['./sysuser-hr-favor.component.scss'],
})
export class SysuserHrFavorComponent implements OnInit, OnDestroy {
  navigationSubscription;
  dataShow = [];

  constructor(private baseService: BaseService, private storage: Storage, private router: Router) {
  }

  ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/sysuser/hrFavor') {
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
    this.storage.get(APIService.SAVE_STORAGE.favorJobs).then(data => {
      if (data) {
        this.dataShow = data;
      }
    })
  }

  goToDetail(one) {
    return this.router.navigate(['/bank/hrDetail', {id: one.id, backUrl: '/sysuser/hrFavor'}])
  }
}
