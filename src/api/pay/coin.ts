import axios from 'axios';
import { BaseResp } from '@/api/baseType';


export interface Coin {
  id: number;
  quantity: number;
  enabled: boolean;
  userId: number;
  updateTime: string;
  createTime: string;
}


export function CoinList() {
  return axios.get<BaseResp<Coin>>(
    '/pay/coin?pageSize=1000&currentPage=1'
  );
}