import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {SearchHomeComponent} from './search-home/search-home.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {SearchHistoryComponent} from './search-history/search-history.component';
import {SearchMainComponent} from './search-main/search-main.component';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        SearchRoutingModule,
    ],
    declarations: [
        SearchComponent,
        SearchHomeComponent,
        SearchMainComponent,
        SearchResultComponent,
        SearchHistoryComponent,
    ]
})
export class SearchModule {
}
