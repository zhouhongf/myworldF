import {Injectable} from '@angular/core';
import {APIService} from './api.service';
import {Observable} from 'rxjs';
import {LocationDetail} from '../models/system-data';
import {Platform} from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {HttpClient} from '@angular/common/http';


declare let AMap;

@Injectable({
    providedIn: 'root'
})
export class GaodeService {

    constructor(private platform: Platform, private geolocation: Geolocation, private http: HttpClient) {
    }


    updateVisitorByMobile() {
        this.geolocation.getCurrentPosition({maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}).then(data => {
            const lngPosition = data.coords.longitude;
            const latPosition = data.coords.latitude;
            const userLngLat = {lng: lngPosition, lat: latPosition};
            localStorage.setItem(APIService.SAVE_LOCAL.userLngLat, JSON.stringify(userLngLat));

            this.getLocationInfoAMap(lngPosition, latPosition).subscribe(locationDetail => {
                if (locationDetail) {
                    this.http.post(APIService.domain + APIService.COMMON.updateVisitorMobile, locationDetail).subscribe(val => {
                        console.log(val['msg']);
                    });
                }
            });
        }).catch((error) => {
            console.log('ionic未能获取到location: ' + JSON.stringify(error));
        });
    }

    /**
     * 先转换成高德坐标系，再解析地址
     */
    getLocationInfoAMap(longitude, latitude): Observable<string> {
        const lnglat = [Number(longitude), Number(latitude)];
        return new Observable<string>(observer => {
            AMap.convertFrom(lnglat, 'gps', (statusConvert, resultConvert) => {
                if (resultConvert.info === 'ok') {
                    const realLngLat = resultConvert.locations;
                    const theLocation = realLngLat[0];
                    const realLocation = [theLocation.lng, theLocation.lat];
                    if (theLocation) {
                        AMap.plugin('AMap.Geocoder', () => {
                            const geocoder = new AMap.Geocoder({radius: 3000, extensions: 'all'});

                            geocoder.getAddress(realLocation, (status, result) => {
                                if (status === 'complete' && result.info === 'OK') {
                                    const gpsProvince = result.regeocode.addressComponent.province;
                                    const gpsCity = result.regeocode.addressComponent.city;
                                    const gpsDistrict = result.regeocode.addressComponent.district;
                                    const gpsTownship = result.regeocode.addressComponent.township;
                                    const gpsStreet = result.regeocode.addressComponent.street;
                                    const gpsStreetNumber = result.regeocode.addressComponent.streetNumber;
                                    const gpsFormattedAddress = result.regeocode.formattedAddress;

                                    localStorage.setItem(APIService.SAVE_LOCAL.currentCity, gpsCity);

                                    const locationDetail = new LocationDetail(longitude, latitude, gpsProvince, gpsCity, gpsDistrict, gpsTownship, gpsStreet, gpsStreetNumber, gpsFormattedAddress);
                                    observer.next(JSON.stringify(locationDetail));
                                } else {
                                    observer.next(null);
                                }
                            });
                        });
                    }
                }
            });
        });
    }


    /**
     *  ionicNative定位功能
     *  如果在高德地图上显示，需转换为高德坐标系
     */
    getLngLatIonic(): Observable<any> {
        return new Observable<any>(observer => {
            this.geolocation.getCurrentPosition({maximumAge: 3000, timeout: 5000, enableHighAccuracy: true})
                .then(
                    data => {
                        const lngPosition = data.coords.longitude;
                        const latPosition = data.coords.latitude;
                        const lngLat = [lngPosition, latPosition];
                        observer.next(lngLat);
                    })
                .catch(error => {
                    console.log('ionic未能获取到location: ' + JSON.stringify(error));
                    observer.next(null);
                });
        });
    }

    /**
     * 所有在高德地图上显示的坐标系，都需要转换为高德坐标系
     */
    convertLngLatToAMap(longitude, latitude): Observable<any> {
        const lnglat = [Number(longitude), Number(latitude)];
        return new Observable<any>(observer => {
            AMap.convertFrom(lnglat, 'gps', (statusConvert, resultConvert) => {
                if (resultConvert.info === 'ok') {
                    const realLngLat = resultConvert.locations;
                    const theLocation = realLngLat[0];
                    const realLocation = [theLocation.lng, theLocation.lat];
                    observer.next(realLocation);
                } else {
                    console.log('转换为高德坐标系失败');
                    observer.next(null);
                }
            });
        });
    }

    /**
     * 通过高德地图获取所在城市信息
     */
    getCityAMap(): Observable<string> {
        return new Observable<string>(observer => {
            AMap.plugin('AMap.Geolocation', () => {
                const geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
                    convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                });
                geolocation.getCityInfo((status, result) => {
                    if (status === 'complete' && result.info === 'SUCCESS') {
                        const city = result.city;
                        const center = result.center;
                        const cityLngLat = {lng: center[0], lat: center[1]};
                        localStorage.setItem(APIService.SAVE_LOCAL.cityLngLat, JSON.stringify(cityLngLat));
                        localStorage.setItem(APIService.SAVE_LOCAL.currentCity, city);
                        observer.next(city);
                    } else {
                        observer.next(null);
                    }
                });
            });
        });
    }

    /**
     * 通过高德地图获取经纬度信息
     */
    getLocationAMap(): Observable<any> {
        console.log('开始执行getLocationAMap()方法');
        return new Observable<any>(observer => {
            AMap.plugin('AMap.Geolocation', () => {
                const geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
                    convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,         // 显示定位按钮，默认：true
                    buttonPosition: 'LB',     // 定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true,         // 定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true,         // 定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true,      // 定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });

                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);
                AMap.event.addListener(geolocation, 'error', onError);

                function onComplete(data) {
                    console.log('data是具体的定位信息:', data);
                    observer.next(data);
                }

                function onError(data) {
                    console.log('data是定位出错信息:', data);
                    observer.next(data);
                }
            });
        });
    }

    /**
     * 通过高德地图搜索附近信息
     */
    searchAMapPOI(city: string, type: string, name: string, pageIndex: number): Observable<any> {
        return new Observable<any>(observer => {
            AMap.plugin('AMap.PlaceSearch', () => {
                const placeSearch = new AMap.PlaceSearch({
                    city: city,
                    children: 1,
                    type: type,
                    pageSize: 50,
                    pageIndex: pageIndex,
                    extensions: 'all'
                });
                placeSearch.search(name, (status, result) => {
                    if (result.info === 'OK') {
                        observer.next(result.poiList);
                    } else {
                        observer.next(null);
                    }
                });
            });
        });
    }
}
