import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {APIService} from '../../../providers/api.service';
import {bankNameLink} from '../../../models/bank-name';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {Storage} from '@ionic/storage';
import {SearchHistoryInterface, SearchItemInterface} from '../../../models/system-interface';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

    searchContent = new FormControl('', Validators.required);

    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize;
    pageTotal = 1;
    pageCount = 1;
    dataShow;

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
            const words = data.get('words');
            if (words) {
                this.searchContent.patchValue(words);
                this.search();
            } else {
                this.getSearchDataLocal();
            }
        });
    }

    getSearchDataLocal() {
        const dataStr = localStorage.getItem(APIService.SAVE_LOCAL.currentSearch);
        if (dataStr) {
            const data = JSON.parse(dataStr);
            this.pageTotal = data.pageTotal;
            this.pageCount = data.pageCount;
            this.pageIndex = data.pageIndex;
            this.dataShow = data.dataShow;
            this.searchContent.patchValue(data.searchContent);
        } else {
            return this.router.navigate(['/']);
        }
    }

    doSearch() {
        this.pageIndex = APIService.pageIndex;
        this.pageSize = APIService.pageSize;
        this.pageTotal = 1;
        this.pageCount = 1;
        this.dataShow = [];
        this.search();
    }

    search() {
        const keyword = this.searchContent.value.trim();
        if (keyword) {
            const params = {keyword, pageIndex: this.pageIndex, pageSize: this.pageSize};
            this.baseService.httpGet(APIService.WEALTH.textSearch, params, data => {
                if (data.code === 0) {
                    this.pageTotal = data.num;
                    this.pageCount = Math.ceil(this.pageTotal / this.pageSize);
                    this.dataShow = data.data;
                    this.initSearchHistoryRecord(keyword);
                } else {
                    console.log(data.msg);
                }
            });
        }
    }

    // ???????????????????????????????????????
    // ???1?????????????????????
    // ???2???????????????????????????????????????????????????????????????????????????????????????
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

    // ??????????????????????????????goToDetail()?????????????????????????????????
    updateSearchHistoryRecord(oneData) {
        const item: SearchItemInterface = {id: oneData.id, type: 'TEXT', title: oneData.name, description: '', url: '', createTime: oneData.create_time};
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
                    // ??????itemsSelect??????????????????????????????item
                    // ???????????????itemsSelect
                    if (lastRecord.itemsSelect.length > 0) {
                        // ??????itemsSelect??????????????????????????????item??????id, ????????????????????????????????????????????????item
                        for (let i = 0; i < lastRecord.itemsSelect.length; i++) {
                            const one = lastRecord.itemsSelect[i];
                            if (one.id === item.id) {
                                lastRecord.itemsSelect.splice(i, 1);
                                lastRecord.itemsSelect.unshift(item);
                                break;
                            }
                        }

                        // ??????itemsSelect???????????????????????????id????????????item???id, ????????????item???itemsSelect??????
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


    doPage() {
        if (this.pageCount > 1) {
            if (this.pageIndex === 0) {
                this.pageIndex += 1;
                this.search();
            }
        }
    }

    doPageNext() {
        if (this.pageCount > 1) {
            if (this.pageIndex < this.pageCount) {
                this.pageIndex += 1;
                this.search();
            }
        }
    }

    doPagePrevious() {
        if (this.pageIndex > 0) {
            this.pageIndex -= 1;
            this.search();
        }
    }


    goToDetail(data) {
        const searchSave = {
            pageTotal: this.pageTotal,
            pageCount: this.pageCount,
            pageIndex: this.pageIndex,
            searchContent: this.searchContent.value,
            dataShow: this.dataShow
        };
        return this.router.navigate(['/text/detail', {id: data.id, backUrl: '/search/result'}]).then(() => {
            localStorage.setItem(APIService.SAVE_LOCAL.currentSearch, JSON.stringify(searchSave));  // ??????????????????????????????localStorage???????????????????????????
            this.updateSearchHistoryRecord(data);                                                   // ???????????????????????????????????????
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
        console.log('?????????url??????????????????????????????');
    }
}
