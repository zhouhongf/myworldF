import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {AuthLoginComponent} from './auth-login/auth-login.component';
import {AuthRegisterComponent} from './auth-register/auth-register.component';
import {AuthLoginSmsComponent} from './auth-login-sms/auth-login-sms.component';


const authRoutes: Routes = [{
  path: '', component: AuthComponent,
  children: [
    {path: 'login', component: AuthLoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'register', component: AuthRegisterComponent},
    {path: 'loginSMS', component: AuthLoginSmsComponent}
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
