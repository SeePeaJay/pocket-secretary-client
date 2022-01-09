<template>
	<p v-if="isLoggedIn">Ur authenticated, yay</p>
	<p v-else>Ur not authenticated, nay</p>
</template>

<script>
// import EngramEditor from '../components/EngramEditor.vue';
import { mapActions } from 'vuex';

export default {
	name: 'Landing',
	// components: {
	// 	EngramEditor,
  // },
	computed: {
		isLoggedIn() {
			return !!this.$store.state.username;
		},
	},
	methods: {
		...mapActions(['fetchUser']),
	},
	created() {
		this.fetchUser();
		// this.setAbortController().then((value) => {
		// 	console.log(`At creation of Engrams. And right after setting the abort controller, it should be ${value}`);
		// 	this.fetchEngrams();
		// });
	},
};
</script>
