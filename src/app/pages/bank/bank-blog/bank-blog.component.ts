import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-bank-blog',
  templateUrl: './bank-blog.component.html',
  styleUrls: ['./bank-blog.component.scss'],
})
export class BankBlogComponent implements OnInit{

  bankName: string;
  imageURL: string;

  dataWealth = [];
  dataTextsFinance = [];
  dataTextsNews = [];
  dataTextsHR = [];
  dataTextsBuy = [];
  dataTextsImportant = [];

  constructor(private baseService: BaseService, private storage: Storage, private route: ActivatedRoute, private router: Router) {
  }


  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      this.bankName = data.get('target');
      if (this.bankName) {
        this.imageURL = APIService.wordcloudPrefix + this.bankName;
        this.getData();
      }
    });
  }

  getData() {
    this.baseService.httpGet(APIService.WEALTH.textAndWealth, {bankName: this.bankName}, data => {
      if (data.code === 0) {
        this.dataTextsFinance = data.data.textsFinance;
        this.dataTextsNews = data.data.textsNews;
        this.dataTextsHR = data.data.textsHR;
        this.dataTextsBuy = data.data.textsBuy;
        this.dataTextsImportant = data.data.textsImportant;

        const wealths = data.data.wealths;
        this.dataWealth = this.makeupWealthList(wealths);
      }
    }, true);
  }

  makeupWealthList(wealths) {
    const dataList = [];
    for (const one of wealths) {
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
      const oneWealth = {id: one.id, name: one.name, risk: one.risk, term: one.term, amountBuyMin, rate};
      dataList.push(oneWealth);
    }
    return dataList;
  }

  goToText(id: string) {
    return this.router.navigate(['/text/detail', {id, backUrl: '/bank/blog', target: this.bankName}])
  }

  goToWealth(id: string) {
    return this.router.navigate(['/wealth/detail', {id, backUrl: '/bank/blog', target: this.bankName}])
  }
}
