import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cdk-virtual-scroll-viewport',
  templateUrl: './cdk-virtual-scroll-viewport.component.html',
  styleUrls: ['./cdk-virtual-scroll-viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdkVirtualScrollViewportComponent implements OnInit {

  @Input() scrollData;

  constructor() { }

  ngOnInit() {
  }

}
