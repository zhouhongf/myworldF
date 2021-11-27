import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {HttpClient} from '@angular/common/http';


declare var ckplayer: any;

@Directive({
  selector: '[appVideoJs]'
})
export class VideoJsDirective implements AfterViewInit{

  @Input() url = '';
  player;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2, private http: HttpClient) { }

  ngAfterViewInit() {
    const video = this.renderer2.createElement('div');
    this.renderer2.setAttribute(video, 'id', 'video');
    const dom = this.elementRef.nativeElement as HTMLElement;         // 一定要为video添加一个父容器
    dom.appendChild(video);
    const videoObject = {
      container: '#video',
      variable: 'player',                     // 该属性必需设置，值等于下面的new ckplayer()的对象
      autoplay: false,                        // 自动播放
      live: true,
      video: this.url
    };
    this.player = new ckplayer(videoObject);
  }


}
