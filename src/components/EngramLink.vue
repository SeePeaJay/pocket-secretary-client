<template>
	<router-link
		v-if="engramDoesExist()"
		:to="{ name: 'Engram', params: { engramTitle } }"
	>
		{{ engramTitle }}
	</router-link>
	<span v-else class="placeholder" @click="createAndGoToEngram()">
		{{ engramTitle }}
	</span>
</template>

<script>
// need to import router and go to link programmaticaly?

export default {
	name: 'EngramLink',
	props: {
		engramTitle: String,
  },
	methods: {
		engramDoesExist() {
			return this.$store.state.engrams.find((engram) => engram.title === this.engramTitle);
			// return false;
		},
		async createAndGoToEngram() {
			// create a local and remote copy of engram
			await this.$store.dispatch('createEngram', this.engramTitle);

			// test
			// console.log(this.$store.state.engrams);

			// go to the actual link programmatically
			this.$router.push({ name: 'Engram', params: { engramTitle: this.engramTitle } });
		},
	},
};
</script>

<style scoped>
/* empty link appearance: cursor, underline, and dark blue*/
.placeholder {
	text-decoration: underline;
	color: red;
	cursor: pointer;
}
</style>
