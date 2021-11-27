/// <reference lib="webworker" />

import {pinyin} from '../../models/pingyin';
import {Friend} from '../../models/system-data';


addEventListener('message', (dataIn) => {
    const formatContacts = [];
    const formatLetters = new Set();
    const reg = /^[A-Za-z]+$/;

    const data = dataIn.data.contacts;
    const avatarPrefix = dataIn.data.avatarPrefix;
    for (const one of data) {
        let obj = new Friend('', '', '');
        obj.wid = one.wid;
        obj.avatar = avatarPrefix + one.wid;
        obj.nickname = one.nickname;
        obj.phoneNumber = one.phoneNumber;
        obj.displayName = one.displayName;
        obj.pinyinName = pinyin.getFullChars(obj.displayName);
        obj.tag = one.tag;

        const len = formatContacts.length;
        // 非正常名字，联系人中文名字转为拼音，不符合英文正则，或者中文名字为空的，放入#栏下
        if (!reg.test(obj.pinyinName) || obj.displayName === '') {
            for (let j = 0; j < len; j++) {
                if ((formatContacts[j] as any).key === '#') {
                    (formatContacts[j] as any).value.push(obj);
                    formatLetters.add('#');
                    break;
                }
            }
        } else {
            // 根据displayName的拼音取出首字母
            const camelChar = pinyin.getCamelChars(obj.displayName).substring(0, 1);
            // 首字母符合英文正则，将对象obj放入对应的首字母栏下
            if (reg.test(camelChar)) {
                let j = 0;
                for (j; j < len; j++) {
                    if ((formatContacts[j] as any).key === camelChar) {
                        (formatContacts[j] as any).value.push(obj);
                        break;
                    }
                }
                if (j === len) {        // 处理最后一个obj
                    const arr = [];
                    arr.push(obj);
                    formatContacts[len] = {key: camelChar, value: arr};
                }
                formatLetters.add(camelChar);
            }
        }
        obj = null;
    }
    // 将整理出来的formatContacts进行排序
    // 首字母排序
    formatContacts.sort((a, b) => {
        return a.key - b.key;
    });
    // 每组内部排序
    for (const formatContact of formatContacts) {
        formatContact.value.sort((a, b) => {
            return a.key - b.key;
        });
    }

    // 将首字母的集合排序
    const formatLettersSort = Array.from(formatLetters).sort();

    const dataOut = {allLetters: formatLettersSort, allContacts: formatContacts};
    postMessage(dataOut);
});
