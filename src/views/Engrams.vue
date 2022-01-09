<template>
	<div class="engrams-pane">
		<div class="engrams-area">
				<h1>Engrams</h1>
				<table>
					<tr><th>--Titles--</th></tr> <!--Name it Title later I think, when the alignment of the header is known-->
					<tr v-for="engram in engrams" :key="engram.title">
						<router-link :to="{ name: 'Engram', params: { engramTitle: engram.title }}">{{ engram.title }}</router-link>
					</tr>
				</table>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

// function getNewAbortController() {
// 	return new AbortController();
// }
// const abortController = getNewAbortController();

export default {
  name: 'Engrams',
	// data() {
	// 	return {
	// 		abortController: new AbortController(),
	// 	};
	// },
  computed: {
		// abortController() {
		// 	const abortController = new AbortController();
		// 	return abortController;
		// },
		engrams() {
			return this.$store.state.engrams;
		},
	},
	methods: {
		...mapActions(['fetchEngrams', 'cancelPreviousRequest', 'setAbortController']),
		// beforeWindowUnload() {
		// 	abortController.abort();
		// },
	},
	// watch: {
	// 	$route(to, from) {
	// 		// this.time ++;
  //     // console.log(`route is changed ${this.time}`);
	// 		// this.cancelAllRequests();
	// 		if (from.name === this.$options.name) {
	// 			console.log(`${from.name}: `);
	// 			this.cancelAllRequests();
	// 		}
	// 		// console.log(this.$options.name);
	// 		// console.log(from);
	// 	},
	// },
	created() {
		this.setAbortController().then((value) => {
			console.log(`At creation of Engrams. And right after setting the abort controller, it should be ${value}`);
			this.fetchEngrams();
		});
		// console.log('At creation of Engrams.');
		// this.fetchEngrams(abortController);
		// window.addEventListener('beforeunload', this.beforeWindowUnload);
	},
	// beforeUnmount() {
	// 	if (performance.getEntriesByType('navigation')[0].type === 'reload') {
	// 		this.cancelAllRequests(this.abortController);
	// 	}
	// },
	beforeRouteLeave(to, from, next) { // this won't execute during refresh
    // called when the route that renders this component is about to be navigated away from.
		console.log(`on first line of before route leave in ${from.name} ...`);
		this.cancelPreviousRequest().then(() => {
			next();
		});
		// abortController.abort();
		// next();
  },
	// beforeUnmount() {
	// 	window.removeEventListener('beforeunload', this.beforeWindowUnload);
	// },
};
</script>

<style scoped>
.engrams-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.engrams-area{
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 8px 0 8px;
}
</style>
