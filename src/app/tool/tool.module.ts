import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {BottomsheetAlertComponent} from './bottomsheet-alert/bottomsheet-alert.component';
import {DialogAlertComponent} from './dialog-alert/dialog-alert.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HtmlPipe} from './pipes/html.pipe';
import {PhotoPipe} from './pipes/photo.pipe';
import {SpacePipe} from './pipes/space.pipe';
import {UsernameExistDirective} from './directives/username-exist.directive';
import {CityLinksComponent} from './city-links/city-links.component';
import {IndustriesComponent} from './industries/industries.component';
import {PositionsComponent} from './positions/positions.component';
import {MytinymceComponent} from './mytinymce/mytinymce.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkVirtualScrollViewportComponent} from './cdk-virtual-scroll-viewport/cdk-virtual-scroll-viewport.component';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {GaodeMapComponent} from './gaode-map/gaode-map.component';
import {QuillModule} from 'ngx-quill';
import {MyquillComponent} from './myquill/myquill.component';
import {OrderByPipe} from './pipes/order-by.pipe';
import {AutoresizeTextareaDirective} from './directives/autoresize-textarea.directive';
import {NgxViewerModule} from 'ngx-viewer';
import {DateFnsConfigurationService, DateFnsModule} from 'ngx-date-fns';
import {zhCN} from 'date-fns/locale';
import {WidToNamePipe} from './pipes/wid-to-name.pipe';
import {myPaginator} from './my-paginator/my-paginator';
import {PdfshowComponent} from './pdfshow/pdfshow.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {AssetPathPipe} from './pipes/asset-path.pipe';
import {HighlightPipe} from './pipes/highlight.pipe';
import {NgxEchartsModule} from 'ngx-echarts';
import { AddDomainPipe } from './pipes/add-domain.pipe';
import {VirtualScrollComponent} from './virtual-scroll/virtual-scroll.component';
import { DateLabelPipe } from './pipes/date-label.pipe';
import {TimeCountComponent} from './time-count/time-count.component';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { AudioJsDirective } from './directives/audio-js.directive';
import { VideoJsDirective } from './directives/video-js.directive';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, MatRippleModule, NativeDateAdapter} from '@angular/material/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LongPressDirective } from './directives/long-press.directive';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {IonicGestureConfig} from '../utils/hammer/ionic-gesture-config';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import { SplitLastPipe } from './pipes/split-last.pipe';
import { BankLogoPipe } from './pipes/bank-logo.pipe';


const zhCNConfig = new DateFnsConfigurationService();
zhCNConfig.setLocale(zhCN);

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule,
        QuillModule.forRoot(),
        ScrollingModule,

        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        MatFormFieldModule,

        DateFnsModule,
        NgxViewerModule,
        PdfViewerModule,
        PdfJsViewerModule,
        NgxEchartsModule
    ],
    declarations: [
        HtmlPipe,
        PhotoPipe,
        SpacePipe,
        OrderByPipe,
        WidToNamePipe,
        AssetPathPipe,
        HighlightPipe,
        AddDomainPipe,
        DateLabelPipe,
        SplitLastPipe,
        BankLogoPipe,

        UsernameExistDirective,
        AutoresizeTextareaDirective,
        AudioJsDirective,
        AudioJsDirective,
        VideoJsDirective,
        LongPressDirective,

        BottomsheetAlertComponent,
        DialogAlertComponent,
        CityLinksComponent,
        IndustriesComponent,
        PositionsComponent,
        MytinymceComponent,
        VirtualScrollComponent,
        CdkVirtualScrollViewportComponent,
        GaodeMapComponent,
        MyquillComponent,
        PdfshowComponent,
        TimeCountComponent,
    ],
    entryComponents: [
        BottomsheetAlertComponent,
        DialogAlertComponent,
        VirtualScrollComponent,
        CdkVirtualScrollViewportComponent,
        PdfshowComponent,
        GaodeMapComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        QuillModule,

        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        ScrollingModule,
        MatFormFieldModule,

        DateFnsModule,
        NgxViewerModule,
        PdfViewerModule,
        PdfJsViewerModule,
        NgxEchartsModule,

        HtmlPipe,
        PhotoPipe,
        SpacePipe,
        OrderByPipe,
        WidToNamePipe,
        AssetPathPipe,
        HighlightPipe,
        AddDomainPipe,
        DateLabelPipe,
        SplitLastPipe,
        BankLogoPipe,

        UsernameExistDirective,
        AutoresizeTextareaDirective,
        AudioJsDirective,
        VideoJsDirective,
        LongPressDirective,

        CityLinksComponent,
        IndustriesComponent,
        PositionsComponent,
        MytinymceComponent,
        VirtualScrollComponent,
        CdkVirtualScrollViewportComponent,
        GaodeMapComponent,
        MyquillComponent,
        PdfshowComponent,
        TimeCountComponent
    ],
    providers: [
        {provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }},
        {provide: DateFnsConfigurationService, useValue: zhCNConfig},
        {provide: MatPaginatorIntl, useValue: myPaginator()},
        {provide: DateAdapter, useClass: NativeDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
        {provide: MAT_DATE_LOCALE, useValue: 'zh-Hans'},
        {provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig},
    ]
})
export class ToolModule {
}
