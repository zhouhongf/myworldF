import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BankComponent} from './bank.component';
import {BankHomeComponent} from './bank-home/bank-home.component';
import {BankMapComponent} from './bank-map/bank-map.component';
import {BankBlogComponent} from './bank-blog/bank-blog.component';
import {BankWorkComponent} from './bank-work/bank-work.component';
import {BankHrComponent} from './bank-hr/bank-hr.component';
import {BankTextComponent} from './bank-text/bank-text.component';
import {BankHrDetailComponent} from './bank-hr-detail/bank-hr-detail.component';


const bankRoutes: Routes = [{
    path: '', component: BankComponent,
    children: [
        {path: 'home', component: BankHomeComponent},
        {path: '', redirectTo: 'home', pathMatch: 'full'},
        {path: 'map', component: BankMapComponent},
        {path: 'blog', component: BankBlogComponent},
        {path: 'work', component: BankWorkComponent},
        {path: 'text', component: BankTextComponent},
        {path: 'hr', component: BankHrComponent},
        {path: 'hrDetail', component: BankHrDetailComponent},
    ]
}];

@NgModule({
    imports: [
        RouterModule.forChild(bankRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class BankRoutingModule {
}
