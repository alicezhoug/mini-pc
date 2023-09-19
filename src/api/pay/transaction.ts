export interface Transaction {
  id: number;
  name: string;
  kind: number;
  fee: number;
  userId: number;
  refId: number;
  createTime: string;
  updateTime: string;
}