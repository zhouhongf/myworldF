import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import { AuthComponent } from './auth.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthLoginSmsComponent } from './auth-login-sms/auth-login-sms.component';
import {AuthRoutingModule} from './auth-routing.module';

@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        AuthRoutingModule,
    ],
    declarations: [
        AuthComponent,
        AuthLoginComponent,
        AuthRegisterComponent,
        AuthLoginSmsComponent
    ]
})
export class AuthModule { }
