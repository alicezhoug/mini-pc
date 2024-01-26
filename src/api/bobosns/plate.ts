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
export function AllPlateList() {
  return axios.get<BaseResp<Plate>>(
    '/bobosns/plate/all'
  );
}


export function PlateListWithCircle() {
  return axios.get<BaseResp<Plate>>(
    '/bobosns/plate/listByCircle'
  );
}

export interface ConfigTree {
  children: ConfigTree[];
  key: number;
  title: string;
}

export function getPlateTree() {
  return axios.get<ConfigTree[]>('/bobosns/plate/listTree');
}

