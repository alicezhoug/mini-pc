import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface Merchant {
  id: number;
  name: string;
  enabled: boolean;
  official: boolean;
  platformId: number;
  alive: boolean;
  dayMoney: number;
  dayMaxMoney: number;
  totalMoney: number;
  balance: number;
  creditLimit: number;
  paymentBalance: number;
  userId: number;
  updateTime: string;
  createTime: string;
}
export function MerchantList() {
  return axios.get<BaseResp<Merchant>>(
    '/pay/merchant?pageSize=1000&currentPage=1'
  );
}