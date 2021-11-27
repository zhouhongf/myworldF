import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottomsheet-alert',
  templateUrl: './bottomsheet-alert.component.html',
  styleUrls: ['./bottomsheet-alert.component.scss']
})
export class BottomsheetAlertComponent {

  theData: any;

  myInput = new FormControl('', Validators.required);

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomsheetAlertComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) private data: any) {
    this.theData = data;
  }

  doConfirm() {
    this.bottomSheetRef.dismiss(this.myInput.value);
  }

}
