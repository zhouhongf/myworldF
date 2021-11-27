import { NgModule } from '@angular/core';
import { SysadminComponent } from './sysadmin.component';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import { SysadminHomeComponent } from './sysadmin-home/sysadmin-home.component';
import { SysadminVisitorComponent } from './sysadmin-visitor/sysadmin-visitor.component';
import { SysadminFileComponent } from './sysadmin-file/sysadmin-file.component';
import {SysadminRoutingModule} from './sysadmin-routing.module';
import { SysadminWritingComponent } from './sysadmin-writing/sysadmin-writing.component';
import { SysadminWritingDetailComponent } from './sysadmin-writing-detail/sysadmin-writing-detail.component';
import {SysadminTestComponent} from './sysadmin-test/sysadmin-test.component';
import {SysadminUserComponent} from './sysadmin-user/sysadmin-user.component';
import {SysadminSlideComponent} from './sysadmin-slide/sysadmin-slide.component';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        SysadminRoutingModule
    ],
    declarations: [
        SysadminComponent,
        SysadminHomeComponent,
        SysadminUserComponent,
        SysadminVisitorComponent,
        SysadminFileComponent,
        SysadminSlideComponent,
        SysadminWritingComponent,
        SysadminWritingDetailComponent,
        SysadminTestComponent,
    ]
})
export class SysadminModule { }
