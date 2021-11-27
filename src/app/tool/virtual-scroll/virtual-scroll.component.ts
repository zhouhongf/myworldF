import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
})
export class VirtualScrollComponent implements OnInit {

  items = [
    {id: '1', keyword: '工商1', searchTime: 1580832000000},
    {id: '1', keyword: '工商2', searchTime: 1580832000000},
    {id: '1', keyword: '工商3', searchTime: 1580832000000},
    {id: '1', keyword: '工商4', searchTime: 1580659201000},
    {id: '1', keyword: '工商5', searchTime: 1580659200100},
    {id: '1', keyword: '工商6', searchTime: 1580659200010},
    {id: '1', keyword: '工商7', searchTime: 1580575600000},
    {id: '1', keyword: '工商8', searchTime: 1580572830000},
    {id: '1', keyword: '工商9', searchTime: 1580572820000},
    {id: '1', keyword: '工商10', searchTime: 1580572810000},
    {id: '1', keyword: '工商11', searchTime: 1580572800000},
    {id: '1', keyword: '工商12', searchTime: 1580568000000},
    {id: '1', keyword: '工商13', searchTime: 1580567000000},
    {id: '1', keyword: '工商14', searchTime: 1580500000000},
    {id: '1', keyword: '工商15', searchTime: 1580575600000},
    {id: '1', keyword: '工商16', searchTime: 1580572830000},
    {id: '1', keyword: '工商17', searchTime: 1580572820000},
    {id: '1', keyword: '工商18', searchTime: 1580572810000},
    {id: '1', keyword: '工商19', searchTime: 1580572800000},
    {id: '1', keyword: '工商20', searchTime: 1580568000000},
    {id: '1', keyword: '工商21', searchTime: 1580567000000},
    {id: '1', keyword: '工商22', searchTime: 1580500000000},
    {id: '1', keyword: '工商23', searchTime: 1580572820000},
    {id: '1', keyword: '工商24', searchTime: 1580572810000},
    {id: '1', keyword: '工商25', searchTime: 1580572800000},
    {id: '1', keyword: '工商26', searchTime: 1580568000000},
    {id: '1', keyword: '工商27', searchTime: 1580567000000},
    {id: '1', keyword: '工商28', searchTime: 1580500000000},
    {id: '1', keyword: '工商29', searchTime: 1580575600000},
    {id: '1', keyword: '工商30', searchTime: 1580572830000},
    {id: '1', keyword: '工商31', searchTime: 1580572820000},
    {id: '1', keyword: '工商32', searchTime: 1580572810000},
    {id: '1', keyword: '工商33', searchTime: 1580572800000},
    {id: '1', keyword: '工商34', searchTime: 1580568000000},
    {id: '1', keyword: '工商35', searchTime: 1580567000000},
    {id: '1', keyword: '工商36', searchTime: 1580500000000},
  ];

  @Input() dataIn: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() dataOut = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }


  // 按照时间是否在同一天，进行划分header
  myHeaderFn(record, recordIndex, records) {
    if (recordIndex > 1) {
      const searchTimeCurrent = record.searchTime;
      const searchTimePrevious = records[recordIndex - 1].searchTime;

      const searchTimeCurrentDate = new Date(searchTimeCurrent).toLocaleDateString();
      const searchTimePreviousDate = new Date(searchTimePrevious).toLocaleDateString();

      if (searchTimeCurrentDate !== searchTimePreviousDate) {
        return searchTimeCurrentDate;
      }
      return null;
    }

  }

}
