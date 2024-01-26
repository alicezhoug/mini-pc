export interface Chat {
  id: number;
  userId: number;
  objectId: number;
  chatContent: string;
  chatImage: string;
  chatAudioUrl: string;
  chatAudioLength: number;
  referId: number;
  isRead: number;
  chatState: number;
  createTime: string;
}