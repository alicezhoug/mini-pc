import axios from 'axios';


export interface PosterTemplate {
  id: number;
  text1: string;
  text2: string;
  text3: string;
  url: string;
  status: string;
  userId: number;
  createBy: string;
  createTime: string;
  updateBy: string;
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
  return axios.post(`/market/posterTemplate/iconUpload?name=${name}`, data, config);
}
