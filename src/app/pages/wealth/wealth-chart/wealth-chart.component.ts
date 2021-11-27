import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {rateType, riskType, termType} from '../../../models/bank-standard';


@Component({
    selector: 'app-wealth-chart',
    templateUrl: './wealth-chart.component.html',
    styleUrls: ['./wealth-chart.component.scss'],
})
export class WealthChartComponent implements OnInit {

    showChart = false;
    bankLevel: string;
    bankName: string;
    start: string;
    end: string;

    theData;
    chartOption;
    theRiskType = riskType;
    theTermType = termType;
    theRateType = rateType;

    constructor(private baseService: BaseService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.getRouteParams();
    }

    getRouteParams() {
        this.route.paramMap.subscribe(data => {
            this.bankLevel = data.get('bankLevel');
            this.bankName = data.get('bankName');
            this.start = data.get('start');
            this.end = data.get('end');
        });
    }

    goBack() {
        if (this.showChart === true) {
            this.showChart = false;
        } else {
            return this.router.navigate(['/wealth']);
        }
    }

    // 可比较的内容有：risk, term, bank_level, bank_name
    // 比较因素为：理财产品数量
    doBucket(value) {
        const params = {keyword: value};
        if (this.bankLevel) {
            params['bankLevel'] = this.bankLevel;
        }
        if (this.bankName) {
            params['bankName'] = this.bankName;
        }
        if (this.start && this.end) {
            params['start'] = this.start;
            params['end'] = this.end;
        }
        this.baseService.httpGet(APIService.WEALTH.bucketAnalyze, params, data => {
            console.log('返回的内容是：', data);
            if (data.code === 0) {
                this.theData = data.data;
                this.setChartOption(value);
            } else {
                this.baseService.presentToast(data.msg);
            }
        });
    }

    setChartOption(value) {
        const theOptions = {};
        const aAxisData = [];
        const seriesData = [];

        switch (value) {
            case 'risk':
                theOptions['title'] = '风险等级';
                for (const one of this.theData) {
                    const theId = one['_id'];
                    const theContent = one['num'];
                    for (const two of this.theRiskType) {
                        if (theId === two['value']) {
                            aAxisData.push(two['name']);
                            seriesData.push(theContent);
                        }
                    }
                }
                break;
            case 'term':
                theOptions['title'] = '理财期限';
                for (const one of this.theData) {
                    const theId = one['_id'];
                    const theContent = one['num'];
                    for (const two of this.theTermType) {
                        if (theId === two['value']) {
                            aAxisData.push(two['name']);
                            seriesData.push(theContent);
                        }
                    }
                }
                break;
            case 'rate_max':
                theOptions['title'] = '最高收益区间';
                for (const one of this.theData) {
                    const theId = one['_id'];
                    const theContent = one['num'];
                    for (const two of this.theRateType) {
                        if (theId === two['value']) {
                            aAxisData.push(two['name']);
                            seriesData.push(theContent);
                        }
                    }
                }
                break;
            case 'rate_min':
                theOptions['title'] = '最低收益区间';
                for (const one of this.theData) {
                    const theId = one['_id'];
                    const theContent = one['num'];
                    for (const two of this.theRateType) {
                        if (theId === two['value']) {
                            aAxisData.push(two['name']);
                            seriesData.push(theContent);
                        }
                    }
                }
                break;
        }
        theOptions['aAxisData'] = aAxisData;
        theOptions['seriesData'] = seriesData;
        this.doSetOption(theOptions);
    }

    doSetOption(theOptions) {
        this.chartOption = {
            title: {text: theOptions['title']},
            color: ['#3398DB'],
            legend: {data: ['理财产品数量']},

            tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'}}, // 坐标轴指示器，坐标轴触发有效，默认为直线，可选为：'line' | 'shadow'
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: true},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},

            xAxis: [{
                type: 'category',
                data: theOptions['aAxisData'],
                axisTick: {alignWithLabel: true},
                axisLabel: {interval: 0, rotate: 20},
            }],
            yAxis: [{name: '数量', type: 'value'}],

            series: [
                {
                    name: '理财产品数量',
                    type: 'bar',
                    label: {normal: {show: true}},
                    data: theOptions['seriesData'],
                }
            ]
        };
        this.showChart = true;
    }
}
