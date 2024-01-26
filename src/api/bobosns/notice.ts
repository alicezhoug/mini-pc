export interface Notice {
  id: number;
  userId: number;
  postsId: number;
  orderId: number;
  title: string;
  content: string;
  isRead: number;
  noticeType: number;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
}