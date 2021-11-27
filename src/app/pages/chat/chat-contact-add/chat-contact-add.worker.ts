/// <reference lib="webworker" />
import {pinyin} from '../../../models/pingyin';
import {Friend} from '../../../models/system-data';


addEventListener('message', (dataIn) => {
    const data = dataIn.data.contacts;
    const domain = dataIn.data.domain;

    const allSearchContacts = [];
    const formatPhoneContacts = [];
    for (const one of data) {
        let obj = new Friend('', '', '');
        obj.wid = one.wid;
        obj.avatar = domain + one.avatar;
        obj.nickname = one.nickname;
        obj.phoneNumber = one.phoneNumber;
        obj.displayName = one.displayName;
        obj.pinyinName = pinyin.getFullChars(obj.displayName);
        obj.tag = one.tag;

        allSearchContacts.push(obj);

        // 去掉名称非汉字、或英文的
        const reg = /^[A-Za-z]+$/;
        // 开始按照首字母分类排序
        const len = formatPhoneContacts.length;
        if (!reg.test(obj.pinyinName) || obj.displayName === '') {
            // 非正常名字，联系人中文名字转为拼音，不符合英文正则，或者中文名字为空的，放入#栏下
            for (let j = 0; j < len; j++) {
                if ((formatPhoneContacts[j] as any).key === '#') {
                    (formatPhoneContacts[j] as any).value.push(obj);
                    break;
                }
            }
        } else {
            // 正常名字
            const camelChar = pinyin.getCamelChars(obj.displayName).substring(0, 1);  // 通过pingyin.ts获取中文名字首字母
            if (reg.test(camelChar)) {
                // 首字母符合英文正则
                let j = 0;
                for (j; j < len; j++) {
                    if ((formatPhoneContacts[j] as any).key === camelChar) {
                        (formatPhoneContacts[j] as any).value.push(obj);  // 将对象obj放入对应的首字母栏下
                        break;
                    }
                }
                if (j === len) { // 处理最后一个obj
                    const arr = [];
                    arr.push(obj);
                    formatPhoneContacts[len] = {key: camelChar, value: arr};
                }
            }
        }
        obj = null;
    }

    // 首字母排序
    formatPhoneContacts.sort((a, b) => {
        if (a.key < b.key) {
            return -1;
        } else if (a.key > b.key) {
            return 1;
        } else {
            return 0;
        }
    });

    // 每组内部排序
    for (const formatPhoneContact of formatPhoneContacts) {
        formatPhoneContact.value.sort((a, b) => {
            if (a.key < b.key) {
                return -1;
            } else if (a.key > b.key) {
                return 1;
            } else {
                return 0;
            }
        });
    }
    // formatPhoneContact的数据格式，例如：
    // {key: 'A', value: [
    //      {key: 'A', displayName: '周宏飞', phoneNumber: '13771880835', tag: '未分类', nickname: '吴江小鱼儿', pinyinName: 'zhouhongfei'},
    //      {key: 'A', displayName: '鲁华萍', phoneNumber: '13912730747', tag: '未分类', nickname: '阿禄', pinyinName: 'luhuaping'},
    //      {key: 'A', displayName: '周鱼月', phoneNumber: '15850280825', tag: '未分类', nickname: '花无缺', pinyinName: 'zhouyuyue'},
    //      {key: 'A', displayName: '周鱼阳', phoneNumber: '15895501880', tag: '未分类', nickname: '小超人', pinyinName: 'zhouyuyang'}
    //      ]
    // }

    const dataOut = {allSearchContacts, formatPhoneContacts};
    postMessage(dataOut);
});
