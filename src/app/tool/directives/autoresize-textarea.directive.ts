import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: 'ion-textarea[appAutoresize]'
})
export class AutoresizeTextareaDirective {

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  @Input('appAutoresize') maxHeight: number;

  constructor(public element: ElementRef) {
    this.adjust();
  }

  adjust(): void {
    const ta = this.element.nativeElement.querySelector('textarea');
    let newHeight;

    if (ta) {
      ta.style.overflow = 'hidden';
      ta.style.height = 'auto';
      if (this.maxHeight) {
        // console.log('this.maxHeight', this.maxHeight);
        newHeight = Math.min(ta.scrollHeight, this.maxHeight);
        // console.log('newHeight', newHeight);
      } else {
        newHeight = ta.scrollHeight;
      }
      ta.style.height = newHeight + 'px';
    }
  }

}
