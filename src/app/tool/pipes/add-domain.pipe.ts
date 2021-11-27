import { Pipe, PipeTransform } from '@angular/core';
import {APIService} from '../../providers/api.service';

@Pipe({
  name: 'addDomain'
})
export class AddDomainPipe implements PipeTransform {

  transform(value: any): any {
    return APIService.domain + value;
  }

}
