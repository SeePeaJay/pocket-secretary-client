import { createRouter, createWebHistory } from 'vue-router';
// import Landing from '../views/Landing.vue';
import Engrams from '../views/Engrams.vue';
import Engram from '../views/Engram.vue';
// import store from '../store';

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

// router.beforeEach((to, from, next) => {
// 	// store.dispatch('testPrint');
// 	// // store.testFunc2();
// 	// store.dispatch('testReturn').then((value) => {
// 	// 	console.log(value);
// 	// });
// 	// store.dispatch('isAbortControllerNull').then((value) => {
// 	// 	console.log(`At navigation guard. At this point, is abortController null? ${value}`);

// 	// 	if (from.name) {
// 	// 		console.log(`${from.name}: about to cancel (unless it's initial)`);
// 	// 	} else {
// 	// 		console.log(`${to.name}: about to cancel (unless it's initial)`);
// 	// 	}
// 	// 	// console.log(from.name);
// 	// 	store.dispatch('cancelPreviousRequest').then(() => {
// 	// 		next();
// 	// 	});
// 	// });
// });

export default router;
