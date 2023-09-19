
import axios from 'axios';
import { BaseResp } from '@/api/baseType';



export interface User {
    userId: number;
    deptId: number;
    username: string;
    deviceId: string;
    deviceUuid: string;
    nickName: string;
    fullName: string;
    gender: string;
    phone: string;
    email: string;
    birthday: string;
    avatarPath: string;
    password: string;
    isAdmin: boolean;
    userType: number;
    enabled: boolean;
    state: number;
    createBy: string;
    updateBy: string;
    createTime: string;
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
  return axios.post(`/system/user/avatarUpload?name=${name}`, data, config);
}