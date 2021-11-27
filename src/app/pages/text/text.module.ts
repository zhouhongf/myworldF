import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {TextRoutingModule} from './text-routing.module';
import {TextComponent} from './text.component';
import {TextHomeComponent} from './text-home/text-home.component';
import {TextDetailComponent} from './text-detail/text-detail.component';
import {TextSearchComponent} from './text-search/text-search.component';
import {TextCategoryComponent} from './text-category/text-category.component';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        TextRoutingModule
    ],
    declarations: [
        TextComponent,
        TextHomeComponent,
        TextDetailComponent,
        TextSearchComponent,
        TextCategoryComponent,
    ]
})
export class TextModule {
}
