<template>
	<router-link
		v-if="engramDoesExist"
		:to="{ name: 'Engram', params: { engramTitle } }"
	>
		{{ engramTitle }}
	</router-link>
	<span v-else class="placeholder" @click="createAndGoToEngram">
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
		createAndGoToEngram() {
			// call createEngram from store
		},
	},
};
</script>

<style scoped>
/* want empty link appearance */
.placeholder {
}
</style>
