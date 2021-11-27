import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TextComponent} from './text.component';
import {TextHomeComponent} from './text-home/text-home.component';
import {TextDetailComponent} from './text-detail/text-detail.component';
import {TextSearchComponent} from './text-search/text-search.component';
import {TextCategoryComponent} from './text-category/text-category.component';


const textRoutes: Routes = [{
  path: '', component: TextComponent,
  children: [
    {path: 'home', component: TextHomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'detail', component: TextDetailComponent},
    {path: 'search', component: TextSearchComponent},
    {path: 'category', component: TextCategoryComponent}
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(textRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TextRoutingModule { }
