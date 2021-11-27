import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from './search.component';
import {SearchHomeComponent} from './search-home/search-home.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {SearchHistoryComponent} from './search-history/search-history.component';
import {SearchMainComponent} from './search-main/search-main.component';


const searchRoutes: Routes = [{
  path: '', component: SearchComponent,
  children: [
    { path: 'home', component: SearchHomeComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'main', component: SearchMainComponent},
    { path: 'result', component: SearchResultComponent},
    { path: 'history', component: SearchHistoryComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(searchRoutes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
