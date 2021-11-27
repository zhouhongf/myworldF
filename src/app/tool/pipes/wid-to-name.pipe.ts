import { Pipe, PipeTransform } from '@angular/core';
import {APIService} from '../../providers/api.service';
import {BaseService} from '../../providers/base.service';
import {Storage} from '@ionic/storage';

@Pipe({
  name: 'widToName'
})
export class WidToNamePipe implements PipeTransform {
  nickname: string;
  userWid: string;

  constructor(private storage: Storage, private baseService: BaseService) {
  }

  transform(value): any {
    this.nickname = localStorage.getItem(APIService.SAVE_LOCAL.nickname);
    this.userWid = this.baseService.getWidLocal();
    if (value === this.userWid) {
      return this.nickname;
    }

    this.storage.get(APIService.SAVE_STORAGE.allSearchContacts).then(data => {
      const searchContacts = data;
      let name = value;
      for (const searchContact of searchContacts) {
        if (value === searchContact.wid) {
          name = searchContact.displayName;
          break;
        }
      }
      return name;
    });
  }

}
