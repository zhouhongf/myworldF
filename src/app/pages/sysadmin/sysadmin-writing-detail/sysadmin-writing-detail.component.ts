import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseService} from '../../../providers/base.service';
import {APIService} from '../../../providers/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {writingTypeData} from '../../../models/system-data';
import {MyquillComponent} from '../../../tool/myquill/myquill.component';


@Component({
    selector: 'app-sysadmin-writing-detail',
    templateUrl: './sysadmin-writing-detail.component.html',
    styleUrls: ['./sysadmin-writing-detail.component.scss']
})
export class SysadminWritingDetailComponent implements OnInit {
    writingTypeData = writingTypeData;
    writingId: string;

    @ViewChild(MyquillComponent, {static: false}) myquillComponent: MyquillComponent;

    writingForm: FormGroup;
    isMobile: boolean;

    constructor(private baseService: BaseService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
        this.isMobile = this.baseService.isMobile();
    }

    ngOnInit() {
        this.createForm();
        this.route.paramMap.subscribe(data => {
            this.writingId = data.get('id');
            if (this.writingId) {
                this.getData();
            }
        });
    }

    getData() {
        this.baseService.httpGet(APIService.SYSADMIN.getWriting, {id: this.writingId}, data => {
            if (data.code === 0) {
                this.resetForm(data.data);
            } else {
                this.baseService.presentToast(data.msg);
            }
        }, true);
    }

    createForm() {
        this.writingForm = this.formBuilder.group({
            id: '',
            title: ['', Validators.required],
            author: ['', Validators.required],
            type: ['', Validators.required],
            content: '',
            canRelease: false
        });
    }

    resetForm(data) {
        this.id.patchValue(data.id);
        this.title.patchValue(data.title);
        this.author.patchValue(data.author);
        this.type.patchValue(data.type);
        this.content.patchValue(data.content);
        this.canRelease.patchValue(data.canRelease);
        this.myquillComponent.initEditorContent(data.content);
    }

    get id() {
        return this.writingForm.get('id');
    }

    get title() {
        return this.writingForm.get('title');
    }

    get author() {
        return this.writingForm.get('author');
    }

    get type() {
        return this.writingForm.get('type');
    }

    get content() {
        return this.writingForm.get('content');
    }

    get canRelease() {
        return this.writingForm.get('canRelease');
    }

    doSave(canRelease) {
        this.content.patchValue(this.myquillComponent.editorContent);
        this.canRelease.patchValue(canRelease);
        this.baseService.httpPost(APIService.SYSADMIN.setWriting, null, this.writingForm.value, data => {
            if (data.code === 0) {
                return this.router.navigate(['/sysadmin/writing']);
            } else {
                this.baseService.presentToast(data.msg);
            }
        }, true);
    }
}
