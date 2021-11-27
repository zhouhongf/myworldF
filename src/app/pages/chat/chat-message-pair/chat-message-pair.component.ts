import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonContent} from '@ionic/angular';
import {APIService} from '../../../providers/api.service';
import {KafkaService} from '../../../providers/kafka.service';
import {BaseService} from '../../../providers/base.service';
import {NativeService} from '../../../providers/native.service';
import {PreviewimgService} from '../../../providers/previewimg.service';
import {HttpClient} from '@angular/common/http';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {RxStompState} from '@stomp/rx-stomp';
import {ChatMessage} from '../../../models/system-data';
import {saveAs} from 'file-saver';
import {Storage} from '@ionic/storage';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Vibration} from '@ionic-native/vibration/ngx';
import {NativeAudio} from '@ionic-native/native-audio/ngx';
import {TextToSpeech} from '@ionic-native/text-to-speech/ngx';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';


@Component({
    selector: 'app-chat-message-pair',
    templateUrl: './chat-message-pair.component.html',
    styleUrls: ['./chat-message-pair.component.scss'],
})
export class ChatMessagePairComponent implements OnInit, OnDestroy {
    navigationSubscription;
    isMobile;
    @ViewChild(IonContent, {static: false}) content: IonContent;
    keyboardHeight = '0px';

    textType = APIService.MESSAGE_TYPE.text;
    fileType = APIService.MESSAGE_TYPE.file;
    photoType = APIService.MESSAGE_TYPE.photo;

    userWid;
    userAvatar;
    currentFriend;
    friendWid;
    friendAvatar;

    state = 'CLOSED';
    messageContent;                                      // 在输入框输入的消息内容
    messageIdPrefix: string;
    storageKey: string;
    messages = new Array<ChatMessage>();                 // 页面显示的所有的聊天记录
    pageSize = 10;
    pageIndex = 0;

    // 收到消息 声音通知
    onSuccess: any;
    onError: any;
    soundIndex = 1;

    constructor(
        private kafkaService: KafkaService,
        private baseService: BaseService,
        private storage: Storage,
        private nativeService: NativeService,
        private previewimgService: PreviewimgService,
        private http: HttpClient,
        private elementRef: ElementRef,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private route: ActivatedRoute,
        private router: Router,
        private localNotifications: LocalNotifications,
        private vibration: Vibration,
        private nativeAudio: NativeAudio,
        private tts: TextToSpeech,
        private speechRecognition: SpeechRecognition
    ) {
        this.nativeAudio.preloadSimple('uniqueId1', 'assets/sounds/bubble.mp3').then(this.onSuccess, this.onError);
    }

    ngOnInit() {
        this.initOnce();
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/chat/messagePair') {
                    this.initEveryTime();
                }
            }
        });
    }

    notice(messageContent: string) {
        // this.vibration.vibrate(1000);
        this.nativeAudio.play('uniqueId1').then(this.onSuccess, this.onError);
        this.localNotifications.schedule({
            id: this.soundIndex,                                //  将来清除，取消，更新或检索本地通知所需的唯一标识符默认值：0
            title: '消息通知',
            text: messageContent,
            trigger: {at: new Date(new Date().getTime())},      // 何时触发通知
            // 声音设置了无效
            sound: null,                                        // 显示警报时包含播放声音的文件的Uri默认值：res：// platform_default
            launch: true,
            lockscreen: true                                    // 仅限ANDROID如果设置为true，则通知将在所有锁定屏幕上完整显示。如果设置为false，则不会在安全锁屏上显示。
        });
        this.soundIndex++;
    }


    initOnce() {
        // this.listenKeyboard();
        this.isMobile = this.baseService.isMobile();
        // 获取当前用户的头像和wid
        this.userWid = this.baseService.getWidLocal();
        this.userAvatar = localStorage.getItem(APIService.SAVE_LOCAL.userAvatar);
        // messageId格式如：ABC123456789-PAIR-TEXT-1580097514642
        this.messageIdPrefix = this.userWid + '-' + APIService.MESSAGE_TYPE.chatPair + '-';
    }

    initEveryTime() {
        this.messages = new Array<ChatMessage>();

        // 获取当前的聊天对象，头像和wid, 并制作storageKey
        this.currentFriend = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.currentFriendTemp));
        this.friendAvatar = this.currentFriend.avatar;
        this.friendWid = this.currentFriend.wid;
        this.storageKey = APIService.MESSAGE_TYPE.chatPair + '-' + this.friendWid;

        // websocket链接
        if (this.state !== 'CLOSED') {
            this.kafkaService.disconnect();
        }
        this.connect();

        // 通过storageKey从本地获取最近的30条聊天记录
        this.storage.get(this.storageKey).then(theData => {
            if (theData) {
                // 从末尾开始取最后30条记录
                const lastStartNumber = 0 - this.pageSize;
                this.messages = theData.slice(lastStartNumber);
                // 下滑至页面底部，即显示最新的一条聊天记录
                this.onFocus();
            }
        });
    }

    getHistoryChatMessagesRemote() {
        const params = {pageSize: this.pageSize, startNumber: this.messages.length, friendWid: this.friendWid};
        this.baseService.httpGet(APIService.CHAT.getChatMessagesPair, params, data => {
            if (data.code === 0) {
                const values: Array<ChatMessage> = data.data;
                for (const one of values) {
                    this.messages.unshift(one);
                }
                console.log('从服务器获取的数据是：', this.messages);
                this.storage.get(this.storageKey).then(theData => {
                    let dataArray = [];
                    if (theData) {
                        dataArray = theData;
                    }
                    for (const one of values) {
                        dataArray.unshift(one);
                    }
                    this.storage.set(this.storageKey, dataArray);
                }, err => {
                    console.log('未能获取:', err);
                });
            } else {
                this.baseService.presentToast(data.msg);
            }
        });
    }

    // 下拉屏幕添加历史聊天记录
    doRefresh(event) {
        this.storage.get(this.storageKey).then(theData => {
           if (theData) {
               // 如果本地有聊天记录储存，并且本次会话的聊天记录条数小于本地储存的聊天记录条数，则从本地聊天记录中读取
               // 否则，从服务器上读取聊天记录
               if (this.messages.length < theData.length) {
                   const totalNumberNeed = this.messages.length + this.pageSize * (this.pageIndex + 1);
                   const lastStartNumber = 0 - totalNumberNeed;
                   this.messages = theData.slice(lastStartNumber);
                   this.pageIndex = this.pageIndex + 1;
                   // 按照时间先后排序
                   // this.messages.sort((a, b) => {
                   //     return b.sendTime - a.sendTime;
                   // });
               } else {
                   this.getHistoryChatMessagesRemote();
               }
           } else {
               this.getHistoryChatMessagesRemote();
           }
        });

        setTimeout(() => {
            event.target.complete();
        }, 400);
    }

    scrollToTop(lastLeaveTime) {
        const el = this.elementRef.nativeElement.querySelector('p#' + lastLeaveTime);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView(true);
            });
        }
    }

    ngOnDestroy() {
        // window.removeEventListener('keyboardWillShow', evt => {});
        // window.removeEventListener('keyboardWillHide', evt => {});
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
        this.kafkaService.disconnect();
    }

    onFocus() {
        setTimeout(() => {
            this.content.scrollToBottom();
        }, 400);
    }

    listenKeyboard() {
        window.addEventListener('keyboardWillShow', event => {
            const height = event['keyboardHeight'];
            const newHeight = Number(height) + 50;
            this.keyboardHeight = newHeight + 'px';
        });
        window.addEventListener('keyboardWillHide', () => {
            this.keyboardHeight = '0px';
        });
    }

    connect() {
        this.kafkaService.connect(this.userWid);
        this.kafkaService.state().subscribe((state: RxStompState) => {
            this.state = RxStompState[state];
            console.log('连接状态：', this.state);
        });
        this.subscribeName();
    }

    // 将收到和发送的消息保存到本地储存，收到一条保存一条，发送一条保存一条
    updateLocalData(chatMessage: ChatMessage) {
        this.storage.get(this.storageKey).then(theData => {
            let dataArray = [];
            if (theData) {
                dataArray = theData;
            }
            dataArray.push(chatMessage);
            this.storage.set(this.storageKey, dataArray);
        });
    }

    subscribeName() {
        this.kafkaService.subscribeName(this.friendWid).subscribe(data => {
            const value = JSON.parse(data.body);
            if (!value.link) {
                value.link = undefined;
            }
            const chatMessage = new ChatMessage(value.fromName, value.toName, value.content, value.type, value.sendTime, value.id, value.link);
            this.messages.push(chatMessage);
            this.updateLocalData(chatMessage);
            this.onFocus();
            console.log('已收到消息：', chatMessage);
            if (this.isMobile) {
                 this.notice(chatMessage.content);
            }

            const currentTime = new Date().getTime().toString();
            data.ack({messageId: value.id, ackTime: currentTime, sender: value.fromName});
        });
    }

    doSendMessage(chatMessage: ChatMessage) {
        this.messages.push(chatMessage);
        this.kafkaService.sendName(JSON.stringify(chatMessage));
        this.updateLocalData(chatMessage);
        this.onFocus();
    }

    sendMsg() {
        if (this.messageContent) {
            const sendTime = new Date().getTime();
            const messageId = this.messageIdPrefix + this.textType + '-' + sendTime;
            const chatMessage = new ChatMessage(this.userWid, this.currentFriend.wid, this.messageContent, this.textType, sendTime, messageId);
            this.doSendMessage(chatMessage);
            console.log('已发送消息：', chatMessage);
            this.messageContent = undefined;
        }
    }

    sendFile() {
        if (this.isMobile) {
            this.openFileMobile();
        } else {
            this.openFileBrowse();
        }
    }

    openFileBrowse() {
        console.log('打开浏览器选择文件');
        const inputObj = document.createElement('input');
        // 设置属性
        inputObj.setAttribute('id', '_ef');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('style', 'visibility:hidden');
        // inputObj.setAttribute('accept', 'image/jpeg,image/png,application/pdf,text/plain');
        // inputObj.setAttribute('directory', '');
        // 添加到DOM中
        document.body.appendChild(inputObj);
        // 添加事件监听器
        inputObj.addEventListener('change', event => {
            const files = event.target['files'];
            console.log('文件是：', files);
            if (files.length > 1) {
                this.baseService.presentToast('一次只能发送一张照片');
            } else {
                // const path = event['path'][0];
                // const filePath = path['value'];
                // console.log('文件路径是：', filePath);
                const file = files[0];
                const fileType = file.type;
                if (fileType === 'image/jpeg' || fileType === 'image/png') {
                    console.log('图片类型是：', fileType);
                    this.previewimgService.readAsDataUrlWithCompress(file, 800).then(data => {
                        const base64Str = data.toString();
                        this.uploadPhotoBase64(base64Str);
                    });
                } else {
                    console.log('不是图片，不能压缩处理，作为文件上传');
                    this.uploadFile(file);
                }
            }
        });
        // 模拟点击
        inputObj.click();
        // 从DOM中移除input
        document.body.removeChild(inputObj);
    }


    async openFileMobile() {
        console.log('打开手机选择文件');
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            targetWidth: 800,
            targetHeight: 600,
        };
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.CAMERA;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.uploadPhotoBase64(data);
                        });
                    }
                },
                {
                    text: '相册',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.uploadPhotoBase64(data);
                        });
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }


    uploadPhotoBase64(base64Str) {
        console.log('开始执行uploadPhotoBase64方法');
        const sendTime = new Date().getTime();
        const params = {toNames: this.friendWid, sendTime};
        this.baseService.httpPost(APIService.FILEAPI.uploadChatPhotoBase64, params, base64Str, data => {
            if (data.code === 0) {
                const base64 = data.data;
                const messageId = this.messageIdPrefix + this.photoType + '-' + sendTime;
                const link = APIService.domain + '/getChatFileLocation/' + this.photoType + '-' + this.userWid + '-' + sendTime;
                const chatMessage = new ChatMessage(this.userWid, this.currentFriend.wid, base64, this.photoType, sendTime, messageId, link);
                this.doSendMessage(chatMessage);
            } else {
                this.baseService.presentConfirmToast('失败，请重新上传');
            }
        }, true);
    }

    uploadFile(file) {
        const fileName = file.name;
        const sendTime = new Date().getTime();
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        const params = {toNames: this.friendWid, sendTime};

        this.baseService.httpPost(APIService.FILEAPI.uploadChatFile, params, formdata, data => {
            if (data.code === 0) {
                const messageId = this.messageIdPrefix + this.fileType + '-' + sendTime;
                const link = APIService.domain + '/getChatFileLocation/' + this.fileType + '-' + this.userWid + '-' + sendTime;
                const chatMessage = new ChatMessage(this.userWid, this.currentFriend.wid, fileName, this.fileType, sendTime, messageId, link);
                this.doSendMessage(chatMessage);
            } else {
                this.baseService.presentConfirmToast('失败，请重新上传');
            }
        }, true);
    }

    downloadFile(msg) {
        if (this.isMobile) {
            const type = APIService.getFileType(msg.content);
            this.nativeService.downloadXHR(msg.link, msg.content, type);
        } else {
            this.http.get(msg.link, {responseType: 'blob'}).subscribe(
                data => {
                    const theBlob = new Blob([data], {type: 'application/octet-stream'});
                    saveAs(theBlob, msg.content);
                }, err => {
                    this.baseService.presentToast(JSON.stringify(err));
                });
        }
    }

    readMessage(content) {
        this.tts.speak({text: content, locale: 'zh-CN', rate: 0.75})
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
    }

    startListen() {
        const options = {
            language: 'zh-CN',
            matches: 5,
            prompt: '',
            showPopup: true,
            showPartial: false
        };
        this.speechRecognition.startListening(options).subscribe(
            (matches: string[]) => {
                this.messageContent = matches[0];
            },
            (onerror) => alert('error:' + onerror)
        );
    }
}

