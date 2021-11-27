import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as highlight from 'highlight.js';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-fix-for-mobile';
import 'quill-mention';

import { QuillEditorComponent } from 'ngx-quill';
import {NativeService} from '../../providers/native.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {APIService} from '../../providers/api.service';
import {PreviewimgService} from '../../providers/previewimg.service';

Quill.register('modules/imageResize', ImageResize);

const katex = require('katex');
const win: any = window;
win.katex = katex;
win.hljs = highlight;

@Component({
    selector: 'app-myquill',
    templateUrl: './myquill.component.html',
    styleUrls: ['./myquill.component.scss']
})
export class MyquillComponent implements OnInit {
    editorUpload;

    editorContent;
    modules = {};

    buttonWidth = '50px';
    @ViewChild(QuillEditorComponent, {static: false}) editor: QuillEditorComponent;

    deviceType = localStorage.getItem(APIService.SAVE_LOCAL.deviceType);

    constructor(private http: HttpClient, private nativeService: NativeService, private previewimgService: PreviewimgService, private camera: Camera) {
    }

    ngOnInit() {
        this.initEditor();
    }

    initEditorContent(value?: string) {
        this.editorContent = value;
    }

    initEditor() {
        this.modules = {
            formula: true,      // 公式；需要加载katex.min.js
            syntax: {highlight: text => hljs.highlightAuto(text).value},
            // syntax: true,       高亮；需要加载highlight.min.js
            imageResize: {},
            // toolbar: [
            //    ['bold', 'italic', 'underline', 'strike'],
            //    ['blockquote', 'code-block'],

            //    [{'header': 1}, {'header': 2}],
            //    [{'list': 'ordered'}, {'list': 'bullet'}],
            //    [{'script': 'sub'}, {'script': 'super'}],
            //    [{'indent': '-1'}, {'indent': '+1'}],
            //    [{'direction': 'rtl'}],

            //    [{'size': ['small', false, 'large', 'huge']}],
            //    [{'header': [1, 2, 3, 4, 5, 6, false]}],

            //    [{'color': []}, {'background': []}],
            //    [{'font': []}],
            //    [{'align': []}],

            //    ['clean'],

            //    ['formula', 'link', 'image', 'video']
            // ]
            mention: {
                allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                onSelect: (item, insertItem) => {
                    const editor = this.editor.quillEditor as Quill;
                    insertItem(item);
                    // necessary because quill-mention triggers changes as 'api' instead of 'user'
                    editor.insertText(editor.getLength() - 1, '', 'user');
                },
                source: (searchTerm, renderList) => {
                    const values = [
                        { id: 1, value: 'Fredrik Sundqvist' },
                        { id: 2, value: 'Patrik Sjölin' },
                    ];

                    if (searchTerm.length === 0) {
                        renderList(values, searchTerm);
                    } else {
                        const matches = [];

                        values.forEach((entry) => {
                            if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                                matches.push(entry);
                            }
                        });
                        renderList(matches, searchTerm);
                    }
                }
            },
        };
    }


    // 添加 按键绑定事件， shift+B 即绑定console.log输出
    addBindingCreated(quill) {
        quill.keyboard.addBinding({
            key: 'B',
            shiftKey: true
        }, (range, context) => {
            // tslint:disable-next-line:no-console
            console.log('KEYBINDING SHIFT + B', range, context);
        });
        this.addImageUploadCreated(quill);
    }


    // 修改 插入图片按钮 将base64图片 改为 直接上传图片
    addImageUploadCreated(quill) {
        this.editorUpload = quill;
        const toolbar = quill.getModule('toolbar');
        if (this.deviceType === 'MOBILE') {
            toolbar.addHandler('image', this.imageHandlerBase64Mobile.bind(this));
        } else {
            toolbar.addHandler('image', this.imageHandlerBase64.bind(this));
        }

    }

    imageHandlerBase64() {
        const Imageinput = document.createElement('input');
        Imageinput.setAttribute('type', 'file');
        Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        Imageinput.classList.add('ql-image');
        Imageinput.addEventListener('change', () => {
            const file: File = Imageinput.files[0];

            // 直接将file读取成base64图片
            // const reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.onload = (e) => {
            //     const base64 = e.target['result'];
            //     const range = this.editorUpload.getSelection(true);
            //     const index = range.index + range.length;
            //     this.editorUpload.insertEmbed(range.index, 'image', base64);
            // };

            this.previewimgService.readAsDataUrlWithCompress(file, 800).then(data => {
                const base64 = data;
                const range = this.editorUpload.getSelection(true);
                const index = range.index + range.length;
                this.editorUpload.insertEmbed(range.index, 'image', base64);
            });
        });
        Imageinput.click();
    }

    imageHandlerBase64Mobile() {
        const options: CameraOptions = {
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            targetWidth: 800,
            targetHeight: 600,
        };
        this.nativeService.getPicture(options).subscribe(data => {
            const base64 = data;
            const range = this.editorUpload.getSelection(true);
            const index = range.index + range.length;
            this.editorUpload.insertEmbed(range.index, 'image', base64);
        });
    }

    // 直接上传文件
    imageHandlerUpload() {
        const Imageinput = document.createElement('input');
        Imageinput.setAttribute('type', 'file');
        Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        Imageinput.classList.add('ql-image');
        Imageinput.addEventListener('change', () => {
            const file = Imageinput.files[0];

            const data: FormData = new FormData();
            data.append('file', file, file.name);
            const header = new HttpHeaders();
            header.append('Accept', 'application/json');

            if (Imageinput.files != null && Imageinput.files[0] != null) {
                this.http.post('http://xxxx/upload', data, {headers: header})
                    .subscribe(res => {
                        const range = this.editorUpload.getSelection(true);
                        const index = range.index + range.length;
                        this.editorUpload.insertEmbed(range.index, 'image', 'http://' + res);
                    });
            }
        });
        Imageinput.click();
    }
}
