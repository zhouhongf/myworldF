import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assetPath'
})
export class AssetPathPipe implements PipeTransform {

  bankLogo = 'assets/images/bankLogoSmall/';

  transform(value: any): any {
    return this.bankLogo + value + '.png';
  }

}
