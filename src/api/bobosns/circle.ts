
import axios from 'axios';
import { BaseResp } from '@/api/baseType';


export interface Circle {
  id: number;
  circleName: string;
  sort: number;
  circleIntroduce: string;
  headPortrait: string;
  backgroundMaps: string;
  plateId: number;
  userId: number;
  isTopRecommend: boolean;
  isHot: boolean;
  circleState: number;
  reject: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
}

export function CircleList() {
  return axios.get<BaseResp<Circle>>(
    '/bobosns/circle?pageSize=1000&currentPage=1'
  );
}


// 上传图标
export function iconUpload(
  data: FormData,
  name: string,
  mode: string,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  return axios.post(`/bobosns/circle/iconUpload?mode=${mode}&name=${name}`, data, config);
}




