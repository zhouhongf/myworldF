import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {IonBadge, IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Network} from '@ionic-native/network/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {HttpClientModule} from '@angular/common/http';
import {httpInterceptorProviders} from './utils/interceptors';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {File} from '@ionic-native/file/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {RouteReuseStrategy} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {Contacts} from '@ionic-native/contacts/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Vibration} from '@ionic-native/vibration/ngx';
import {NativeAudio} from '@ionic-native/native-audio/ngx';
import {TextToSpeech} from '@ionic-native/text-to-speech/ngx';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import {Media} from '@ionic-native/media/ngx';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot({
            name: 'myworld_db',
            driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage']
        }),
        AppRoutingModule,
        MatToolbarModule,
        MatExpansionModule,
        MatListModule,
        MatButtonModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Network,
        AppVersion,
        InAppBrowser,
        SQLite,
        File,
        FileOpener,
        FileTransfer,
        Camera,
        Contacts,
        BackgroundMode,
        Keyboard,
        HTTP,
        AndroidPermissions,
        Diagnostic,
        Geolocation,
        LocalNotifications,
        Badge,
        Vibration,
        NativeAudio,
        TextToSpeech,
        SpeechRecognition,
        Media,
        httpInterceptorProviders,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

