import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
	path: '/market',
	name: 'Market',
	component: DEFAULT_LAYOUT,
	children: [
		{
			path: 'member',
			name: 'Member',
			component: () => import('@/views/market/member/index.vue'),
		},
		{
			path: 'memberUser',
			name: 'MemberUser',
			component: () => import('@/views/market/memberUser/index.vue'),
		},
		{
			path: 'memberPrice',
			name: 'MemberPrice',
			component: () => import('@/views/market/memberPrice/index.vue'),
		},
		 {
		      path: 'posterTemplate',
		      name: 'PosterTemplate',
		      component: () => import('@/views/market/posterTemplate/index.vue'),
		    },
	],
};