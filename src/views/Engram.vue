<template>
	<AppBar />
	<EngramEditor :engram-title="engramTitle" isEditable />
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import AppBar from '../components/AppBar.vue';
import EngramEditor from '../components/EngramEditor.vue';

export default {
	name: 'Engram',
	components: {
		AppBar,
		EngramEditor,
  },
	computed: {
		engramTitle() {
			return this.$route.params.engramTitle;
		},
	},
	methods: {
		...mapMutations(['SET_LAST_COMMITTED_ENGRAM_DATA']),
		...mapActions(['setAbortController', 'fetchEngram', 'cancelPreviousRequest']),
	},
	created() { // TODO: won't be called if URL changed to another engram?
		this.SET_LAST_COMMITTED_ENGRAM_DATA(this.engramTitle);
		// this.setAbortController().then((value) => {
		// 	console.log(`At creation of individual engram. And right after setting the abort controller, it should be ${value}.`);
		// 	this.fetchEngram(this.engramTitle);
		// 	// this.SET_LAST_COMMITTED_ENGRAM_DATA(this.engramTitle);
		// });
	},
	// beforeRouteLeave(to, from, next) { // won't execute during refresh; only called when the route that renders this component is about to be navigated away from.
	// 	console.log(`On first line of before route leave in ${from.name} ...`);
	// 	this.cancelPreviousRequest().then(() => {
	// 		next();
	// 	});
  // },
};
</script>
