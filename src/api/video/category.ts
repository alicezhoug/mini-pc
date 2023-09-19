import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface Category {
  id: number;
  name: string;
  videoType: string;
}

export function CategoryList(videoType: string) {
  return axios.get<BaseResp<Category>>(`/video/category?pageSize=1000&currentPage=1&videoType=${videoType}`);
}

export function CategoryListAll() {
  return axios.get<BaseResp<Category>>(`/video/category?pageSize=1000&currentPage=1`);
}
