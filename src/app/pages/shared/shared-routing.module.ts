import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedComponent} from './shared.component';
import {SharedHomeComponent} from './shared-home/shared-home.component';


const sharedRoutes: Routes = [{
  path: '', component: SharedComponent,
  children: [
    {path: 'home', component: SharedHomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(sharedRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SharedRoutingModule { }
