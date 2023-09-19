import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/video',
  name: 'Video',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'kind',
      name: 'Kind',
      component: () => import('@/views/video/kind/index.vue'),
    },
    {
      path: 'category',
      name: 'Category',
      component: () => import('@/views/video/category/index.vue'),
    },
    {
      path: 'channel',
      name: 'Channel',
      component: () => import('@/views/video/channel/index.vue'),
    },
	{
	      path: 'live',
	      name: 'Live',
	      component: () => import('@/views/video/live/index.vue'),
	},
	{
	      path: 'movie',
	      name: 'Movie',
	      component: () => import('@/views/video/movie/index.vue'),
	},
  ],
};