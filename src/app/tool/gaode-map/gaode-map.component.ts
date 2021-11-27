import {Component, Input, OnInit} from '@angular/core';
import {BaseService} from '../../providers/base.service';
import {APIService} from '../../providers/api.service';
import {GaodeService} from '../../providers/gaode.service';


declare var AMap: any;

@Component({
    selector: 'app-gaode-map',
    templateUrl: './gaode-map.component.html',
    styleUrls: ['./gaode-map.component.scss']
})
export class GaodeMapComponent implements OnInit {
    @Input() maxHeight: string;
    userLocation;
    bankMap;
    markers = [];
    positions = [];

    constructor(private baseService: BaseService, private gaodeService: GaodeService) {
    }

    ngOnInit() {
        this.loadMap();
    }

    loadMap() {
        this.userLocation = localStorage.getItem(APIService.SAVE_LOCAL.userLngLat);
        if (this.userLocation) {
            const theData = JSON.parse(this.userLocation);
            const longitude = theData['lng'];
            const latitude = theData['lat'];
            this.gaodeService.convertLngLatToAMap(longitude, latitude).subscribe(data => {
                if (data) {
                    const realLngLat = data;
                    this.bankMap = new AMap.Map('gaode_container', {
                        center: realLngLat,
                        resizeEnable: true,
                        zoom: 11,
                    });
                    const marker = new AMap.Marker({
                        position: realLngLat,
                        icon: 'assets/poi-icon/poi-marker-red.png',
                        offset: new AMap.Pixel(-12, -36),
                        anchor: 'top-left'
                    });
                    this.bankMap.add(marker);
                    this.bankMap.setFitView();
                }
            });
        } else {
            // 城市坐标是直接从高德行政区数据库中获得，所以不用经纬度转换
            this.userLocation = localStorage.getItem(APIService.SAVE_LOCAL.cityLngLat);
            const theData = JSON.parse(this.userLocation);
            const realLngLat = [theData['lng'], theData['lat']];
            this.bankMap = new AMap.Map('gaode_container', {
                center: realLngLat,
                resizeEnable: true,
                zoom: 11,
            });
            const marker = new AMap.Marker({
                position: realLngLat,
                icon: 'assets/poi-icon/poi-marker-red.png',
                offset: new AMap.Pixel(-12, -36),
                anchor: 'top-left'
            });
            this.bankMap.add(marker);
            this.bankMap.setFitView();
        }
    }

    showBankPosition(lngLatList) {
        if (this.markers.length > 0) {
            this.bankMap.remove(this.markers);
        }

        this.markers = [];
        this.positions = [];
        for (const data of lngLatList) {
            const position = [];
            const one = data.split(',');
            position.push(Number(one[0]), Number(one[1]));
            this.positions.push(position);
        }
        console.log('传入的内容是：', this.positions);
        const numLength = this.positions.length > 10 ? 10 : this.positions.length;

        for (let i = 0, marker; i < numLength; i++) {
            marker = new AMap.Marker({
                map: this.bankMap,
                position: this.positions[i],
                icon: 'assets/poi-icon/poi-marker-' + (i + 1) + '.png',
                offset: new AMap.Pixel(-12, -36),
                anchor: 'top-left'
            });
            this.markers.push(marker);
        }
        this.bankMap.add(this.markers);
        this.bankMap.setFitView();
    }

}
