import axios from 'axios';

export interface Member {
  id: number;
  title: string;
  status: boolean;
  period: number;
  unit: string;
  ind: number;
  coin: number;
  coin2: number;
  userId: number;
  createTime: string;
  updateTime: string;
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
  return axios.post(`/market/member/iconUpload?name=${name}`, data, config);
}

  
