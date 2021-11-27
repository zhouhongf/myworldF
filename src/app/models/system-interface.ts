export interface CityGroup {
    letter: string;
    names: string[];
}

export const city_filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();
    return opt.filter(item => item.toLowerCase().includes(filterValue));
};

export interface SlideInterface {
    title: string;
    description: string;
    image: string;
}

export interface FriendInterface {
    wid: string;
    avatar: string;
    nickname: string;
    phoneNumber: string;

    displayName: string;
    pinyinName: string;
    tag: string;

    messageNum: string;
}

export interface ChatMessageInterface {
    type: string;
    fromName: string;
    content: string;
    toName: string;
    sendTime: number;
    id: string;
    ackTime: number;
}

export interface SearchItemInterface {
    id: string;
    type: string;
    title: string;
    description: string;
    url: string;
    createTime: number;
}

export interface SearchHistoryInterface {
    id: string;         // id就是searchTime
    keyword: string;
    itemsSelect: Array<SearchItemInterface>;
}
