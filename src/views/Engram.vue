<template>
	<AppBar />
	<EngramEditor
		:engram-title="engramTitle"
		engramIsEditable
		:engram-should-have-more-options="engramTitle !== 'Starred' ? true : false"
	/>
</template>

<script>
// import { mapMutations } from 'vuex';
import AppBar from '../components/AppBar.vue';
import EngramEditor from '../components/EngramEditor.vue';

export default {
	name: 'Engram',
	components: {
		AppBar,
		EngramEditor,
  },
	computed: {
		engramTitle() {
			return this.$route.params.engramTitle;
		},
	},
};
</script>
