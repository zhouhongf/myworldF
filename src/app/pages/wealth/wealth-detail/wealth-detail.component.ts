import { Component, OnInit } from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ModalController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {APIService} from '../../../providers/api.service';
import {PdfshowComponent} from '../../../tool/pdfshow/pdfshow.component';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {PreviewimgService} from '../../../providers/previewimg.service';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'app-wealth-detail',
  templateUrl: './wealth-detail.component.html',
  styleUrls: ['./wealth-detail.component.scss'],
})
export class WealthDetailComponent implements OnInit {
  isLogin = false;
  userAvatar = 'assets/images/dengShanRen.jpg';
  backUrl;
  backTarget;
  isMobile = false;

  dataShow;
  redStarList: Array<any>;
  nonStarList: Array<any>;
  rateIncome;
  amountStart;

  bankLogoUrl;
  textHtml;
  isFavor = false;

  constructor(
      private baseService: BaseService,
      private route: ActivatedRoute,
      private router: Router,
      private modalCtrl: ModalController,
      private http: HttpClient,
      private storage: Storage,
      private loadingCtrl: LoadingController,
      private inAppBrowser: InAppBrowser,
      private previewimgService: PreviewimgService
  ) {
    this.isMobile = this.baseService.isMobile();
  }

  ngOnInit() {
    this.getRouteParams();
  }

  goBack() {
    if (this.backTarget) {
      return this.router.navigate([this.backUrl, {target: this.backTarget}]);
    } else {
      return this.router.navigateByUrl(this.backUrl);
    }
  }

  getRouteParams() {
    this.route.paramMap.subscribe(data => {
      const targetId = data.get('id');
      this.backUrl = data.get('backUrl');
      this.backTarget = data.get('target');
      this.isLogin = this.baseService.isLogin();
      if (targetId) {
        this.getData(targetId);
      }
    });
  }

  getData(wealthId: string) {
    this.storage.get(APIService.SAVE_STORAGE.favorWealths).then(data => {
      if (data) {
        for (const one of data) {
          if (one.id === wealthId) {
            this.isFavor = true;
            this.dataShow = one;
            break;
          }
        }
        if (this.isFavor) {
          return this.prepareData(this.dataShow);
        }
      }
      return this.getWealthDetail(wealthId);
    })
  }

  getWealthDetail(wealthId: string) {
    this.baseService.httpGet(APIService.WEALTH.detail + wealthId, null, data => {
      if (data.code === 0) {
        this.dataShow = data.data;
        this.prepareData(data.data);
      }
    });
  }

  prepareData(dataShow) {
    const risk = dataShow.risk;
    if (risk) {
      this.redStarList = new Array<any>(risk);
      this.nonStarList = new Array<any>(5 - risk);
    }

    const rateMax = dataShow.rateMax;
    const rateMin = dataShow.rateMin;
    if (rateMax && rateMin) {
      if (rateMax > rateMin) {
        this.rateIncome = (rateMin * 100).toFixed(2) + '% ~ ' + (rateMax * 100).toFixed(2) + '%';
      } else if (rateMax === rateMin) {
        this.rateIncome = (rateMin * 100).toFixed(2) + '%';
      }
    } else if (rateMax) {
      this.rateIncome = (rateMax * 100).toFixed(2) + '%';
    } else if (rateMin) {
      this.rateIncome = (rateMin * 100).toFixed(2) + '%';
    } else {
      this.rateIncome = '暂无';
    }

    const amountBuyMin = dataShow.amountBuyMin;
    if (amountBuyMin) {
      if (amountBuyMin < 10000) {
        this.amountStart = amountBuyMin + '元';
      } else {
        this.amountStart = Math.round(amountBuyMin / 10000) + '万元';
      }
    }
    const name = dataShow.bankName;
    this.bankLogoUrl = APIService.assetsBankLogoSmall + name + '.png';
    console.log('dataShow是：', this.dataShow);
  }


  doDownload(id: string, fileType: string) {
    if (fileType) {
      if (this.isMobile) {
        this.doDownloadMobile(id, fileType);
      } else {
        this.doDownloadBrowser(id, fileType);
      }
    } else {
      return this.baseService.presentToast('暂无产品说明书')
    }
  }

  async doDownloadBrowser(id: string, fileType: string) {
    const loading = await this.loadingCtrl.create({});
    await loading.present();
    this.http.get(APIService.domain + APIService.WEALTH.manual + id, {responseType: 'blob'}).subscribe(async data => {
      await loading.dismiss();
      if(data.size > 0){
        let fileTypeFull;
        if(fileType === '.pdf' || fileType === '.doc' || fileType === '.docx') {
          fileTypeFull = 'application/' + fileType.substring(1)
          const theBlob = new Blob([data], {type: fileTypeFull});
          // const theFile = new File([data], id + '.pdf', {type: 'application/pdf'});
          // saveAs(theBlob, id + '.pdf');
          const link = window.URL.createObjectURL(theBlob);
          window.open(link, '_target');
          // await this.openPDF(theBlob)
        } else {
          const theBlob = new Blob([data], {type: 'text/html,charset=UTF-8'});
          this.previewimgService.readAsText(theBlob).then(value => {
            this.textHtml = value;
          })
        }
      }
    });
  }

  async doDownloadMobile(id: string, fileType: string) {
    const loading = await this.loadingCtrl.create({});
    await loading.present();
    this.http.get(APIService.domain + APIService.WEALTH.manual + id, {responseType: 'blob'}).subscribe(async data => {
      await loading.dismiss();
      if (data.size > 0) {
        let fileTypeFull;
        if(fileType === '.pdf' || fileType === '.doc' || fileType === '.docx') {
          fileTypeFull = 'application/' + fileType.substring(1)
          const theBlob = new Blob([data], {type: fileTypeFull});
          // const theFile = new File([data], id + '.pdf', {type: 'application/pdf'});
          // saveAs(theBlob, id + '.pdf');
          await this.openPDF(theBlob)
        } else {
          const theBlob = new Blob([data], {type: 'text/html,charset=UTF-8'});
          this.previewimgService.readAsText(theBlob).then(value => {
            this.textHtml = value;
          })
        }
      }

    });
  }

  async openPDF(blob) {
    const link = window.URL.createObjectURL(blob);
    const modal = await this.modalCtrl.create({
      component: PdfshowComponent,
      componentProps: {
        displayData: {pdfSource: {url: link}}
      }
    });
    return await modal.present();
  }


  setFavor() {
    if (this.isFavor) {
      this.delFavor();
    } else {
      this.addFavor();
    }
  }

  addFavor() {
    const wealthId = this.dataShow.id;
    this.storage.get(APIService.SAVE_STORAGE.favorWealths).then(data => {
      if (data) {
        for (const one of data) {
          if (one.id === wealthId) {
            this.isFavor = true;
            break;
          }
        }
        if (this.isFavor) {
          return;
        }
        this.isFavor = true;
        data.push(this.dataShow);
        return this.storage.set(APIService.SAVE_STORAGE.favorWealths, data);
      }
      this.isFavor = true;
      const dataNew = [];
      dataNew.push(this.dataShow);
      return this.storage.set(APIService.SAVE_STORAGE.favorWealths, dataNew);
    })
  }

  delFavor() {
    const wealthId = this.dataShow.id;
    this.storage.get(APIService.SAVE_STORAGE.favorWealths).then(data => {
      if (data) {
        for (let i=0; i<data.length; i++) {
          const one = data[i];
          if (one.id === wealthId) {
            data.splice(i, 1);
            break;
          }
        }
        this.isFavor = false;
        return this.storage.set(APIService.SAVE_STORAGE.favorWealths, data);
      }
    })
  }

}
