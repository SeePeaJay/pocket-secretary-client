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
		path: '/engrams/:engramTitle',
		name: 'engram',
		component: Engram,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
