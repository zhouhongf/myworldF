import {Component, OnInit, ViewChild} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {bankNameLink} from '../../../models/bank-name';

@Component({
  selector: 'app-bank-text',
  templateUrl: './bank-text.component.html',
  styleUrls: ['./bank-text.component.scss'],
})
export class BankTextComponent implements OnInit {
  keyone: string;
  keytwo: string;
  @ViewChild('headerTextFinance', {static: false}) header;
  imageUrl = 'url(assets/images/dengShanRen.jpg)';

  pageIndex = APIService.pageIndex;
  pageSize = APIService.pageSize * 2;
  pageTotal = 1;
  pageCount = 1;
  dataShow = [];

  bankNameList = [];
  bankName;

  constructor(private baseService: BaseService, private route: ActivatedRoute, private router: Router, private storage: Storage) {
  }

  ngOnInit() {
    this.getRouteParams();
    for (const one of bankNameLink) {
      this.bankNameList.push(one.name);
    }
  }

  getRouteParams() {
    this.route.paramMap.subscribe(data => {
      this.keyone = data.get('keyone');
      this.keytwo = data.get('keytwo');
      this.bankName = data.get('bankName');
      if (this.bankName) {
        this.imageUrl = 'url(' + APIService.wordcloudPrefix + this.bankName + ')';
      } else {
        this.getSlides();
      }
      this.getData();
    });
  }

  scrollEvent(e) {
    const opacity = (e.detail.scrollTop - 300) / 300;
    this.header._elementRef.nativeElement.style.background = `rgba(255,255,255,${opacity})`;
  }

  getSlides() {
    let slides = [];
    this.storage.get(APIService.SAVE_STORAGE.allSlides).then(data =>  {
      if (data) {
        slides = data.data;
        const total = slides.length;
        const randomNum = Math.floor(Math.random() * total);
        this.imageUrl = slides[randomNum].image;
      }
    })
  }

  getData() {
    const params = {keyone: this.keyone, keytwo: this.keytwo, pageIndex: this.pageIndex, pageSize: this.pageSize};
    if (this.bankName) {
      params['bankName'] = this.bankName;
    }
    this.baseService.httpGet(APIService.WEALTH.textFinance, params, data => {
      if (data.code === 0) {
        if (this.pageIndex === 0) {
          this.pageTotal = data.num;
          this.dataShow = data.data;
        } else {
          this.dataShow = this.dataShow.concat(data.data);
        }
      } else {
        console.log(data.msg);
      }
    });
  }

  doRefresh(event) {
    this.pageIndex = APIService.pageIndex;
    this.pageSize = APIService.pageSize * 2;
    this.pageTotal = 1;
    this.pageCount = 1;
    this.dataShow = [];
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  doInfinite(event) {
    const num = this.dataShow.length;
    if (num > 0 && (num % this.pageSize === 0)) {         // ????????????????????????pageSize??????????????????????????????0??????????????????????????????
      this.pageIndex += 1;
      this.getData();
    }
    setTimeout(() => {
      event.target.complete();
      if (num === this.pageTotal) {
        event.target.disabled = true;
      }
    }, 2000);
  }

  goToDetail(one) {
    let backUrl = '/bank/text;keyone=' + this.keyone;
    if (this.keytwo) {
      backUrl = backUrl + ';keytwo=' + this.keytwo;
    }
    if (this.bankName) {
      backUrl = backUrl + ';bankName=' + this.bankName;
    }
    return this.router.navigate(['/text/detail', {id: one.id, backUrl}]);
  }

  goBack() {
    return this.router.navigate(['/bank/work', {target: this.keyone}]);
  }

}
