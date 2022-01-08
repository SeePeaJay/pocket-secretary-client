import { createRouter, createWebHistory } from 'vue-router';
// import Landing from '../views/Landing.vue';
import Engrams from '../views/Engrams.vue';
import Engram from '../views/Engram.vue';

const routes = [
	// {
	// 	path: '/',
	// 	name: 'Landing',
	// 	component: Landing,
	// },
	{
		path: '/engrams',
		name: 'Engrams',
		component: Engrams,
	},
	{
		path: '/:engramTitle',
		name: 'Engram',
		component: Engram,
	},
	// {
	// 	path: '/sample',
	// 	name: 'Sample',
	// 	component: Engram,
	// },
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
