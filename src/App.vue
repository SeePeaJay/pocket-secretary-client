<template>
	<router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
	methods: {
		...mapActions(['cancelPreviousRequest']),
		beforeWindowUnload() {
			this.cancelPreviousRequest(); // otherwise, request aborted error upon refresh
		},
	},
	created() {
		window.addEventListener('beforeunload', this.beforeWindowUnload);
	},
	beforeUnmount() {
		window.removeEventListener('beforeunload', this.beforeWindowUnload);
	},
};
</script>

<style>
* { /* TODO: perhaps there's a better way of resetting? */
	margin: 0;
	/* padding: 0; */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
	display: flex;
	flex-direction: column;
}
</style>
