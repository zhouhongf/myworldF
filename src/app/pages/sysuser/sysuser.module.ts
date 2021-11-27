import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {SysuserComponent} from './sysuser.component';
import {SysuserHomeComponent} from './sysuser-home/sysuser-home.component';
import {SysuserRoutingModule} from './sysuser-routing.module';
import {SysuserChangephoneComponent} from './sysuser-changephone/sysuser-changephone.component';
import {SysuserChangepasswordComponent} from './sysuser-changepassword/sysuser-changepassword.component';
import {SysuserResetpasswordComponent} from './sysuser-resetpassword/sysuser-resetpassword.component';
import {SysuserSettingsComponent} from './sysuser-settings/sysuser-settings.component';
import {SysuserInfoComponent} from './sysuser-info/sysuser-info.component';
import {SysuserTweetFriendComponent} from './sysuser-tweet-friend/sysuser-tweet-friend.component';
import {SysuserWealthFavorComponent} from './sysuser-wealth-favor/sysuser-wealth-favor.component';
import {SysuserTextFavorComponent} from './sysuser-text-favor/sysuser-text-favor.component';
import {SysuserHrFavorComponent} from './sysuser-hr-favor/sysuser-hr-favor.component';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        SysuserRoutingModule
    ],
    declarations: [
        SysuserComponent,
        SysuserHomeComponent,
        SysuserSettingsComponent,
        SysuserChangephoneComponent,
        SysuserChangepasswordComponent,
        SysuserResetpasswordComponent,
        SysuserInfoComponent,
        SysuserTweetFriendComponent,
        SysuserWealthFavorComponent,
        SysuserTextFavorComponent,
        SysuserHrFavorComponent,
    ]
})
export class SysuserModule {
}
