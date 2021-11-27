import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {APIService} from '../../../providers/api.service';
import {bankNameLink} from '../../../models/bank-name';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {SearchHistoryInterface, SearchItemInterface} from '../../../models/system-interface';

@Component({
  selector: 'app-wealth-search',
  templateUrl: './wealth-search.component.html',
  styleUrls: ['./wealth-search.component.scss'],
})
export class WealthSearchComponent implements OnInit {
  searchContent = new FormControl('', Validators.required);

  pageIndex = APIService.pageIndex;
  pageSize = APIService.pageSize;
  pageTotal = 1;
  pageCount = 1;
  dataShow = [];

  bankNameLinkList = bankNameLink;
  chinesePattern = new RegExp(APIService.ChinesePattern, 'g');
  linkPattern = new RegExp(APIService.linkPattern, 'i');

  constructor(
      private baseService: BaseService,
      private route: ActivatedRoute,
      private router: Router,
      private storage: Storage,
      private inAppBrowser: InAppBrowser
  ) {
  }

  ngOnInit() {
    this.getRouteParams();
  }

  getRouteParams() {
    this.route.paramMap.subscribe(data => {
      const target = data.get('target');
      if (target) {
        this.getSearchDataLocal(target);
      } else {
        this.search();
      }
    });
  }

  getSearchDataLocal(target) {
    const dataStr = localStorage.getItem(APIService.SAVE_LOCAL.currentSearch);
    if (dataStr) {
      const data = JSON.parse(dataStr);
      const searchContent = data.searchContent;
      if (target === searchContent) {
        this.pageTotal = data.pageTotal;
        this.pageCount = data.pageCount;
        this.pageIndex = data.pageIndex;
        this.dataShow = data.dataShow;
        this.searchContent.patchValue(data.searchContent);
        return;
      }
    }
    return this.search();
  }

  doSearch() {
    this.pageIndex = APIService.pageIndex;
    this.pageSize = APIService.pageSize;
    this.pageTotal = 1;
    this.pageCount = 1;
    this.dataShow = [];
    this.search();
  }

  doInfinite(event) {
    const num = this.dataShow.length;
    if (num > 0 && (num % this.pageSize === 0)) {         // 当前项目总数除以pageSize是求余，如果余数不为0，那么就是最后一页了
      this.pageIndex += 1;
      this.search();
    }
    setTimeout(() => {
      event.target.complete();
      if (num === this.pageTotal) {
        event.target.disabled = true;
      }
    }, 2000);
  }

  goToDetail(data) {
    const searchSave = {
      pageTotal: this.pageTotal,
      pageCount: this.pageCount,
      pageIndex: this.pageIndex,
      searchContent: this.searchContent.value,
      dataShow: this.dataShow
    };

    const params = {id: data.id, backUrl: '/wealth/search'};
    const keyword = this.searchContent.value.trim();
    if (keyword) {
      params['target'] = keyword
    }
    return this.router.navigate(['/wealth/detail', params]).then(() => {
      localStorage.setItem(APIService.SAVE_LOCAL.currentSearch, JSON.stringify(searchSave));  // 将本页搜索结果保存在localStorage中，供页面返回使用
      this.updateSearchHistoryRecord(data);                                                   // 添加跳转历史到搜索历史中去
    });
  }

  goToExternal(value: string) {
    const resultOne = this.linkPattern.test(value);
    if (resultOne) {
      return this.inAppBrowser.create(value, '_self', 'location=no');
    }
    const resultTwo = value.match(this.chinesePattern);
    if (resultTwo) {
      let bankname = '';
      for (const two of resultTwo) {
        bankname += two;
      }
      let link = '';
      for (const data of this.bankNameLinkList) {
        if (bankname === data.name) {
          link = data.url;
          break;
        }
      }
      if (link) {
        return this.inAppBrowser.create(link, '_self', 'location=no');
      }
    }
    console.log('既不是url地址，也不是中文文字');
  }


  search() {
    const keyword = this.searchContent.value.trim();
    let params;
    if (keyword) {
      params = {keyword, pageIndex: this.pageIndex, pageSize: this.pageSize};
    } else {
      params = {pageSize: this.pageSize, pageIndex: this.pageIndex};
    }

    this.baseService.httpGet(APIService.WEALTH.wealthSearch, params, data => {
      if (data.code === 0) {
        if (this.pageIndex === 0) {
          this.pageTotal = data.num;
          this.pageCount = Math.ceil(this.pageTotal / this.pageSize);
          this.dataShow = data.data;
          if (keyword) {
            this.initSearchHistoryRecord(keyword);
          }
        } else {
          this.dataShow = this.dataShow.concat(data.data);
        }
      } else {
        console.log(data.msg);
      }
    });
  }

  // 两种情况下，初始化搜索历史
  // （1）搜索历史为空
  // （2）当前搜索历史中，最近的一次搜索，关键字跟现在的关键字不同
  initSearchHistoryRecord(keyword: string) {
    const currentTime = new Date().getTime();
    const item: SearchHistoryInterface = {id: currentTime.toString(), keyword, itemsSelect: new Array<SearchItemInterface>()};

    this.storage.get(APIService.SAVE_STORAGE.searchHistory).then(data => {
      let searchHistoryData = [];
      if (data) {
        searchHistoryData = data;
        const lastRecord = searchHistoryData[0];
        if (lastRecord) {
          if (keyword === lastRecord.keyword) {
            return;
          } else {
            searchHistoryData.unshift(item);
            return this.storage.set(APIService.SAVE_STORAGE.searchHistory, searchHistoryData);
          }
        }
      }
      searchHistoryData.unshift(item);
      return this.storage.set(APIService.SAVE_STORAGE.searchHistory, searchHistoryData);
    });
  }

  // 每次点击一次搜索结果goToDetail()即更新一次搜索历史结果
  updateSearchHistoryRecord(oneData) {
    const item: SearchItemInterface = {id: oneData.id, type: 'WEALTH', title: oneData.name, description: '', url: '', createTime: oneData.create_time};
    if (oneData.description) {
      item.description = oneData.description;
    } else {
      item.description = oneData.code;
    }
    if (oneData.url) {
      item.url = oneData.url;
    }

    this.storage.get(APIService.SAVE_STORAGE.searchHistory).then(searchHistoryData => {
      if (searchHistoryData) {
        const lastRecord = searchHistoryData[0];
        if (lastRecord.keyword === this.searchContent.value.trim()) {
          // 如果itemsSelect为空集合，则直接添加item
          // 否则，遍历itemsSelect
          if (lastRecord.itemsSelect.length > 0) {
            // 遍历itemsSelect，如果集合中已存在该item中的id, 则删除原来的，在最近的位置添加该item
            for (let i = 0; i < lastRecord.itemsSelect.length; i++) {
              const one = lastRecord.itemsSelect[i];
              if (one.id === item.id) {
                lastRecord.itemsSelect.splice(i, 1);
                lastRecord.itemsSelect.unshift(item);
                break;
              }
            }

            // 如果itemsSelect最新的一条记录中的id不等于该item的id, 则新增该item到itemsSelect中去
            const lastItemNew = lastRecord.itemsSelect[0];
            if (lastItemNew.id !== item.id) {
              lastRecord.itemsSelect.unshift(item);
            }
          } else {
            lastRecord.itemsSelect.unshift(item);
          }

          searchHistoryData.splice(0, 1, lastRecord);
          this.storage.set(APIService.SAVE_STORAGE.searchHistory, searchHistoryData);
        }
      }
    });
  }

}
