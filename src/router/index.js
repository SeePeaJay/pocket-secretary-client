import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/Landing.vue';
import Engrams from '../views/Engrams.vue';
import Engram from '../views/Engram.vue';
import store from '../store';

const routes = [
	{
		path: '/',
		name: 'Landing',
		component: Landing,
	},
	{
		path: '/engrams',
		name: 'Engrams',
		component: Engrams,
	},
	{
		path: '/engrams/:engramTitle',
		name: 'Engram',
		component: Engram,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
  if (store.state.username || to.fullPath === '/') {
		next();
	} else {
		next('/');
	}
});

export default router;
