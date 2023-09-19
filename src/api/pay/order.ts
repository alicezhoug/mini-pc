export interface Order {
  id: number;
  platformId: number;
  merchantId: number;
  modeId: number;
  coinId: number;
  orderNo: string;
  orderFee: number;
  fee: number;
  coin: number;
  status: number;
  userId: number;
  tradeOrderNo: string;
  validStartTime: string;
  validEndTime: string;
  payUrl: string;
  createTime: string;
  updateTime: string;
}