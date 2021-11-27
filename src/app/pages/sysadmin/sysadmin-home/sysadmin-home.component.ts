import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-sysadmin-home',
    templateUrl: './sysadmin-home.component.html',
    styleUrls: ['./sysadmin-home.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class SysadminHomeComponent {

    dataSource = ELEMENT_DATA;
    columnsToDisplay = ['name', 'target', 'status'];
    expandedElement;

    constructor() {
    }
}


const ELEMENT_DATA = [
    {
        name: 'ios应用需要重新修改并提交',
        target: '密码修改的问题',
        status: '存量',
        description: 'baseService文件中addSaltPassword()方法中，原来只保留了密码的前6位，没有保留完整的密码'
    },
    {
        name: 'speechRecognition',
        target: '发送信息，和朋友圈分享，集成',
        status: '新增',
        description: '发送信息，和朋友圈分享，集成。'
    },
    {
        name: 'textToSpeech',
        target: '文章类中文朗读',
        status: '新增',
        description: '文章类中文朗读。'
    }
];
