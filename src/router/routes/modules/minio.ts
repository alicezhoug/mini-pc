import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/minio',
  name: 'Minio',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'minioConfig',
      name: 'MinioConfig',
      component: () => import('@/views/minio/minioConfig/index.vue'),
    },
	 {
	      path: 'minioBucket',
	      name: 'MinioBucket',
	      component: () => import('@/views/minio/minioBucket/index.vue'),
	    },
  ],
};