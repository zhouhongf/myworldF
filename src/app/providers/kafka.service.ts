import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {IFrame, IMessage} from '@stomp/stompjs';
import {InjectableRxStompConfig, RxStompService} from '@stomp/ng2-stompjs';
import {HttpClient} from '@angular/common/http';
import {RxStompState} from '@stomp/rx-stomp';
import {PreviewimgService} from './previewimg.service';
import {APIService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class KafkaService {
  socketUser = 'SOCKETUSER';    // 默认名称
  socketUrl = APIService.socketUrl;

  sendNameUrl = '/app/sendChatpair';
  sendGroupUrl = '/app/sendChatgroup';
  sendBinaryUrl = '/app/sendBinary';

  rxStompService: RxStompService;
  messageBroadcast: Observable<any>;
  messageGroup: Observable<any>;
  messageName: Observable<any>;

  constructor(private http: HttpClient, private previewimgService: PreviewimgService) {
  }

  makeHttpSession() {
    this.http.get(APIService.chatSession).subscribe(data => {
      if (data['code'] === 0) {
        console.log('KAFKA成功makeHttpSession');
      } else {
        console.log(data['msg']);
      }
    });
  }

  connect(login: string = this.socketUser, passcode: string = this.socketUser, socketUrl: string = this.socketUrl) {
    const rxStompConfig: InjectableRxStompConfig = {
      brokerURL: socketUrl,
      connectHeaders: {login, passcode},
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(new Date(), str);
      }
    };
    this.rxStompService = new RxStompService();
    this.rxStompService.configure(rxStompConfig);
    this.rxStompService.activate();
  }

  disconnect() {
    return this.rxStompService.deactivate();
  }

  // 模拟强制断开，simulate error
  forceDisconnect() {
    return this.rxStompService.stompClient.forceDisconnect();
  }

  state(): BehaviorSubject<RxStompState> {
    return this.rxStompService.connectionState$;
  }

  unhandledMessage(): Subject<IMessage> {
    return this.rxStompService.unhandledMessage$;
  }

  stompError(): Subject<IFrame> {
    return this.rxStompService.stompErrors$;
  }

  unhandledReceipts(): Subject<IFrame> {
    return this.rxStompService.unhandledReceipts$;
  }


  subscribeBroadcast() {
    this.messageBroadcast = this.rxStompService.watch('/app/chatall');
    return this.messageBroadcast;
  }

  sendName(chatMessage: string, sendUrl: string = this.sendNameUrl) {
    this.rxStompService.publish({destination: sendUrl, body: chatMessage});
  }

  subscribeName(friendWid: string) {
    const destinationUrl = '/user/queue/name/' + friendWid;
    this.messageName = this.rxStompService.watch(destinationUrl);
    return this.messageName;
  }

  sendGroup(chatMessage: string, sendUrl: string = this.sendGroupUrl) {
    this.rxStompService.publish({destination: sendUrl, body: chatMessage});
  }

  subscribeGroup(groupId: string) {
    const destinationUrl = '/user/group/name/' + groupId;
    this.messageGroup = this.rxStompService.watch(destinationUrl);
    return this.messageGroup;
  }

  sendBinary(chatMessage: string, file: File, type?: string, sendUrl?: string) {
    const theSendUrl = sendUrl ? sendUrl : this.sendBinaryUrl;
    this.previewimgService.readAsDataUrl(file).then(value => {
      // 先使用FileReader将file转成base64，再通过window.atob()将base64解码
      const theValue = value.toString().replace('data:application/octet-stream;base64,', '');
      const bytes = window.atob(theValue);
      let n = bytes.length;
      const binaryData = new Uint8Array(n);
      while (n--) {
        binaryData[n] = bytes.charCodeAt(n);   // 将编码转换成Unicode编码
      }
      this.rxStompService.publish({
        destination: theSendUrl,
        body: chatMessage,
        binaryBody: binaryData,
        headers: {'content-type': 'application/octet-stream'}
      });
    });
  }


}
