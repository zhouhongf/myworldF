import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {fixedType, promiseType, riskType, termType, timeRange} from '../../../models/bank-standard';
import {DialogAlertComponent} from '../../../tool/dialog-alert/dialog-alert.component';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-wealth-standard',
    templateUrl: './wealth-standard.component.html',
    styleUrls: ['./wealth-standard.component.scss'],
})
export class WealthStandardComponent implements OnInit {
    target: string;
    bankLevel: string;
    bankName: string;

    riskTypes = riskType;
    promiseTypes = promiseType;
    fixedTypes = fixedType;
    termTypes = termType;
    timeRanges = timeRange;

    riskSelect;
    promiseSelect;
    fixedSelect;
    termSelect;
    timeRangeSelect;
    timeRangeSelectTemp;

    minDate = new Date('2019-01-01 00:00:00');
    maxDate = new Date();

    timeRangeStart = new FormControl('', Validators.required);
    timeRangeEnd = new FormControl('', Validators.required);

    constructor(
        private baseService: BaseService,
        private dialog: MatDialog,
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.getRouteParams();
    }

    getRouteParams() {
        this.route.paramMap.subscribe(data => {
            this.target = data.get('target');
            this.bankLevel = data.get('bankLevel');
            this.bankName = data.get('bankName');
        });
    }

    openDialog() {
        const currentTime = new Date().getTime();
        if (this.timeRangeSelectTemp === 0) {
            if (this.timeRangeStart.valid && this.timeRangeEnd.valid) {
                const timeStart = new Date(this.timeRangeStart.value).getTime();
                const timeEnd = new Date(this.timeRangeEnd.value).getTime();

                if (timeEnd < timeStart) {
                    return this.baseService.presentToast('结束日期不能小于起始日期');
                } else {
                    this.timeRangeSelect = {start: timeStart, end: timeEnd};
                }
            } else {
                return this.baseService.presentToast('自定义时间范围，请选择开始日期和结束日期');
            }
        } else if (this.timeRangeSelectTemp === 7) {
            const startTime = currentTime - 7 * 24 * 3600 * 1000;
            this.timeRangeSelect = {start: startTime, end: currentTime};
        } else if (this.timeRangeSelectTemp === 30) {
            const startTime = currentTime - 30 * 24 * 3600 * 1000;
            this.timeRangeSelect = {start: startTime, end: currentTime};
        } else if (this.timeRangeSelectTemp === 90) {
            const startTime = currentTime - 90 * 24 * 3600 * 1000;
            this.timeRangeSelect = {start: startTime, end: currentTime};
        } else if (this.timeRangeSelectTemp === 180) {
            const startTime = currentTime - 180 * 24 * 3600 * 1000;
            this.timeRangeSelect = {start: startTime, end: currentTime};
        }

        this.doOpenDialog();
    }

    doOpenDialog() {
        if (this.riskSelect === undefined && this.termSelect === undefined && this.promiseSelect === undefined && this.fixedSelect === undefined && this.timeRangeSelect === undefined) {
            return this.baseService.presentToast('请至少选择一个筛选条件');
        }

        const dialogRef = this.dialog.open(DialogAlertComponent, {
            minHeight: '300px',
            minWidth: '320px',
            data: {
                typeIn: 'standard',
                title: '筛选条件',
                bankLevel: this.bankLevel,
                bankName: this.bankName,
                risk: this.riskSelect,
                term: this.termSelect,
                promise: this.promiseSelect,
                fixed: this.fixedSelect,
                range: this.timeRangeSelect,
            }
        });
        dialogRef.afterClosed().subscribe(data => {
            console.log('返回的内容是：', data);
            if (data !== undefined && data !== '') {
                return this.router.navigate(['/wealth/' + this.target, {
                    bankLevel: this.bankLevel ? this.bankLevel : '',
                    bankName: this.bankName ? this.bankName : '',
                    risk: this.riskSelect ? this.riskSelect.value : '',
                    term: this.termSelect ? this.termSelect.value : '',
                    promise: this.promiseSelect ? this.promiseSelect.name : '',
                    fixed: this.fixedSelect ? this.fixedSelect.name : '',
                    start: this.timeRangeSelect ? this.timeRangeSelect.start : '',
                    end: this.timeRangeSelect ? this.timeRangeSelect.end : ''
                }]);
            }
        });
    }
}
