import {Component, OnInit, ViewChild} from '@angular/core';
import {GaodeService} from '../../../providers/gaode.service';
import {APIService} from '../../../providers/api.service';
import {IonTextarea} from '@ionic/angular';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
    selector: 'app-sysadmin-test',
    templateUrl: './sysadmin-test.component.html',
    styleUrls: ['./sysadmin-test.component.scss'],
})
export class SysadminTestComponent implements OnInit {

    showData = '这里显示内容...';
    @ViewChild(IonTextarea, {static: false}) ionTextArea: IonTextarea;
    voiceFile: MediaObject;


    constructor(private gaodeService: GaodeService, private speechRecognition: SpeechRecognition, private media: Media, private ionicfile: File) {
    }

    ngOnInit() {
    }

    searchBankLocation() {
        const city = localStorage.getItem(APIService.SAVE_LOCAL.currentCity);
        this.gaodeService.searchAMapPOI(city, '金融保险服务', '银行', 2).subscribe(data => {
            console.log(data);
            this.showData = JSON.stringify(data);
            this.ionTextArea.setFocus();
        });
    }

    getLocation() {
        this.gaodeService.getLocationAMap().subscribe(data => {
            console.log(data);
            this.showData = JSON.stringify(data);
            this.ionTextArea.setFocus();
        });
    }

    testCheck() {
        // Check feature available
        this.speechRecognition.isRecognitionAvailable().then((available: boolean) => alert(available));
    }

    testStartListen() {
        const options = {
            language: 'zh-CN',
            matches: 5,
            prompt: '',
            showPopup: true,
            showPartial: false
        };

        // Start the recognition process
        this.speechRecognition.startListening(options).subscribe(
            (matches: string[]) => alert(matches),
            (onerror) => alert('error:' + onerror)
        );
    }

    testStopListen() {
        // Stop the recognition process (iOS only)
        this.speechRecognition.stopListening();
    }

    testSupportedLanguages() {
        // Get the list of supported languages
        this.speechRecognition.getSupportedLanguages().then(
            (languages: string[]) => alert(languages),
            (error) => alert(error)
        );
    }

    testPermission() {
        // Check permission
        this.speechRecognition.hasPermission().then((hasPermission: boolean) => alert(hasPermission));
    }

    testRequestPermission() {
        // Request permissions
        this.speechRecognition.requestPermission().then(
            () => alert('Granted'),
            () => alert('Denied')
        );
    }

    checkDirectory() {
        const place = this.ionicfile.dataDirectory;
        alert('地址是：' + place);
    }

    testRecordIOS() {
        this.ionicfile.createFile(this.ionicfile.dataDirectory, 'file.mp3', true).then(() => {
            // 如果是IOS，则去掉file://前缀
            const file = this.media.create(this.ionicfile.dataDirectory.replace(/^file:\/\//, '') + 'file.mp3');
            file.startRecord();
            window.setTimeout(() => file.stopRecord(), 10000);
        });
    }


    testRecord() {
        const filename = 'Download/file.mp3';
        this.voiceFile = this.media.create(filename);
        this.voiceFile.startRecord();
        // 10秒后暂停录制
        setTimeout(() => this.voiceFile.stopRecord(), 10000);
    }

    testPlay() {
        this.voiceFile.play();
    }

    testPause() {
        this.voiceFile.pause();
    }

    testStop() {
        this.voiceFile.stop();
    }

    testRelease() {
        // release the native audio resource
        // Platform Quirks:
        // iOS simply create a new instance and the old one will be overwritten
        // Android you must call release() to destroy instances of media when you are done
        // android录制完成后，需要关闭
        this.voiceFile.release();
    }

}
