<template>
	<router-link
		v-if="engramDoesExist"
		:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(chunk) } }"
	>
	</router-link>
	<span v-else class="placeholder" @click="createAndGoToEngram">
	</span>
</template>

<script>
export default {
	name: 'EngramLink',
	props: {
  },
};
</script>

<style scoped>
/* want empty link appearance */
.placeholder {
}
</style>
