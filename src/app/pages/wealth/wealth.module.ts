import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {WealthRoutingModule} from './wealth-routing.module';
import {WealthComponent} from './wealth.component';
import {WealthHomeComponent} from './wealth-home/wealth-home.component';
import {WealthScaleComponent} from './wealth-scale/wealth-scale.component';
import {WealthCustomComponent} from './wealth-custom/wealth-custom.component';
import {WealthStandardComponent} from './wealth-standard/wealth-standard.component';
import {WealthRankComponent} from './wealth-rank/wealth-rank.component';
import {WealthDetailComponent} from './wealth-detail/wealth-detail.component';
import {WealthChartComponent} from './wealth-chart/wealth-chart.component';
import {WealthSearchComponent} from './wealth-search/wealth-search.component';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        WealthRoutingModule
    ],
    declarations: [
        WealthComponent,
        WealthHomeComponent,
        WealthScaleComponent,
        WealthCustomComponent,
        WealthStandardComponent,
        WealthRankComponent,
        WealthDetailComponent,
        WealthChartComponent,
        WealthSearchComponent,
    ]
})
export class WealthModule {
}
