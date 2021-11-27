import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {NavigationEnd, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {AlertController} from '@ionic/angular';
import {Storage} from '@ionic/storage';


@Component({
    selector: 'app-show-live',
    templateUrl: './show-live.component.html',
    styleUrls: ['./show-live.component.scss']
})
export class ShowLiveComponent implements OnInit, OnDestroy {
    isMobile;
    @ViewChild('header', {static: false}) header;
    theImgUrl = 'assets/images/beautyHill.jpg';
    theAvatarUrl: string;
    theUserWid: string;
    nickname: string;
    navigationSubscription;

    tagList = [];

    blogIdDetail: string;
    blogShowList = [];
    totalBlogLength: number;
    pageIndex = APIService.pageIndex;
    pageSize = APIService.pageSize;

    worker;
    constructor(private baseService: BaseService, private storage: Storage, private alertController: AlertController, private router: Router) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/show/live' || event.url === '/show') {
                    this.getCurrentUser();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.worker) {
            this.worker.terminate();
        }
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    scrollEvent(e) {
        const opacity = (e.detail.scrollTop - 300) / 300;               // 设置滚动距离300的时候导航栏出现
        this.header._elementRef.nativeElement.style.opacity = opacity;
    }

    getCurrentUser() {
        this.theUserWid = this.baseService.getWidLocal();
        const userAvatar = localStorage.getItem(APIService.SAVE_LOCAL.userAvatar);
        this.theAvatarUrl = userAvatar ? userAvatar : APIService.avatarPrefix + this.theUserWid;
        this.nickname = localStorage.getItem(APIService.SAVE_LOCAL.nickname);
        const blogPhoto = localStorage.getItem(APIService.SAVE_LOCAL.userBlogPhoto);
        if (blogPhoto) {
            this.theImgUrl = blogPhoto;
        }

        this.tagList = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.contactTags));
        this.getShowLiveList();
    }

    getShowLiveList() {
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(theData => {
            if (theData) {
                const allContacts = theData.allContacts;
                if (!allContacts) {
                    return this.baseService.presentToast('添加好友后显示分享内容');
                }
                const params = {pageSize: this.pageSize, pageIndex: this.pageIndex};
                this.baseService.httpGet(APIService.CHAT.getShowLiveList, params, data => {
                    if (data.code === 0) {
                        this.totalBlogLength = data.num;
                        const showBlogs = data.data;
                        if (showBlogs && showBlogs.length > 0) {
                            if (typeof Worker !== 'undefined') {
                                this.worker = new Worker('./show-live.worker', { type: 'module' });
                                this.worker.onmessage = (dataOut) => {
                                    const value = dataOut.data;
                                    console.log('完善过后的信息是：', value);
                                    if (this.pageIndex === 0) {
                                        this.blogShowList = value;
                                    } else {
                                        this.blogShowList = this.blogShowList.concat(value);
                                    }
                                };
                                const photoPrefix = APIService.domain + '/getPhotoShowLocation/';
                                const avatarPrefix = APIService.avatarPrefix;
                                const dataIn = {showBlogs, allContacts, photoPrefix, avatarPrefix, userWid: this.theUserWid, nickname: this.nickname};
                                this.worker.postMessage(dataIn);
                            }
                        }
                    }
                });
            } else {
                return this.router.navigate(['/chat']).then(() => {
                    this.baseService.presentToast('请先添加好友');
                });
            }
        });
    }


    doInfinite(event) {
        const num = this.blogShowList.length;
        if (num > 0 && (num % this.pageSize === 0)) {  // 当前项目总数除以pageSize是求余，如果余数不为0，那么就是最后一页了
            this.pageIndex = Math.floor(this.blogShowList.length / this.pageSize) + 1;  // 当前项目总数 除以 每页数量 得出当前页码数
            this.getShowLiveList();
        }
        setTimeout(() => {
            event.target.complete();
            if (num === this.totalBlogLength) {
                event.target.disabled = true;
            }
        }, 2000);
    }


    // 此处的idAt, commentAtWid, commentAtDisplayName其实为本条评论的id, commenterWid, commenterDisplayName
    // 因为是对该评论的评论，所以方法括号内的参数，修改为idAt, commentAtWid, commentAtDisplayName字样
    async makeComment(blogIdDetail: string, idAt: string, commentAtWid: string, commentAtDisplayName: string) {
        // 如果是blog的id，则格式为：BLOGSHOW-blogCreatorUserWid-createTime
        // 如果是comment的id，则格式为：BLOGCOMMENT-userWid-createTime
        const idAtWords = idAt.split('-');
        if (idAtWords[0] === APIService.COMMENT_TYPE.blogComment && idAtWords[1] === this.theUserWid) {
            return this.baseService.presentToast('不能对自己的评论再评论');
        }

        const alert = await this.alertController.create({
            header: '评论',
            inputs: [
                {
                    name: 'comment',
                    type: 'text',
                    placeholder: '说点什么吧...'
                },
            ],
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('选择取消');
                    }
                }, {
                    text: '确定',
                    handler: (value) => {
                        console.log('选择确定');
                        this.doComment(blogIdDetail, idAt, commentAtWid, commentAtDisplayName, value.comment);
                    }
                }
            ]
        });
        await alert.present();
    }

    doComment(blogIdDetail: string, idAt: string, commentAtWid: string, commentAtDisplayName: string, comment: string) {
        this.baseService.httpPost(APIService.CHAT.commentOnShowBlog, {blogIdDetail, idAt}, comment, data => {
           if (data.code === 0) {
               const commentId = data.data;
               this.addCommentToShowBlog(blogIdDetail, commentId, idAt, commentAtWid, commentAtDisplayName, comment);
           } else {
               this.baseService.presentToast(data.msg);
           }
        });
    }

    addCommentToShowBlog(blogIdDetail: string, commentId: string, idAt: string, commentAtWid: string, commentAtDisplayName: string, comment: string) {
        const commenterWid = this.theUserWid;
        const commenterDisplayName = this.nickname;

        const obj = {
            id: commentId,
            idAt,
            comment,
            createTime: Date.now(),
            commenterWid,
            commenterDisplayName,
            commentAtWid,
            commentAtDisplayName
        };

        for (const blog of this.blogShowList) {
            if (blogIdDetail === blog.idDetail) {
                const showBlogComments = blog.showBlogComments;
                showBlogComments.push(obj);
                blog.showBlogComments = showBlogComments;
            }
        }
    }

    goToBlogMake() {
        return this.router.navigate(['/show/blogMake']).then(() => {
            this.blogShowList = [];
            this.totalBlogLength = undefined;
            this.pageIndex = APIService.pageIndex;
            this.pageSize = APIService.pageSize;
        });
    }

}
