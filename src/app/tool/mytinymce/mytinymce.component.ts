import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {APIService} from '../../providers/api.service';

declare let tinymce: any;

@Component({
  selector: 'app-mytinymce',
  templateUrl: './mytinymce.component.html',
  styleUrls: ['./mytinymce.component.scss']
})
export class MytinymceComponent implements OnDestroy {
  uploadUrl = APIService.domain + APIService.FILEAPI.adminUploadTinymce;
  theDomain = APIService.domain;

  // 用来上传图片到数据库，定向图片到相关的文章所用
  @Input() usageIdDetail: string;
  @Input() fileUsage: string;

  // tingmce编辑器初始化需要
  @Input() elementId: string;
  @Output() onEditorKeyup = new EventEmitter();

  editor;

  constructor() {
  }

  initializeEditor(value?: string) {
    tinymce.init({
      selector: '#' + this.elementId,
      branding: false,
      theme: 'silver',
      mobile: {
        theme: 'mobile',
        plugins: 'autosave lists autolink',
        toolbar: 'undo redo bold italic underline link unlink image bullist numlist fontsizeselect forecolor removeformat'
      },
      plugins: ['autosave autolink table advlist lists link autoresize textpattern fullpage paste wordcount preview image imagetools code searchreplace'],
      toolbar: ['restoredraft code searchreplace undo redo link |  fontselect fontsizeselect | bold italic underline strikethrough forecolor backcolor table removeformat | alignleft aligncenter alignright alignjustify numlist bullist  outdent indent |  image rotateleft rotateright flipv fliph editimage imageoptions | fullpage preview'],
      menubar: false,
      min_height: 600,
      language: 'zh_CN',

      images_upload_url: this.uploadUrl + this.fileUsage + this.usageIdDetail,
      images_upload_base_path: this.theDomain,
      images_reuse_filename: true,
      images_upload_credentials: true,

      font_formats: '宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
      convert_urls: false,

      custom_undo_redo_levels: 20,
      autosave_interval: '60',
      autosave_retention: '30m',

      code_dialog_height: 600,
      code_dialog_width: 600,

      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
        editor.on('init', () => {
          if (value) {
            tinymce.get(this.elementId).setContent(value);
          }
        });
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

}
