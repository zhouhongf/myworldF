import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {ChatComponent} from './chat.component';
import {ChatRoutingModule} from './chat-routing.module';
import { ChatContactComponent } from './chat-contact/chat-contact.component';
import { ChatContactAddComponent } from './chat-contact-add/chat-contact-add.component';
import { ChatContactDetailComponent } from './chat-contact-detail/chat-contact-detail.component';
import { ChatContactNewComponent } from './chat-contact-new/chat-contact-new.component';
import {ChatMessagePairComponent} from './chat-message-pair/chat-message-pair.component';
import {ChatHomeComponent} from './chat-home/chat-home.component';
import {ChatListPairComponent} from './chat-list-pair/chat-list-pair.component';
import {ChatListGroupComponent} from './chat-list-group/chat-list-group.component';
import {ChatMessageGroupComponent} from './chat-message-group/chat-message-group.component';
import {ChatTagPairComponent} from './chat-tag-pair/chat-tag-pair.component';
import {ChatTagGroupComponent} from './chat-tag-group/chat-tag-group.component';

@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        ChatRoutingModule,
    ],
    declarations: [
        ChatComponent,
        ChatHomeComponent,
        ChatContactComponent,
        ChatContactAddComponent,
        ChatContactDetailComponent,
        ChatContactNewComponent,
        ChatTagPairComponent,
        ChatTagGroupComponent,
        ChatListPairComponent,
        ChatListGroupComponent,
        ChatMessagePairComponent,
        ChatMessageGroupComponent,
    ]
})
export class ChatModule {
}
