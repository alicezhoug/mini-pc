import axios from 'axios';

export interface MemberUser {
  id: number;
  memberPriceId: number;
  beginDate: string;
  endDate: string;
  userId: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export function allMemberPrice() {
   return axios.get(`/market/memberPrice/optionItem`);
}
  
