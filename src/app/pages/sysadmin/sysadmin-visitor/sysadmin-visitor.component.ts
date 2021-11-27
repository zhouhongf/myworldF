import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {APIService} from '../../../providers/api.service';

@Component({
    selector: 'app-sysadmin-visitor',
    templateUrl: './sysadmin-visitor.component.html',
    styleUrls: ['./sysadmin-visitor.component.scss']
})
export class SysadminVisitorComponent implements OnInit {
    isMobile = false;
    showDetail = false;
    elementData;
    selectedData;
    selectedVisitTimeData;

    pageCount = 1;
    pageLength = APIService.pageLength;
    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize;

    constructor(private baseService: BaseService) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        // this.getData();
    }


    getData() {
        const params = {pageSize: this.pageSize, pageIndex: this.pageIndex};
        this.baseService.httpGet(APIService.COMMON.getVisitorList, params, data => {
            if (data.code === 0) {
                if (this.pageIndex === 0) {
                    this.pageLength = data.num;
                    this.pageCount = Math.ceil(this.pageLength / this.pageSize);
                    this.elementData = data.data;
                } else {
                    if (this.isMobile) {
                        this.elementData = this.elementData.concat(data.data);
                    } else {
                        this.elementData = data.data;
                    }

                }
            }
        });
    }

    choose(data) {
        this.selectedData = data;
        this.selectedVisitTimeData = this.selectedData.updateTimeSum.split('+');
        this.showDetail = true;
    }

    doRefresh(event) {
        this.pageIndex = 0;
        this.getData();
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }


    doInfinite(event) {
        const num = this.elementData.length;
        if (num > 0 && num % this.pageSize === 0) {
            this.pageIndex = Math.floor(num / this.pageSize - 1) + 1;
            this.getData();
        }
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }


    doPage() {
        if (this.pageCount > 1) {
            if (this.pageIndex === 0) {
                this.pageIndex += 1;
                this.getData();
            }
        }
    }

    doPageNext() {
        if (this.pageCount > 1) {
            if (this.pageIndex < this.pageCount) {
                this.pageIndex += 1;
                this.getData();
            }
        }
    }

    doPagePrevious() {
        if (this.pageIndex > 0) {
            this.pageIndex -= 1;
            this.getData();
        }
    }
}
