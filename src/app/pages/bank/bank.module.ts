import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {BankRoutingModule} from './bank-routing.module';
import {BankComponent} from './bank.component';
import {BankHomeComponent} from './bank-home/bank-home.component';
import {BankMapComponent} from './bank-map/bank-map.component';
import {BankBlogComponent} from './bank-blog/bank-blog.component';
import {BankWorkComponent} from './bank-work/bank-work.component';
import {BankHrComponent} from './bank-hr/bank-hr.component';
import {BankTextComponent} from './bank-text/bank-text.component';
import {BankHrDetailComponent} from './bank-hr-detail/bank-hr-detail.component';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        BankRoutingModule,
    ],
    declarations: [
        BankComponent,
        BankHomeComponent,
        BankMapComponent,
        BankBlogComponent,
        BankWorkComponent,
        BankHrComponent,
        BankHrDetailComponent,
        BankTextComponent,
    ]
})
export class BankModule {
}
