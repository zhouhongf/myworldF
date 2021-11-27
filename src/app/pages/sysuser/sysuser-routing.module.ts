import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysuserComponent} from './sysuser.component';
import {SysuserHomeComponent} from './sysuser-home/sysuser-home.component';
import {SysuserChangephoneComponent} from './sysuser-changephone/sysuser-changephone.component';
import {SysuserChangepasswordComponent} from './sysuser-changepassword/sysuser-changepassword.component';
import {SysuserResetpasswordComponent} from './sysuser-resetpassword/sysuser-resetpassword.component';
import {SysuserSettingsComponent} from './sysuser-settings/sysuser-settings.component';
import {AuthGuard} from '../../utils/guards/auth.guard';
import {SysuserInfoComponent} from './sysuser-info/sysuser-info.component';
import {SysuserTweetFriendComponent} from './sysuser-tweet-friend/sysuser-tweet-friend.component';
import {SysuserWealthFavorComponent} from './sysuser-wealth-favor/sysuser-wealth-favor.component';
import {SysuserTextFavorComponent} from './sysuser-text-favor/sysuser-text-favor.component';
import {SysuserHrFavorComponent} from './sysuser-hr-favor/sysuser-hr-favor.component';


const sysuserRoutes: Routes = [{
    path: '', component: SysuserComponent,
    children: [
        {
            path: '', canActivateChild: [AuthGuard],
            children: [
                {path: 'home', component: SysuserHomeComponent},
                {path: '', redirectTo: 'home', pathMatch: 'full'},
                {path: 'settings', component: SysuserSettingsComponent},
                {path: 'changephone', component: SysuserChangephoneComponent},
                {path: 'changepassword', component: SysuserChangepasswordComponent},
                {path: 'resetpassword', component: SysuserResetpasswordComponent},
                {path: 'info', component: SysuserInfoComponent},
                {path: 'tweetFriend', component: SysuserTweetFriendComponent},
                {path: 'wealthFavor', component: SysuserWealthFavorComponent},
                {path: 'textFavor', component: SysuserTextFavorComponent},
                {path: 'hrFavor', component: SysuserHrFavorComponent}
            ]
        }
    ]
}];

@NgModule({
    imports: [
        RouterModule.forChild(sysuserRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SysuserRoutingModule { }
