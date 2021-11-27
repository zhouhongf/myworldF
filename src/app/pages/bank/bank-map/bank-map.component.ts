import {Component, OnInit, ViewChild} from '@angular/core';
import {GaodeMapComponent} from '../../../tool/gaode-map/gaode-map.component';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
    selector: 'app-bank-map',
    templateUrl: './bank-map.component.html',
    styleUrls: ['./bank-map.component.scss'],
})
export class BankMapComponent implements OnInit {
    @ViewChild('sidenavLeft', {static: false}) sidenavLeft: MatSidenav;
    @ViewChild(GaodeMapComponent, {static: false}) gaodeMapComponent: GaodeMapComponent;
    noPic = 'assets/images/nopic.jpg';
    userLocation;
    userLongitude;
    userLatitude;
    currentCity: string;

    bankLocationsData;
    currentBankLocationData;
    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize;
    pageLength = APIService.pageLength;

    bankName: string;
    webWorker;

    constructor(private baseService: BaseService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.currentCity = localStorage.getItem(APIService.SAVE_LOCAL.currentCity);
        this.route.paramMap.subscribe(data => {
            this.bankName = data.get('param');
            this.getUserLocation();
            if (this.bankName) {
                this.getBankLocations(this.bankName);
            }
        });
    }

    getUserLocation() {
        const userLngLat = localStorage.getItem(APIService.SAVE_LOCAL.userLngLat);
        const cityLngLat = localStorage.getItem(APIService.SAVE_LOCAL.cityLngLat);
        this.userLocation = userLngLat ? userLngLat : cityLngLat;
        const theData = JSON.parse(this.userLocation);
        this.userLongitude = Number(theData['lng']);
        this.userLatitude = Number(theData['lat']);
    }

    getBankLocations(bankName) {
        this.baseService.getBankLocations(bankName).subscribe(locations => {
            if (locations) {
                const dataIn = {userLongitude: this.userLongitude, userLatitude: this.userLatitude, bankLocationsData: locations};
                this.startWorker(dataIn);
            }
        });
    }

    startWorker(dataIn) {
        if (typeof Worker !== 'undefined') {
            this.webWorker = new Worker('./bank-map.worker', {type: 'module'});
            this.webWorker.onmessage = (dataOut) => {
                const dataNeed = dataOut.data;
                if (dataNeed) {
                    this.bankLocationsData = dataOut.data;
                    this.makeUpBankLocationsData();
                    this.sidenavLeft.close();
                }
            };
            this.webWorker.postMessage(dataIn);
        } else {
            console.log('不支持Web Workers，请自定义需要后台运行的方法逻辑');
        }
    }

    makeUpBankLocationsData() {
        this.pageLength = this.bankLocationsData.length;
        if (this.pageLength > 10) {
            this.currentBankLocationData = this.bankLocationsData.slice(0, 10);
        } else {
            this.currentBankLocationData = this.bankLocationsData;
        }

        const bankLngLatList = [];
        for (const value of this.currentBankLocationData) {
            bankLngLatList.push(value['location']);
        }
        this.gaodeMapComponent.showBankPosition(bankLngLatList);
    }

    doPage(event) {
        this.pageIndex = event.pageIndex;
        this.currentBankLocationData = this.bankLocationsData.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
        const bankLngLatList = [];
        this.currentBankLocationData.forEach(value => {
            bankLngLatList.push(value['location']);
        });
        this.gaodeMapComponent.showBankPosition(bankLngLatList);
        this.sidenavLeft.close();
    }

}
