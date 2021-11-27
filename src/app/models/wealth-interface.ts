export interface WealthRanksInterface {
  productRegisterCode: string;
  productName: string;
  productType: string;
  productState: string;
  bankCode: string;
  bankName: string;
  startAmount: number;
  termType: string;
  termDays: number;
  raiseStartDate: string;
  raiseEndDate: string;
  productStartDate: string;
  productEndDate: string;
  openStartDate: string;
  openEndDate: string;
  profitType: string;
  profitRate: number;
  expectTopYearProfitRate: number;
  expectBottomYearProfitRate: number;
  expectProfitRateDiffPercent: number;
  riskType: string;
  investingType: string;
}
