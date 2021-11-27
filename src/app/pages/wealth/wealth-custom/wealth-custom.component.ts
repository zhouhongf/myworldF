// 根据银行名单，选择需要自定义出来的银行名单
import {Component, OnDestroy, ViewChild} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {bankNameData} from '../../../models/bank-name';
import {FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {DialogAlertComponent} from '../../../tool/dialog-alert/dialog-alert.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Storage} from '@ionic/storage';
import {MatSidenav} from '@angular/material/sidenav';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-wealth-custom',
    templateUrl: './wealth-custom.component.html',
    styleUrls: ['./wealth-custom.component.scss']
})
export class WealthCustomComponent implements OnDestroy {
    navigationSubscription;
    myListKey = APIService.SAVE_STORAGE.customWealthList;
    myListData = new Map();
    myListBankNames = new Set<string>();
    listData = [];

    theAlertTitle = '设置名单名称';
    theForbiddenAlert = '该名称已存在';

    theData = bankNameData;
    showSearch = false;
    showDelButton = false;

    myControl = new FormControl('', Validators.required);
    filteredOptions: Observable<string[]>;

    @ViewChild('sidenavLeft', {static: false}) sidenavLeft: MatSidenav;

    constructor(private baseService: BaseService, private dialog: MatDialog, private storage: Storage, private route: ActivatedRoute, private router: Router) {
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/wealth/custom') {
                    this.getData();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    getData() {
        this.myListData = new Map();
        this.myListBankNames = new Set<string>();
        this.listData = [];
        this.storage.get(this.myListKey).then(data => {
            if (data) {
                console.log('已获取自定义列表信息');
                this.myListData = data;
                this.myListData.forEach((value, key) => {
                    this.listData.push(key);
                });
                console.log(this.listData);
            } else {
                this.search();
            }
        });
    }

    search() {
        this.showSearch = true;
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    private _filter(value: string): string[] {
        if (value != null) {
            const filterValue = value.toLowerCase();
            return this.theData.filter(option => option.toLowerCase().includes(filterValue));
        }
    }

    searchCancel() {
        this.showSearch = false;
        this.showDelButton = false;
        this.myListBankNames = new Set<string>();
    }

    searchReset() {
        this.myControl.reset();
        this.search();
    }

    openDialog() {
        const dialogRef = this.dialog.open(DialogAlertComponent, {
            minHeight: '300px',
            minWidth: '320px',
            data: {typeIn: 'custom', title: this.theAlertTitle, forbidden: this.listData, alertWord: this.theForbiddenAlert}
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data !== undefined && data !== '') {
                this.myListData.set(data, this.myListBankNames);
                // 更新本地存储中的myListData
                this.storage.set(this.myListKey, this.myListData);
                // 页面上增加显示自定义的标题
                this.listData.push(data);
                this.sidenavLeft.toggle();
                this.searchCancel();
            }
        });
    }

    deleteMyList(title, i) {
        this.listData.splice(i, 1);
        this.myListData.delete(title);
        // 更新本地存储中的myListData
        this.storage.set(this.myListKey, this.myListData);
        this.storage.remove(title);
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.listData, event.previousIndex, event.currentIndex);
    }

    selectThis(option) {
        this.myListBankNames.has(option) ? this.myListBankNames.delete(option) : this.myListBankNames.add(option);
    }

    goToCustomChoose(title: string) {
        console.log('准备导航到/wealth/standard');
        // return this.router.navigate(['/wealth/standard', {param: title}]);
    }


}
