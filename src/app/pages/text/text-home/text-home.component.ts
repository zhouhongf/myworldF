import {Component, OnInit, ViewChild} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {bankNameLink} from '../../../models/bank-name';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'app-text-home',
  templateUrl: './text-home.component.html',
  styleUrls: ['./text-home.component.scss'],
})
export class TextHomeComponent implements OnInit {
  keyword: string;
  @ViewChild('mainHeaderText', {static: false}) header;
  imageUrl = 'url(assets/images/dengShanRen.jpg)';

  pageIndex = APIService.pageIndex;
  pageSize = APIService.pageSize * 2;
  pageTotal = 1;
  pageCount = 1;
  dataShow = [];

  bankNameList = [];

  constructor(private baseService: BaseService, private route: ActivatedRoute, private router: Router, private storage: Storage) {
  }

  ngOnInit() {
    this.getRouteParams();
    for (const one of bankNameLink) {
      this.bankNameList.push(one['name']);
    }
  }

  getRouteParams() {
    this.route.paramMap.subscribe(data => {
      this.keyword = data.get('target');
      this.getSlides();
      this.getData();
    });
  }

  scrollEvent(e) {
    const opacity = (e.detail.scrollTop - 300) / 300;
    this.header._elementRef.nativeElement.style.background = `rgba(255,255,255,${opacity})`;
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


  getData() {
    const params = {keyword: this.keyword, pageIndex: this.pageIndex, pageSize: this.pageSize};
    this.baseService.httpGet(APIService.WEALTH.textOutline, params, data => {
      if (data.code === 0) {
        if (this.pageIndex === 0) {
          this.pageTotal = data.num;
          this.dataShow = data.data;
        } else {
          this.dataShow = this.dataShow.concat(data.data);
        }
      } else {
        console.log(data.msg);
      }
    });
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


  goToDetail(one) {
    return this.router.navigate(['/text/detail', {id: one.id, backUrl: '/text/home', target: this.keyword}]);
  }


}
