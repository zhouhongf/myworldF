import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowComponent} from './show.component';
import {ShowLiveComponent} from './show-live/show-live.component';
import {ShowBlogComponent} from './show-blog/show-blog.component';
import {ShowBlogMakeComponent} from './show-blog-make/show-blog-make.component';
import {ShowBlogDetailComponent} from './show-blog-detail/show-blog-detail.component';
import {ShowSocialComponent} from './show-social/show-social.component';
import {ShowSocialDetailComponent} from './show-social-detail/show-social-detail.component';
import {ShowSocialMakeComponent} from './show-social-make/show-social-make.component';
import {ShowSocialMineComponent} from './show-social-mine/show-social-mine.component';
import {ShowSocialWatchComponent} from './show-social-watch/show-social-watch.component';


const showRoutes: Routes = [{
  path: '', component: ShowComponent,
  children: [
    {path: 'social', component: ShowSocialComponent},
    {path: '', redirectTo: 'social', pathMatch: 'full'},
    {path: 'socialDetail', component: ShowSocialDetailComponent},
    {path: 'socialMake', component: ShowSocialMakeComponent},
    {path: 'socialMine', component: ShowSocialMineComponent},
    {path: 'socialWatch', component: ShowSocialWatchComponent},
    {path: 'live', component: ShowLiveComponent},
    {path: 'blog', component: ShowBlogComponent},
    {path: 'blogMake', component: ShowBlogMakeComponent},
    {path: 'blogDetail', component: ShowBlogDetailComponent}
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(showRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ShowRoutingModule { }
