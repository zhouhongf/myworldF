import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat.component';
import {ChatContactComponent} from './chat-contact/chat-contact.component';
import {ChatContactAddComponent} from './chat-contact-add/chat-contact-add.component';
import {ChatContactDetailComponent} from './chat-contact-detail/chat-contact-detail.component';
import {ChatContactNewComponent} from './chat-contact-new/chat-contact-new.component';
import {ChatMessagePairComponent} from './chat-message-pair/chat-message-pair.component';
import {ChatHomeComponent} from './chat-home/chat-home.component';
import {ChatMessageGroupComponent} from './chat-message-group/chat-message-group.component';
import {ChatListPairComponent} from './chat-list-pair/chat-list-pair.component';
import {ChatListGroupComponent} from './chat-list-group/chat-list-group.component';
import {ChatTagPairComponent} from './chat-tag-pair/chat-tag-pair.component';
import {ChatTagGroupComponent} from './chat-tag-group/chat-tag-group.component';

const chatRoutes: Routes = [{
  path: '', component: ChatComponent,
  children: [
    {path: 'home', component: ChatHomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'contact', component: ChatContactComponent},
    {path: 'contactAdd', component: ChatContactAddComponent},
    {path: 'contactDetail', component: ChatContactDetailComponent},
    {path: 'contactNew', component: ChatContactNewComponent},
    {path: 'tagPair', component: ChatTagPairComponent},
    {path: 'tagGroup', component: ChatTagGroupComponent},
    {path: 'listPair', component: ChatListPairComponent},
    {path: 'listGroup', component: ChatListGroupComponent},
    {path: 'messagePair', component: ChatMessagePairComponent},
    {path: 'messageGroup', component: ChatMessageGroupComponent},
  ]
}];


@NgModule({
  imports: [
    RouterModule.forChild(chatRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChatRoutingModule { }
