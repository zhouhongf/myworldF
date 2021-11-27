import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'space'
})
export class SpacePipe implements PipeTransform {

  reg = new RegExp('\\+', 'g');

  transform(value: any, args?: any): any {
    return value.replace(this.reg, '  ');
  }

}
