import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WealthComponent} from './wealth.component';
import {WealthHomeComponent} from './wealth-home/wealth-home.component';
import {WealthDetailComponent} from './wealth-detail/wealth-detail.component';
import {WealthScaleComponent} from './wealth-scale/wealth-scale.component';
import {WealthStandardComponent} from './wealth-standard/wealth-standard.component';
import {WealthCustomComponent} from './wealth-custom/wealth-custom.component';
import {WealthRankComponent} from './wealth-rank/wealth-rank.component';
import {WealthChartComponent} from './wealth-chart/wealth-chart.component';
import {WealthSearchComponent} from './wealth-search/wealth-search.component';


const wealthRoutes: Routes = [{
  path: '', component: WealthComponent,
  children: [
    {path: 'home', component: WealthHomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'detail', component: WealthDetailComponent},
    {path: 'scale', component: WealthScaleComponent},
    {path: 'standard', component: WealthStandardComponent},
    {path: 'custom', component: WealthCustomComponent},
    {path: 'rank', component: WealthRankComponent},
    {path: 'chart', component: WealthChartComponent},
    {path: 'search', component: WealthSearchComponent},
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(wealthRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WealthRoutingModule { }
