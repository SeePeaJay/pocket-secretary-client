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

<style scoped>
/*empty link appearance: cursor, underline, and gray*/
.placeholder {
	text-decoration: underline;
	color: gray;
	cursor: pointer;
}
</style>
