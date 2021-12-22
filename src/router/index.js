import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/Landing.vue';
import AllEngrams from '../views/AllEngrams.vue';

const routes = [
	{
		path: '/',
		name: 'Landing',
		component: Landing,
	},
	{
		path: '/all',
		name: 'All Engrams',
		component: AllEngrams,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
