<template>
	<router-link
		v-if="engramDoesExist()"
		class="engram-link"
		:to="{ name: 'Engram', params: { engramTitle } }"
	>
		<img src="../assets/3d-cube-sphere.svg" alt="tabler 3d cube sphere icon" />{{ engramTitle }}
		<!-- dunno why, but engramTitle needs to stick right after the image; otherwise the two will be separated -->
	</router-link>
	<span v-else class="engram-link inactive" @click="createAndGoToEngram()">
		<img src="../assets/3d-cube-sphere.svg" alt="tabler 3d cube sphere icon" />{{ engramTitle }}
	</span>
</template>

<script>
export default {
	name: 'EngramLink',
	props: {
		engramTitle: String,
  },
	methods: {
		engramDoesExist() {
			return this.$store.state.engrams.find((engram) => engram.title === this.engramTitle);
		},
		async createAndGoToEngram() {
			// create a local and remote copy of engram
			await this.$store.dispatch('createEngram', this.engramTitle);

			// go to the actual link programmatically
			this.$router.push({ name: 'Engram', params: { engramTitle: this.engramTitle } });
		},
	},
};
</script>
