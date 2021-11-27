export const bankworkCompanyType = [
    '小微金融',
    '贷款融资',
    '贸易金融',
    '金融市场',
    '现金管理',
    '支付结算',
    '存款服务',
    '公司理财',
    '票据业务',
    '投行业务',
    '机构业务',
    '企业年金',
    '养老金服务',
    '资产托管',
    '融资租赁',
    '其他业务',
]

export const bankworkPersonType = ['个人理财', '个人存款', '个人贷款', '惠民金融', '个人跨境', '个人其他']

export const riskType = [
    {name: '低风险', value: 1},
    {name: '较低风险', value: 2},
    {name: '中等风险', value: 3},
    {name: '较高风险', value: 4},
    {name: '高风险', value: 5}
];

export const termType = [
    {name: '0-7天(含)', value: 1},
    {name: '7-30天(含)', value: 8},
    {name: '30-90天(含)', value: 31},
    {name: '90-180天(含)', value: 91},
    {name: '180-365天(含)', value: 181},
    {name: '1-3年(含)', value: 366},
    {name: '3-10年(含)', value: 1096},
    {name: '10年以上', value: 3651},
];

export const rateType = [
    {name: '1%以下', value: 0},
    {name: '1%(含)-2%', value: 0.01},
    {name: '2%(含)-3%', value: 0.02},
    {name: '3%(含)-4%', value: 0.03},
    {name: '4%(含)-5%', value: 0.04},
    {name: '5%(含)-6%', value: 0.05},
    {name: '6%(含)-7%', value: 0.06},
    {name: '7%(含)-8%', value: 0.07},
    {name: '8%(含)-9%', value: 0.08},
    {name: '9%(含)-10%', value: 0.09},
    {name: '10%(含)-12%', value: 0.1},
    {name: '12%(含)-15%', value: 0.12},
    {name: '15%及以上', value: 0.15},
];


export const promiseType = [
    {name: '非保本', value: 0},
    {name: '保本', value: 1}
];

export const fixedType = [
    {name: '浮动收益', value: 0},
    {name: '固定收益', value: 1}
];

export const timeRange = [
    {name: '最近一星期', value: 7},
    {name: '最近一个月', value: 30},
    {name: '最近三个月', value: 90},
    {name: '最近六个月', value: 180},
    {name: '自定义日期', value: 0}
];
