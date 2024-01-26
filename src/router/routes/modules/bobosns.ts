import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
	path: '/bobosns',
	name: 'Bobosns',
	component: DEFAULT_LAYOUT,
	children: [
		{
			path: 'slideshow',
			name: 'Slideshow',
			component: () => import('@/views/bobosns/slideshow/index.vue'),
		},
		{
			path: 'circle',
			name: 'Circle',
			component: () => import('@/views/bobosns/circle/index.vue'),
		},
		{
			path: 'plate',
			name: 'Plate',
			component: () => import('@/views/bobosns/plate/index.vue'),
		},
		{
			path: 'icons',
			name: 'Icons',
			component: () => import('@/views/bobosns/icons/index.vue'),
		},
		{
			path: 'like',
			name: 'Like',
			component: () => import('@/views/bobosns/like/index.vue'),
		},
		{
			path: 'userFollow',
			name: 'UserFollow',
			component: () => import('@/views/bobosns/userFollow/index.vue'),
		},
		{
			path: 'collect',
			name: 'Collect',
			component: () => import('@/views/bobosns/collect/index.vue'),
		},
		{
			path: 'search',
			name: 'Search',
			component: () => import('@/views/bobosns/search/index.vue'),
		},
		{
			path: 'posts',
			name: 'Posts',
			component: () => import('@/views/bobosns/posts/index.vue'),
		},
		{
			path: 'notice',
			name: 'Notice',
			component: () => import('@/views/bobosns/notice/index.vue'),
		},
		{
		  path: 'chat',
		  name: 'Chat',
		  component: () => import('@/views/bobosns/chat/index.vue'),
		},
		{
			path: 'authentication',
			name: 'Authentication',
			component: () => import('@/views/bobosns/authentication/index.vue'),
		},
		{
			path: 'config',
			name: 'Config',
			component: () => import('@/views/bobosns/config/index.vue'),
		},

		{
			path: 'circleUser',
			name: 'CircleUser',
			component: () => import('@/views/bobosns/circleUser/index.vue'),
		},
	],
};