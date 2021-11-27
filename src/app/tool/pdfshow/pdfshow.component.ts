import {Component, Input} from '@angular/core';
import {NavController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-pdfshow',
  templateUrl: './pdfshow.component.html',
  styleUrls: ['./pdfshow.component.scss'],
})
export class PdfshowComponent {

  @Input() displayData: any = {};
  zoomSize = 1;
  zoomStep = 0.25;

  constructor(private navParams: NavParams, private navCtrl: NavController) {
    // this.displayData = this.navParams.get('displayData');
  }

  goBack() {
    this.navCtrl.pop();
  }

  doZoomPlus() {
    if (this.zoomSize < 3) {
      this.zoomSize += this.zoomStep;
    }
  }

  doZoomMinus() {
    if (this.zoomSize > 1) {
      this.zoomSize -= this.zoomStep;
    }
  }
}
