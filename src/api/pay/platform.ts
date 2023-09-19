import axios from 'axios';
import { BaseResp } from '@/api/baseType';


export interface Platform {
  id: number;
  name: string;
  enabled: boolean;
  remak: string;
  userId: number;
  updateTime: string;
  createTime: string;
}
export function PlatformList() {
  return axios.get<BaseResp<Platform>>(
    '/pay/platform?pageSize=1000&currentPage=1'
  );
}