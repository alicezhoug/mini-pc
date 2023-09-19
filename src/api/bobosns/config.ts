import axios from 'axios';


export interface Config {
  id: number;
  category: number;
  proLabel: string;
  proValue: string;
  parentId: number;
  status: boolean;
  userId: number;
  msgKey: string;
  desc: string;
  iconsId: number;
  showApp: boolean;
  updateTime: string;
  createTime: string;
}




export interface ConfigTree {
  children: ConfigTree[];
  key: number;
  title: string;
}

export function getConfigTree() {
  return axios.get<ConfigTree[]>('/bobosns/config/listTree');
}