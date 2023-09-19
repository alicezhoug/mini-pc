import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface Country {
  id: number;
  enName: string;
  phoneCode: string;
  symbol: string;
  areaCode: string;
  coinRate: number;
  userId: number;
  updateTime: string;
  createTime: string;
}

export function CountryList() {
  return axios.get<BaseResp<Country>>(
    '/pay/country?pageSize=1000&currentPage=1'
  );
}