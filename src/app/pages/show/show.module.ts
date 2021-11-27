import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {ShowRoutingModule} from './show-routing.module';
import {ShowComponent} from './show.component';
import { ShowLiveComponent } from './show-live/show-live.component';
import { ShowBlogComponent } from './show-blog/show-blog.component';
import { ShowBlogMakeComponent } from './show-blog-make/show-blog-make.component';
import { ShowBlogDetailComponent } from './show-blog-detail/show-blog-detail.component';
import {ShowSocialComponent} from './show-social/show-social.component';
import {ShowSocialDetailComponent} from './show-social-detail/show-social-detail.component';
import {ShowSocialMakeComponent} from './show-social-make/show-social-make.component';
import {ShowSocialMineComponent} from './show-social-mine/show-social-mine.component';
import {ShowSocialWatchComponent} from './show-social-watch/show-social-watch.component';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        ShowRoutingModule,
    ],
    declarations: [
        ShowComponent,
        ShowLiveComponent,
        ShowBlogComponent,
        ShowBlogMakeComponent,
        ShowBlogDetailComponent,
        ShowSocialComponent,
        ShowSocialDetailComponent,
        ShowSocialMakeComponent,
        ShowSocialMineComponent,
        ShowSocialWatchComponent
    ]
})
export class ShowModule {
}
