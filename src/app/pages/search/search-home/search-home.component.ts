import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';
import {bankNameLink} from '../../../models/bank-name';


@Component({
    selector: 'app-search-home',
    templateUrl: './search-home.component.html',
    styleUrls: ['./search-home.component.scss'],
})
export class SearchHomeComponent implements OnInit {
    @ViewChild('mainHeader', {static: false}) header;
    cityname;
    citytemp;
    cityweather;

    slides = [];
    slideOpts = {
        effect: 'flip',
        loop: true,
        speed: 600,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    };

    bankNameList = [];
    dataWealth = [];
    dataTextsFinance = [];
    dataTextsNews = [];
    dataTextsHR = [];
    dataTextsBuy = [];
    dataTextsImportant = [];

    constructor(private baseService: BaseService, private storage: Storage, private router: Router) {
    }

    ngOnInit() {
        this.cityname = localStorage.getItem(APIService.SAVE_LOCAL.currentCity);
        this.citytemp = localStorage.getItem(APIService.SAVE_LOCAL.cityTemp);
        this.cityweather = localStorage.getItem(APIService.SAVE_LOCAL.cityWeather);
        for (const one of bankNameLink) {
            this.bankNameList.push(one.name);
        }
        this.getSlides();
        this.getOverall();
    }

    doRefresh(event) {
        this.getOverall();
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }

    scrollEvent(e) {
        const opacity = (e.detail.scrollTop - 300) / 300;
        this.header._elementRef.nativeElement.style.background = `rgba(255,255,255,${opacity})`;
    }

    getSlides() {
        this.storage.get(APIService.SAVE_STORAGE.allSlides).then(data => {
            if (data) {
                const expireTime = data.expireTime;
                const currentTime = new Date().getTime();
                if (currentTime < expireTime) {
                    return this.slides = data.data;
                }
            }
            this.getSlidesRemote();
        })
    }

    getSlidesRemote() {
        this.baseService.httpGet(APIService.FILEAPI.getSlideList, null, data => {
            if (data.code === 0) {
                const dataList : Array<any> = data.data;
                for (const one of dataList) {
                    one.image = 'url(' + one.image + ')';
                    this.slides.push(one);

                    const expireTime = new Date().getTime() + APIService.dataValidOneDay;
                    const dataSave = {expireTime, data: this.slides}
                    this.storage.set(APIService.SAVE_STORAGE.allSlides, dataSave);
                }
            }
        });
    }

    getOverall() {
        this.baseService.httpGet(APIService.WEALTH.overallOutline, null, data => {
            if (data.code === 0) {
                console.log(data.data)
                this.dataWealth = data.data.wealths;
                this.dataTextsFinance = data.data.textsFinance;
                this.dataTextsNews = data.data.textsNews;
                this.dataTextsHR = data.data.textsHR;
                this.dataTextsBuy = data.data.textsBuy;
                this.dataTextsImportant = data.data.textsImportant;

                for (const one of this.dataWealth) {
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
                    one.rate = rate;
                    one.amountBuyMin = amountBuyMin;
                }
            }
        })
    }

    goToDetailText(one) {
        return this.router.navigate(['/text/detail', {id: one.id, backUrl: '/'}])
    }

    goToDetailWealth(one) {
        return this.router.navigate(['/wealth/detail', {id: one.id, backUrl: '/'}])
    }
}
