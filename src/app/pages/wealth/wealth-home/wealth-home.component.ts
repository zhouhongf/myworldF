import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {Storage} from '@ionic/storage';


@Component({
    selector: 'app-wealth-home',
    templateUrl: './wealth-home.component.html',
    styleUrls: ['./wealth-home.component.scss']
})
export class WealthHomeComponent implements OnInit {
    @ViewChild('mainHeaderWealth', {static: false}) header;
    imageUrl = 'url(assets/images/dengShanRen.jpg)';

    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize * 2;
    pageTotal = 1;
    pageCount = 1;
    dataShow = [];
    bankName;

    constructor(private baseService: BaseService, private router: Router, private route: ActivatedRoute, private storage: Storage,) {
    }

    ngOnInit() {
        this.getRouteParams();
    }

    getRouteParams() {
        this.route.paramMap.subscribe(data => {
            this.bankName = data.get('bankName');
            if (this.bankName) {
                this.imageUrl = 'url(' + APIService.wordcloudPrefix + this.bankName + ')';
            } else {
                this.getSlides();
            }
            this.getData();
        });
    }

    getSlides() {
        let slides = [];
        this.storage.get(APIService.SAVE_STORAGE.allSlides).then(data =>  {
            if (data) {
                slides = data.data;
                const total = slides.length;
                const randomNum = Math.floor(Math.random() * total);
                this.imageUrl = slides[randomNum].image;
            }
        })
    }

    scrollEvent(e) {
        const opacity = (e.detail.scrollTop - 300) / 300;
        this.header._elementRef.nativeElement.style.background = `rgba(255,255,255,${opacity})`;
    }

    doRefresh(event) {
        this.pageIndex = APIService.pageIndex;
        this.pageSize = APIService.pageSize * 2;
        this.pageTotal = 1;
        this.pageCount = 1;
        this.dataShow = [];
        this.getData();
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }

    doInfinite(event) {
        const num = this.dataShow.length;
        if (num > 0 && (num % this.pageSize === 0)) {         // 当前项目总数除以pageSize是求余，如果余数不为0，那么就是最后一页了
            this.pageIndex += 1;
            this.getData();
        }
        setTimeout(() => {
            event.target.complete();
            if (num === this.pageTotal) {
                event.target.disabled = true;
            }
        }, 2000);
    }

    getData() {
        const params = {pageSize: this.pageSize, pageIndex: this.pageIndex};
        if (this.bankName) {
            params['bankName'] = this.bankName;
        }
        this.baseService.httpGet(APIService.WEALTH.wealthMore, params, data => {
            if (data.code === 0) {
                if (this.pageIndex === 0) {
                    this.pageTotal = data.num;
                    this.pageCount = Math.ceil(this.pageTotal / this.pageSize);
                    this.dataShow = this.makeupWealthList(data.data);
                } else {
                    const wealthMore = this.makeupWealthList(data.data);
                    this.dataShow = this.dataShow.concat(wealthMore);
                }
            } else {
                console.log(data.msg);
            }
        }, true)
    }


    makeupWealthList(wealths) {
        const dataList = [];
        for (const one of wealths) {
            const amountBuyMin = Math.round(one.amountBuyMin / 10000);
            let rate;
            if (one.rateMin && one.rateMax){
                if (one.rateMin === one.rateMax) {
                    rate = one.rateMin;
                } else {
                    rate = one.rateMin + '~' + one.rateMax;
                }
            } else if (one.rateMin) {
                rate = one.rateMin;
            } else if (one.rateMax) {
                rate = one.rateMax;
            } else {
                rate = '详见产品说明书'
            }
            const oneWealth = {id: one.id, name: one.name, bankName: one.bankName, risk: one.risk, term: one.term, amountBuyMin, rate};
            dataList.push(oneWealth);
        }
        return dataList;
    }

    goToDetailWealth(one) {
        let backUrl = '/wealth/home';
        if (this.bankName) {
            backUrl = backUrl + ';bankName=' + this.bankName;
        }
        return this.router.navigate(['/wealth/detail', {id: one.id, backUrl}])
    }
}
