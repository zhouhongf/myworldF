import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {MatTableDataSource} from '@angular/material/table';


export interface WealthRankInterface {
    id: string;
    bankName: string;
    code: string;
    rate: string;
}

@Component({
    selector: 'app-wealth-rank',
    templateUrl: './wealth-rank.component.html',
    styleUrls: ['./wealth-rank.component.scss'],
})
export class WealthRankComponent implements OnInit {
    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize;
    pageLength = APIService.pageLength;
    pageCount = 1;

    displayedColumns = ['bankName', 'code', 'rate'];
    dataSource: MatTableDataSource<WealthRankInterface>;

    params = {};
    isMobile = false;
    constructor(private baseService: BaseService, private route: ActivatedRoute, private router: Router) {
        this.isMobile = this.baseService.isMobile();
    }

    ngOnInit() {
        this.getRouteParams();
    }

    getRouteParams() {
        this.route.paramMap.subscribe(data => {
            const bankLevel = data.get('bankLevel');
            const bankName = data.get('bankName');
            const risk = data.get('risk');
            const term = data.get('term');
            const promise = data.get('promise');
            const fixed = data.get('fixed');
            const start = data.get('start');
            const end = data.get('end');

            if (!bankLevel && !bankName && !risk && !term && !promise && !fixed && !start && !end) {
                console.log('没有参数传入，尝试从本地储存读取params');
                const dataStr = localStorage.getItem(APIService.SAVE_LOCAL.currentRank);
                if (dataStr) {
                    this.params = JSON.parse(dataStr);
                    this.pageIndex = this.params['pageIndex'];
                }
            } else {
                this.params = {pageIndex: this.pageIndex, pageSize: this.pageSize};
                if (bankLevel) {
                    this.params['bankLevel'] = bankLevel;
                }
                if (bankName) {
                    this.params['bankName'] = bankName;
                }
                if (risk) {
                    this.params['risk'] = risk;
                }
                if (term) {
                    this.params['term'] = term;
                }
                if (promise) {
                    this.params['promise'] = promise;
                }
                if (fixed) {
                    this.params['fixed'] = fixed;
                }
                if (start && end) {
                    this.params['start'] = start;
                    this.params['end'] = end;
                }
            }

            this.getData(this.params);
        });
    }

    getData(params) {
        this.baseService.httpGet(APIService.WEALTH.rank, params, data => {
            if (data['code'] === 0 ) {
                this.dataSource = new MatTableDataSource(data['data']);
                this.pageLength = data['num'];
                this.pageCount = Math.ceil(this.pageLength / this.pageSize);
            } else {
                this.baseService.presentToast(data['msg']);
            }
        });
    }

    goToPage(row) {
        localStorage.setItem(APIService.SAVE_LOCAL.currentRank, JSON.stringify(this.params));
        return this.router.navigate(['/wealth/detail', {id: row['id'], backUrl: '/wealth/rank'}]);
    }

    // 以下全部为翻页部分
    doPageBrowser(event) {
        this.pageIndex = event.pageIndex;
        this.params['pageIndex'] = this.pageIndex;
        this.getData(this.params);
    }

    doPage() {
        if (this.pageCount > 1) {
            if (this.pageIndex === 0) {
                this.pageIndex += 1;
                this.params['pageIndex'] = this.pageIndex;
                this.getData(this.params);
            }
        }
    }

    doPageNext() {
        if (this.pageCount > 1) {
            if (this.pageIndex < this.pageCount) {
                this.pageIndex += 1;
                this.params['pageIndex'] = this.pageIndex;
                this.getData(this.params);
            }
        }
    }

    doPagePrevious() {
        if (this.pageIndex > 0) {
            this.pageIndex -= 1;
            this.params['pageIndex'] = this.pageIndex;
            this.getData(this.params);
        }
    }
}
