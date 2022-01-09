<template>
	<EngramEditor :engram-title="engramTitle"/>
</template>

<script>
import { mapActions } from 'vuex';
import EngramEditor from '../components/EngramEditor.vue';

export default {
	name: 'Engram',
	components: {
		EngramEditor,
  },
	computed: {
		engramTitle() {
			return this.$route.params.engramTitle;
		},
	},
	methods: {
		...mapActions(['setAbortController', 'fetchEngram', 'cancelPreviousRequest']),
	},
	created() {
		// this.fetchEngram(this.engramTitle);
		this.setAbortController().then((value) => {
			console.log(`At creation of individual engram. And right after setting the abort controller, it should be ${value}`);
			this.fetchEngram(this.engramTitle);
		});
	},
	// beforeUnmount() {
	// 	this.cancelAllRequests();
	// },
	beforeRouteLeave(to, from, next) { // this won't execute during refresh
    // called when the route that renders this component is about to
    // be navigated away from.
		console.log(`on first line of before route leave in ${from.name} ...`);
		this.cancelPreviousRequest().then(() => {
			next();
		});
  },
};
</script>
