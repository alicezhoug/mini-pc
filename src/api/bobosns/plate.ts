import axios from 'axios';
import { BaseResp } from '@/api/baseType';


export interface Plate {
  id: number;
  plateName: string;
  sort: number;
  plateIntroduce: string;
  plateState: boolean;
  updateBy: string;
  updateTime: string;
  createTime: string;
  createBy: string;
}


export function PlateList() {
  return axios.get<BaseResp<Plate>>(
    '/bobosns/plate?pageSize=1000&currentPage=1'
  );
}
