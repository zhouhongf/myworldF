import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitLast'
})
export class SplitLastPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(value: string, divider: string, lengthLimit: number): any {
    if (value.length < lengthLimit) {
      return value;
    }
    if (value.indexOf(divider) === -1) {
      return value.substring(0, lengthLimit) + '...';
    }
    const valueList = value.split(divider);
    const lastIndex = valueList.length - 1 ;
    return valueList[lastIndex];
  }

}
