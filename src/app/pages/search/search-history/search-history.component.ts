import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchHistoryInterface} from '../../../models/system-interface';
import {FormControl, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.scss'],
})
export class SearchHistoryComponent implements OnInit, OnDestroy {
  navigationSubscription;
  searchHistoryData: SearchHistoryInterface[] = [];
  selectItems = [];
  showDeleteBtn = false;

  searchContent = new FormControl('', Validators.required);

  constructor(private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/search/history') {
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

  getData() {
    this.storage.get(APIService.SAVE_STORAGE.searchHistory).then(data => {
      if (data) {
        this.searchHistoryData = data;
      }
    });
  }

  goToDetail(content) {
    if (content.url) {
      console.log('导航url是: ', content.url);
      return window.open(content.url, '_target');
    } else {
      if (content.type === 'WEALTH') {
        return this.router.navigate(['/wealth/detail', {id: content.id, backUrl: '/search/history'}]);
      } else {
        return this.router.navigate(['/text/detail', {id: content.id, backUrl: '/search/history'}]);
      }
    }
  }

  doSelect(itemId) {
    const index = this.selectItems.indexOf(itemId);
    if (index === -1) {
      this.selectItems.push(itemId);
    } else {
      this.selectItems.splice(index, 1);
    }
    console.log('selectItems是：', this.selectItems);
  }


  clearHistory() {
    this.storage.remove(APIService.SAVE_STORAGE.searchHistory).then(() => {
      this.selectItems = [];
      this.searchHistoryData = [];
    });
  }

  delSomeHistory() {
    if (this.selectItems.length > 0) {

      for (const itemId of this.selectItems) {
        for (let i = 0; i < this.searchHistoryData.length; i++) {
          if (this.searchHistoryData[i].id === itemId) {
            this.searchHistoryData.splice(i, 1);
          }
        }
      }

      this.storage.set(APIService.SAVE_STORAGE.searchHistory, this.searchHistoryData);
    }
  }


  search() {
    const searchHistoryDataNew = [];
    const keyword = this.searchContent.value.trim();
    if (keyword) {
      for (const item of this.searchHistoryData) {
        const itemsSelectNew = [];
        for (const content of item.itemsSelect) {
          const title = content.title;
          const description = content.description;
          const indexTitle = title.indexOf(keyword);
          const indexDescription = description.indexOf(keyword);
          if (indexTitle !== -1 || indexDescription !== -1) {
            itemsSelectNew.push(content);
          }
        }
        if (itemsSelectNew.length > 0) {
          const dataNew: SearchHistoryInterface = {id: item.id, keyword: item.keyword, itemsSelect: itemsSelectNew};
          searchHistoryDataNew.push(dataNew);
        }
      }
      this.searchHistoryData = searchHistoryDataNew;
    } else {
      this.getData();
    }
  }
}
