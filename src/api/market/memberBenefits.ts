import axios from 'axios';

export interface MemberBenefits {
  id: number;
  memberId: number;
  text: string;
  img: string;
  desc: string;
  userId: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export function allMember() {
   return axios.get(`/market/member/optionItem`);
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
  return axios.post(`/market/memberBenefits/iconUpload?name=${name}`, data, config);
}