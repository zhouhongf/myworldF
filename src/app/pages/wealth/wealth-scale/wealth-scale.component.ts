import { Component, OnInit } from '@angular/core';
import {bankNameLink} from '../../../models/bank-name';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';

@Component({
  selector: 'app-wealth-scale',
  templateUrl: './wealth-scale.component.html',
  styleUrls: ['./wealth-scale.component.scss'],
})
export class WealthScaleComponent implements OnInit {
  target: string;

  bankNames = bankNameLink;
  bankNamesState = [];
  bankNamesComp = [];
  bankNamesCity = [];
  bankNamesCounty = [];

  constructor(private baseService: BaseService, private route: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    this.getRouteParams();
    this.initBankLogos();
  }

  getRouteParams() {
    this.route.paramMap.subscribe(data => {
      this.target = data.get('target');
    });
  }

  initBankLogos() {
    for (const one of this.bankNames) {
      switch (one['type']) {
        case 'state':
          const dataState = {name: one['name'], fullname: one['fullname'], logo: APIService.assetsBankLogoSmall + one['name'] + '.png'};
          this.bankNamesState.push(dataState);
          break;
        case 'comp':
          const dataComp = {name: one['name'], fullname: one['fullname'], logo: APIService.assetsBankLogoSmall + one['name'] + '.png'};
          this.bankNamesComp.push(dataComp);
          break;
        case 'city':
          const dataCity = {name: one['name'], fullname: one['fullname'], logo: APIService.assetsBankLogoSmall + one['name'] + '.png'};
          this.bankNamesCity.push(dataCity);
          break;
        case 'county':
          const dataCounty = {name: one['name'], fullname: one['fullname'], logo: APIService.assetsBankLogoSmall + one['name'] + '.png'};
          this.bankNamesCounty.push(dataCounty);
          break;
      }
    }
  }

  goToPage(param?) {
    let bankName = '';
    let bankLevel = '';
    if (param) {
      if (param === '国有银行' || param === '股份银行' || param === '城商银行' || param === '农商银行') {
        bankLevel = param;
      } else {
        bankName = param;
      }
    }
    return this.router.navigate(['/wealth/standard', {target: this.target, bankLevel: bankLevel, bankName: bankName}]);
  }
}
