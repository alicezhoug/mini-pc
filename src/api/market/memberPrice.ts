import axios from 'axios';

export interface MemberPrice {
  id: number;
  memberId: number;
  title: string;
  status: string;
  period: number;
  unit: string;
  ind: number;
  coin: number;
  coin2: number;
  selected: string;
  userId: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export function allMember() {
   return axios.get(`/market/member/optionItem`);
}
  
