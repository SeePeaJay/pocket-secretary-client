<template>
	<EngramEditor :engram-title="engramTitle"/>
</template>

<script>
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
};
</script>
