import axios from 'axios';
import { BaseResp } from '@/api/baseType';


export interface Mode {
  id: number;
  name: string;
  digital: boolean;
  enabled: boolean;
  withdrawal: boolean;
  withdrawalComm: number;
  userId: number;
  country: string;
  icon: string;
  updateTime: string;
  createTime: string;
}


export function ModeList() {
  return axios.get<BaseResp<Mode>>(
    '/pay/mode?pageSize=1000&currentPage=1'
  );
}



// 上传图标
export function iconUpload(
  data: FormData,
  name: string,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  return axios.post(`/pay/mode/iconUpload?name=${name}`, data, config);
}
