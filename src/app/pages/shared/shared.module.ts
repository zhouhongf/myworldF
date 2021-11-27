import { NgModule } from '@angular/core';
import { SharedComponent } from './shared.component';
import { SharedHomeComponent } from './shared-home/shared-home.component';
import { IonicModule } from '@ionic/angular';
import { ToolModule } from '../../tool/tool.module';
import { SharedRoutingModule } from './shared-routing.module';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        SharedRoutingModule
    ],
    declarations: [
        SharedComponent,
        SharedHomeComponent
    ]
})
export class SharedModule { }
