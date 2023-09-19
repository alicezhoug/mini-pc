import axios from 'axios';
import { BaseResp } from '@/api/baseType';


export interface Kind {
  id: number;
  name: string;
  videoType: number;
}

export function KindList(videoType: string) {
  return axios.get<BaseResp<Kind>>(`/video/kind?pageSize=1000&currentPage=1&videoType=${videoType}`);
}



export function KindListAll() {
  return axios.get<BaseResp<Kind>>(`/video/kind?pageSize=1000&currentPage=1`);
}