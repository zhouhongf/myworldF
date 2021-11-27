import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysadminComponent} from './sysadmin.component';
import {SysadminHomeComponent} from './sysadmin-home/sysadmin-home.component';
import {SysadminFileComponent} from './sysadmin-file/sysadmin-file.component';
import {SysadminVisitorComponent} from './sysadmin-visitor/sysadmin-visitor.component';
import {SysadminWritingComponent} from './sysadmin-writing/sysadmin-writing.component';
import {SysadminWritingDetailComponent} from './sysadmin-writing-detail/sysadmin-writing-detail.component';
import {SysadminTestComponent} from './sysadmin-test/sysadmin-test.component';
import {AuthGuard} from '../../utils/guards/auth.guard';
import {SysadminUserComponent} from './sysadmin-user/sysadmin-user.component';
import {SysadminSlideComponent} from './sysadmin-slide/sysadmin-slide.component';

// 其实用不着这么多AuthSysadminGuard，此处只是展示可以放的位置，所以两个都放了
// 实际可以根据不同的访问权限，在不同的位置放置不同的AuthGuard

const sysadminRoutes: Routes = [{
    path: '', component: SysadminComponent,
    children: [
        {
            path: '', canActivateChild: [AuthGuard],
            children: [
                {path: 'home', component: SysadminHomeComponent},
                {path: '', redirectTo: 'home', pathMatch: 'full'},
                {path: 'user', component: SysadminUserComponent},
                {path: 'writing', component: SysadminWritingComponent},
                {path: 'writingDetail', component: SysadminWritingDetailComponent},
                {path: 'file', component: SysadminFileComponent},
                {path: 'slide', component: SysadminSlideComponent},
                {path: 'visitor', component: SysadminVisitorComponent},
                {path: 'test', component: SysadminTestComponent},
            ]
        }
    ]
}];


@NgModule({
    imports: [
        RouterModule.forChild(sysadminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SysadminRoutingModule { }
