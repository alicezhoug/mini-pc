export interface UserFollow {
  id: number;
  userId: number;
  userFollowId: number;
  isRead: number;
  userFollowState: number;
  createTime: string;
  updateTime: string;
}