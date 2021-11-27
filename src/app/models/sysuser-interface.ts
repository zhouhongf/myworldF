export interface UserIdCheckInterface {
    playerType: string;
    idCheckApplyTime: string;
    nickname: string;
    username: string;
    realname: string;

    idCheckResult: string;
    idCheckCheckTime: string;
    idCheckReleaseTime: string;

    idCheckReasons: string;
    idCheckMemo: string;

    alreadySetup: string;
}

export interface UserInfoInterface {
    playerType: string;
    accountStatus: string;
    username: string;
    realname: string;

    placebelong: string;
    idtype: string;
    theposition: string;
    theindustry: string;

    createTime: string;
    idCheckReleaseTime: string;

    creditLevelConfirm: string;
}

export interface BankAccountInterface {
    createTime: string;
    updateTime: string;
    bankAccountType: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankNameDetail: string;
    bankAccountTel: string;
}


export interface BorrowerScoreInterface {
    username: string;
    realname: string;
    placebelong: string;
    idtype: string;
    theindustry: string;
    theposition: string;


    totalProjectsCreated: number;
    totalProjectsPassed: number;
    totalSelectTimes: number;

    avgSelectedLenderNums: number;
    totalDealedNums: number;
    totalDealedAmount: number;
    avgDealedAmount: number;
    totalFrozenTimes: number;
}

export interface LenderScoreInterface {
    username: string;
    realname: string;
    idnumber: string;
    placebelong: string;
    theindustry: string;
    companyname: string;
    creditLevel: string;

    totalInitialPriceNums: number;
    totalInitialPriceAmount: number;
    totalSelectedNums: number;
    totalSelectedAmount: number;
    totalFinalPriceNums: number;
    totalFinalPriceAmount: number;
    totalZeroFinalPriceNums: number;

    totalDealedNums: number;
    totalDealedAmount: number;

    avgAmountAD: number;
    avgRateAD: number;
    avgAmountRD: number;
    avgRateRD: number;

    simpleSelectedPercentage: number;
    avgSelectedPercentage: number;
    avgDaysNeed: number;
    avgLoanPass: number;
    totalUnFulfillNums: number;
    avgUnFulfillPercentage: number;

    totalFrozenNums: number;
}


export interface UnfreezeBorrowerInterface {
    idDetail: string;
    unfreezeApplyTime: string;

    username: string;
    realname: string;
    placebelong: string;
    idtype: string;
    theposition: string;
    theindustry: string;

    idNew: string;
    orderNo: string;

    projectTitle: string;
    unfreezeChecked: string;
    unfreezeCheckResult: string;
    unfreezeCheckTime: string;
    unfreezeReleaseTime: string;
}

export interface UnfreezeLenderInterface {
    idDetail: string;
    unfreezeApplyTime: string;

    username: string;
    realname: string;

    placebelong: string;
    theindustry: string;
    companyname: string;

    idNew: string;
    projectTitle: string;

    unfreezeChecked: string;
    unfreezeCheckResult: string;
    unfreezeCheckTime: string;
    unfreezeReleaseTime: string;
}


export interface ExchangeCreditInterface {
    exchangeCreditApplyTime: string;
    exchangeCreditNo: string;
    accountStatus: string;

    nickname: string;
    username: number;
    realname: string;
    placebelong: string;
    theindustry: string;
    companyname: string;

    creditsStart: number;
    creditsChange: number;
    payAmount: number;
    creditsEnd: number;

    targetAccountType: string;
    targetAccountName: string;
    targetAccountNumber: string;
    targetAccountCompanyname: string;
    targetAccountMemo: string;

    paymentAccount: string;

    exchangeCreditCheckResult: string;
    exchangeCreditCheckTime: string;
    exchangeCreditReleaseTime: string;
    exchangeCreditCheckMemo: string;
    alreadyChecked: string;
}
