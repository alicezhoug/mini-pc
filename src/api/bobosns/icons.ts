import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface Icons {
  id: number;
  name: string;
  icon: string;
  unicode16: string;
  img: string;
  desc: string;
  type: number;
  targetId: string;
  createBy: string;
  updateBy: string;
  updateTime: string;
  createTime: string;
}


export function IconsList() {
  return axios.get<BaseResp<Icons>>(
    '/bobosns/icons?pageSize=1000&currentPage=1'
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
  return axios.post(`/bobosns/icons/iconUpload?name=${name}`, data, config);
}

