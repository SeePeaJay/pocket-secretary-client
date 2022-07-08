<template>
	<p v-if="userIsLoggedIn()">User authenticated</p>
	<p v-else>User not authenticated</p>
	<!-- <EngramEditor v-if="isLoggedIn" engram-title="Starred"/>
	<EngramEditor v-else default-engram-content=""/> -->
</template>

<script>
// import EngramEditor from '../components/EngramEditor.vue';
import { mapActions } from 'vuex';

export default {
	name: 'Landing',
	// components: {
	// 	EngramEditor,
  // },
	data() {
		return {
			defaultEngramBlocks: ['* Default Engram Page'],
		};
	},
	methods: {
		...mapActions(['fetchUser']),
	},
	created() {
		this.fetchUser().then(() => {
			console.log(`In creation of Landing, user is: ${this.$store.state.username}`);
		}); // seems like setting the abort controller is not needed here? perhaps because it doesn't request for more in the backend?

		// this.setAbortController().then((value) => {
		// 	console.log(`At creation of Engrams. And right after setting the abort controller, it should be ${value}`);
		// 	this.fetchEngramList();
		// });
	},
};
</script>
