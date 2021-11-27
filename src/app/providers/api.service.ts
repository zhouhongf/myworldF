import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    static letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];

    static mobile = 'MOBILE';
    static browse = 'BROWSE';
    static yes = 'YES';
    static no = 'NO';
    static pending = 'PENDING';

    // 因测试，所以将有效期都设置为1000天
    static dataValidOneDay = 24 * 3600 * 1000;
    static dataValidTime = 1000 * 24 * 3600 * 1000;
    static cityDataValidTime = 1000 * 24 * 3600 * 1000;

    static pageLength = 0;
    static pageIndex = 0;
    static pageSize = 10;

    static usernamePattern = '^0?[1|9][3|4|5|8|9][0-9]\\d{8}$';
    static passwordPattern = '^[a-zA-Z0-9]{6,18}$';
    static widPattern = '^[a-zA-Z][a-zA-Z0-9]{6,18}$';   // 不能有“-”单划线，后台编码使用单划线分隔，也不能有“，”和“=”
    // static nicknamePattern = '^[\u4E00-\u9FA5A-Za-z0-9]{2,18}$';
    static nicknamePattern = '^[\u4E00-\u9FA5]{2,18}$';
    static savenamePattern = '^[a-zA-Z][a-zA-Z0-9_]{5,17}$';
    static socialIdPattern = '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$';
    static officialNamePattern = '^[A-Z]{6,18}$';
    static versionPattern = '^[0-9]\\.[0-9]\\.[0-9]$';

    static linkPattern = '^http[s]?://\\S+$';
    static ChinesePattern = '[\u4E00-\u9FA5，、\.-]{2,}';
    static EnglishPattern = '[-a-zA-Z\\s,]{1,}';
    static NumberPattern = '[0-9]+';

    // 接口基础地址
    // static domain = 'http://192.168.3.250:9005';
    static domain = 'http://www.jingrongbank.com:9005';
    // static chatSession = 'http://192.168.3.250:9005/schat/makeHttpSession';
    static chatSession = 'http://www.jingrongbank.com:9005/schat/makeHttpSession';
    // static socketUrl = 'ws://192.168.3.250:9005/schat/socket';
    static socketUrl = 'ws://www.jingrongbank.com:9005/schat/socket';

    static avatarPrefix = 'http://www.jingrongbank.com:9005/avatar/';
    static avatarPrefixGroup = 'http://www.jingrongbank.com:9005/avatarGroup/';
    // static avatarPrefix = 'http://192.168.3.250:9005/avatar/';
    // static avatarPrefixGroup = 'http://192.168.3.250:9005/avatarGroup/';

    static wordcloudPrefix = 'http://www.jingrongbank.com:9005/swealth/text/wordcloud/';
    // static wordcloudPrefix = 'http://192.168.3.250:9005/swealth/text/wordcloud/';

    static weatherUrl = 'http://d1.weather.com.cn/sk_2d/';                  // http://d1.weather.com.cn/sk_2d/101301304.html?_=1577756342961
    static weatherReferer = 'http://www.weather.com.cn/weather1d/';         // http://www.weather.com.cn/weather1d/101301304.shtml

    static assetsBankLogoSmall = 'assets/images/bankLogoSmall/';
    static assetsImages = 'assets/images/';

    // static englishVoice = 'http://122.114.50.172:9005/sstudent/vocabulary/voice/';

    static SAVE_SESSION: any = {
        imageCodeParam: 'imageCodeParam'
    };

    static SAVE_LOCAL: any = {
        deviceType: 'deviceType',
        currentUser: 'currentUser',
        accountStatus: 'accountStatus',
        nickname: 'nickname',
        userIntro: 'userIntro',
        userOutline: 'userOutline',

        userAvatar: 'userAvatar',
        userBlogPhoto: 'userBlogPhoto',

        company: 'company',
        position: 'position',

        currentCity: 'currentCity',                             // currentCity和cityData和wealthData是同步的，只要currentCity更新，这两个data也同时更新
        currentCityPrice: 'currentCityPrice',
        cityLngLat: 'cityLngLat',
        userLngLat: 'userLngLat',
        cityTemp: 'cityTemp',
        cityWeather: 'cityWeather',

        contactTags: 'contactTags',
        currentFriendTemp: 'currentFriendTemp',
        currentFriendsInTag: 'currentFriendsInTag',
        currentTagTemp: 'currentTagTemp',

        currentFriendsInGroup: 'currentFriendsInGroup',

        currentSearch: 'currentSearch',
        currentRank: 'currentRank',

        currentExamRequirements: 'currentExamRequirements',
    };

    static SAVE_STORAGE: any = {
        allSlides: 'allSlides',

        allContacts: 'allLettersContacts',
        allUntagContacts: 'allUntagContacts',
        phoneContacts: 'phoneContacts',
        friendApplies: 'friendApplies',

        currentGroupLists: 'currentGroupLists',

        photoShowsTemp: 'photoShowsTemp',
        userShowBlogCurrent: 'userShowBlogCurrent',
        userShowSocialCurrent: 'userShowSocialCurrent',
        watchUsers: 'watchUsers',

        favorWealths: 'favorWealths',
        favorTexts: 'favorTexts',
        favorJobs: 'favorJobs',

        cityLocal: 'houseCITY',
        countyLocalTemp: 'houseCOUNTYTemp',

        wealthLocal: 'LOCAL',
        wealthTopTen: 'TOPTEN',
        wealthTop: 'TOP',
        wealthBoard: 'BOARD',
        bankLocation: 'BANKLOCATION',

        siteInfo: 'siteInfo',

        customWealthList: 'customWealthList',
        customWealthData: 'customWealthData',

        searchHistory: 'searchHistory',
        examEnglish: 'examEnglish',
        examChinese: 'examChinese',
    };

    static FILEAPI: any = {
        uploadUserAvatarBase64: '/cauth/uploadUserAvatarBase64',

        uploadIdPhoto: '/cauth/uploadIdPhoto',
        uploadIdPhotoBase64: '/cauth/uploadIdPhotoBase64',
        adminUploadIdPhoto: '/cauth/adminUploadIdPhoto',
        adminUploadIdPhotoBase64: '/cauth/adminUploadIdPhotoBase64',
        adminUploadSmallPic: '/cauth/adminUploadSmallPic',
        adminUploadSmallPicBase64: '/cauth/adminUploadSmallPicBase64',
        adminUploadTinymce: '/cauth/adminUploadTinymce',

        adminUploadFile: '/shared/setFile',
        adminDeleteFile: '/shared/delFile/',
        downloadFile: '/shared/getFile/',

        getSlideList: '/shared/getSlideList',
        adminSetSlide: '/shared/setSlide',
        adminDelSlide: '/shared/delSlide/',
        adminUpdateSlide: '/shared/updateSlide/',

        uploadGroupAvatarBase64: '/schat/uploadGroupAvatarBase64',

        uploadChatPhoto: '/schat/uploadChatPhoto',
        uploadChatPhotoBase64: '/schat/uploadChatPhotoBase64',
        uploadChatFile: '/schat/uploadChatFile',

        uploadBlogPanelPhoto: '/schat/uploadBlogPanelPhoto',
        uploadBlogPanelPhotoBase64: '/schat/uploadBlogPanelPhotoBase64',

        uploadShowPhotoBase64: '/schat/uploadShowPhotoBase64',
        uploadTweetPhotoBase64: '/swealth/tweet/uploadTweetPhotoBase64',
    };

    // 接口地址
    static COMMON: any = {
        getSiteInfo: '/cauth/getSiteInfo',
        getSiteInfoReleaseTime: '/cauth/getSiteInfoReleaseTime',

        updateVisitorMobile: '/cauth/visitor/updateVisitorMobile',
        getVisitorList: '/cauth/visitor/visitorList',
    };

    static SHARED: any = {
        getWritingByTitle: '/shared/getWritingByTitle',
        getWritingListByTypeAndAuthor: '/shared/getWritingListByTypeAndAuthor'
    };

    static WEALTH: any = {
        overallOutline: '/swealth/wealth/overallOutline',

        showSocialList: '/swealth/tweet/showSocialList',
        showSocialListWatch: '/swealth/tweet/showSocialListWatch',
        getSocialComments: '/swealth/tweet/getSocialComments',
        commentOnSocial: '/swealth/tweet/commentOnSocial',
        createShowSocial: '/swealth/tweet/createShowSocial',
        delShowSocial: '/swealth/tweet/delShowSocial',

        getSocialWatchList: '/swealth/tweet/getSocialWatchList',
        addSocialWatch: '/swealth/tweet/addSocialWatch',
        delSocialWatch: '/swealth/tweet/delSocialWatch',

        getFavorWealths: '/swealth/wealth/getFavorWealths',
        addFavorWealth: '/swealth/wealth/addFavorWealth',
        delFavorWealth: '/swealth/wealth/delFavorWealth',

        textSearch: '/swealth/text/search',
        text: '/swealth/text/detail/',
        textOutline: '/swealth/text/outline',

        wealthSearch: '/swealth/wealth/search',
        detail: '/swealth/wealth/detail/',
        manual: '/swealth/wealth/manual/',
        rank: '/swealth/wealth/rank',
        bucketAnalyze: '/swealth/wealth/bucket',

        textAndWealth: '/swealth/wealth/textAndWealth',
        wealthMore: '/swealth/wealth/wealthMore',
        textMore: '/swealth/text/textMore',

        textCategory: '/swealth/text/textCategory',
        textFinance: '/swealth/text/textFinance',

        jobs: '/swealth/job/jobs',
        jobDetail: '/swealth/job/detail/',

        bankLocations: '/cauth/bank/locations',
    };

    static SYSUSER: any = {
        updateVisitor: '/cauth/updateVisitor',

        getUsername: '/cauth/getUsername',
        getAvatar: '/cauth/getAvatar',

        getNickname: '/swealth/user/getNickname',
        setNickname: '/swealth/user/setNickname',
        getUserInfo: '/swealth/user/getUserInfo',
        setUserInfo: '/swealth/user/setUserInfo',
        getUserOutline: '/swealth/user/getUserOutline',
        addUserWatch: '/swealth/user/addUserWatch',
        delUserWatch: '/swealth/user/delUserWatch',
        getWatchUsers: '/swealth/user/getWatchUsers',

        setIdInfo: '/cauth/setIdInfo',
        createWid: '/cauth/createWid',

        getIdCheckResultReason: '/cauth/getIdCheckResultReason',

        getBankAccounts: '/cauth/getBankAccounts',
        deleteBankAccount: '/cauth/deleteBankAccount/',
        editBankAccount: '/cauth/editBankAccount'
    };

    static SYSADMIN: any = {
        getAdminList: '/cauth/adminGetAdminList',
        setAdmin: '/cauth/adminSetAdmin',
        delAdmin: '/cauth/adminDelAdmin',

        getUserList: '/cauth/adminGetUsers',
        createUser: '/cauth/adminCreateUser',
        delUser: '/cauth/adminDelUser',
        getUserInfo: '/cauth/adminGetUserInfo',
        setUserInfo: '/cauth/adminSetUserInfo',

        getWritingList: '/shared/getWritingList',
        setWriting: '/shared/setWriting',
        getWriting: '/shared/getWriting',
        delWriting: '/shared/delWriting',

        getFileList: '/shared/getFileList',

        getLinkList: '/cauth/adminGetLinkList',
        setLink: '/cauth/adminSetLink',
        delLink: '/cauth/adminDelLink',
    };


    static CHAT: any = {
        saveNickname: '/schat/nickname',

        getContactTagsRemote: '/schat/getContactTagsRemote',
        updateContactTagsOrder: '/schat/updateContactTagsOrder',
        editContactTag: '/schat/editContactTag',
        delContactTag: '/schat/delContactTag',

        getAllContacts: '/schat/getAllContacts',
        searchContactRemote: '/schat/searchContactRemote',
        checkPhoneContacts: '/schat/checkPhoneContacts',
        checkPhoneApplies: '/schat/checkPhoneApplies',

        applyFriend: '/schat/applyFriend',
        confirmFriend: '/schat/confirmFriend',
        updateFriendInfo: '/schat/updateFriendInfo',

        makeHttpSession: '/schat/makeHttpSession',
        getListPair: '/schat/getListPair',
        getListGroup: '/schat/getListGroup',
        getChatMessagesPair: '/schat/getChatMessagesPair',
        getChatMessagesGroup: '/schat/getChatMessagesGroup',

        editChatGroup: '/schat/editChatGroup',
        delChatGroup: '/schat/delChatGroup',

        getCurrentCityByIP: '/schat/getCurrentCityByIP',

        createShowBlog: '/schat/createShowBlog',
        commentOnShowBlog: '/schat/commentOnShowBlog',
        getShowLiveList: '/schat/getShowLiveList',  // 获取本人朋友圈所有朋友分享的信息
        getShowBlogList: '/schat/getShowBlogList',

        delShowBlog: '/schat/delShowBlog',
    };

    static MESSAGE_TYPE: any = {
        chatPair: 'PAIR',
        chatGroup: 'GROUP',
        text: 'TEXT',
        photo: 'PHOTO',
        file: 'FILE',
        voice: 'VOICE',
    };

    static COMMENT_TYPE: any = {
        blogShow: 'BLOGSHOW',
        blogComment: 'BLOGCOMMENT'
    };

    /**
     * 每次调用sequence加1
     */
    static getSequence = (() => {
        let sequence = 1;
        return () => {
            return ++sequence;
        };
    })();


    // 根据url获取文件类型
    static getFileType(fileUrl: string): string {
        return fileUrl.substring(fileUrl.lastIndexOf('.') + 1, fileUrl.length).toLowerCase();
    }
    // 根据url获取文件名(包含文件类型)
    static getFileName(fileUrl: string): string {
        return fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.length).toLowerCase();
    }

    static getFileMimeType(fileType: string): string {
        let mimeType = '';
        switch (fileType) {
            case 'txt':
                mimeType = 'text/plain';
                break;
            case 'docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'doc':
                mimeType = 'application/msword';
                break;
            case 'pptx':
                mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                break;
            case 'ppt':
                mimeType = 'application/vnd.ms-powerpoint';
                break;
            case 'xlsx':
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case 'xls':
                mimeType = 'application/vnd.ms-excel';
                break;
            case 'zip':
                mimeType = 'application/x-zip-compressed';
                break;
            case 'rar':
                mimeType = 'application/octet-stream';
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'jpg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'apk':
                mimeType = 'application/vnd.android.package-archive';
                break;
            default:
                mimeType = 'application/' + fileType;
                break;
        }
        return mimeType;
    }

}
