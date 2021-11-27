import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-show-social',
  templateUrl: './show-social.component.html',
  styleUrls: ['./show-social.component.scss'],
})
export class ShowSocialComponent implements OnInit {
  isLogin = false;
  @ViewChild('socialHeader', {static: false}) header;

  showPhotoPrefix = APIService.domain + '/swealth/tweet/tweetPhoto/';
  avatarPrefix = APIService.avatarPrefix;
  anonymousPic = 'assets/images/anonymous.jpg';

  blogShowList = [];
  totalBlogLength: number;
  pageIndex = APIService.pageIndex;
  pageSize = APIService.pageSize;

  doLikeList = new Set();

  constructor(
      private baseService: BaseService,
      private storage: Storage,
      private router: Router,
      private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.isLogin = this.baseService.isLogin();
    this.getData();
  }

  scrollEvent(e) {
    const opacity = (e.detail.scrollTop - 300) / 300;
    this.header._elementRef.nativeElement.style.background = `rgba(255,255,255,${opacity})`;
  }

  getData() {
    let pageIndex = 0;
    if (this.pageIndex > 0) {
      pageIndex = this.pageIndex - 1;
    }
    const params = {pageSize: this.pageSize, pageIndex};
    this.baseService.httpGet(APIService.WEALTH.showSocialList, params, data => {
      if (data.code === 0) {
        this.totalBlogLength = data.num;
        const showBlogs = data.data;
        if (showBlogs && showBlogs.length > 0) {
          const blogs = [];
          // 将tweetPhotos从str变为list, 将tweetComments从str变为list
          for (const one of showBlogs) {
            const photosStr = one.tweetPhotos;
            if(photosStr) {
              const photos = photosStr.substring(0, photosStr.length - 1);
              one.tweetPhotos = photos.split(',');
            }
            const commentsStr = one.tweetComments;
            if (commentsStr) {
              const comments = commentsStr.substring(0, commentsStr.length - 1);
              one.tweetComments = comments.split(',');
            } else {
              one.tweetComments = [];
            }
            blogs.push(one);
          }

          if (this.pageIndex === 0) {
            this.blogShowList = blogs;
          } else {
            this.blogShowList = this.blogShowList.concat(blogs);
          }
          console.log('解析后的内容是：', this.blogShowList);
        }
      }
    });
  }

  doInfinite(event) {
    const num = this.blogShowList.length;
    if (num > 0 && (num % this.pageSize === 0)) {                                       // 当前项目总数除以pageSize是求余，如果余数不为0，那么就是最后一页了
      this.pageIndex = Math.floor(this.blogShowList.length / this.pageSize) + 1;      // 当前项目总数 除以 每页数量 得出当前页码数
      this.getData();
    }
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  doRefresh(event) {
    this.blogShowList = [];
    this.totalBlogLength = undefined;
    this.pageIndex = APIService.pageIndex;
    this.pageSize = APIService.pageSize;
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


  goToBlogMake() {
    return this.router.navigate(['/show/socialMake']).then(() => {
      this.blogShowList = [];
      this.totalBlogLength = undefined;
      this.pageIndex = APIService.pageIndex;
      this.pageSize = APIService.pageSize;
    });
  }

  goToBlogDetail(data) {
    this.storage.set(APIService.SAVE_STORAGE.userShowSocialCurrent, data).then(() => {
      return this.router.navigate(['/show/socialDetail']);
    });
  }

  goToSocialMine(data) {
    return this.router.navigate(['/show/socialMine', {param: data.userWid}])
  }


  doLike(tweetWid) {
    const favor = document.getElementById(tweetWid);
    const color = favor.style.color;
    if (this.doLikeList.has(tweetWid)) {
      this.doLikeList.delete(tweetWid);
    } else {
      this.doLikeList.add(tweetWid);
    }
    console.log('doLikeList内容是：', this.doLikeList);
    for(const one of this.blogShowList) {
      const wid = one['id'];
      if (wid === tweetWid) {
        if (color) {
          one['likeCount'] -= 1;
          favor.style.color = '';
        } else {
          one['likeCount'] += 1;
          favor.style.color = 'goldenrod';
        }
        break;
      }
    }
  }

}
