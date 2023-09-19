import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
	path: '/pay',
	name: 'Pay',
	component: DEFAULT_LAYOUT,
	children: [
		{
			path: 'mode',
			name: 'Mode',
			component: () => import('@/views/pay/mode/index.vue'),
		},
		{
			path: 'country',
			name: 'Country',
			component: () => import('@/views/pay/country/index.vue'),
		},
		{
			path: 'platform',
			name: 'Platform',
			component: () => import('@/views/pay/platform/index.vue'),
		},
		{
			path: 'coin',
			name: 'Coin',
			component: () => import('@/views/pay/coin/index.vue'),
		},
		{
			path: 'merchant',
			name: 'Merchant',
			component: () => import('@/views/pay/merchant/index.vue'),
		},
		{
			path: 'order',
			name: 'Order',
			component: () => import('@/views/pay/order/index.vue'),
		},
		{
		      path: 'transaction',
		      name: 'Transaction',
		      component: () => import('@/views/pay/transaction/index.vue'),
		},
	],
};