
import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface Channel {
  id: number;
  name: string;
  stop: boolean;
  remark: string;
}
export function ChannelList() {
  return axios.get<BaseResp<Channel>>(
    '/video/channel?pageSize=1000&currentPage=1'
  );
}

