
import axios from 'axios';
import { BaseResp } from '@/api/baseType';


export interface MinioConfig {
  id: number;
  name: string;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  secure: boolean;
  port: number;
  userId: number;
  hostUrl: string;
  createTime: string;
  updateTime: string;
}

export function MinioConfigList() {
  return axios.get<BaseResp<MinioConfig>>(
    '/minio/minioConfig?pageSize=1000&currentPage=1'
  );
}