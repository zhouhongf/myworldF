import { Pipe, PipeTransform } from '@angular/core';
import {bankNameLink} from '../../models/bank-name';
import {APIService} from '../../providers/api.service';


@Pipe({
  name: 'bankLogo'
})
export class BankLogoPipe implements PipeTransform {
  bankNameList = [];

  constructor() {
    for (const one of bankNameLink) {
      this.bankNameList.push(one.name);
    }
  }

  transform(value: string): string {
    let logo;
    if (this.bankNameList.indexOf(value) !== -1) {
      logo = APIService.assetsBankLogoSmall + value + '.png';
    } else {
      logo = APIService.assetsImages + 'ionic-earth.svg';
    }
    return logo;
  }

}
