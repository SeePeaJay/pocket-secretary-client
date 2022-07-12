<template>
	<AppBar />
	<EngramEditor :engram-title="engramTitle" isEditable />
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
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
	methods: {
		...mapMutations(['SET_LAST_COMMITTED_ENGRAM_DATA']),
		...mapActions(['setAbortController', 'fetchEngram', 'cancelPreviousRequest']),
	},
	created() { // TODO: won't be called if engram part of URL changes?
		this.SET_LAST_COMMITTED_ENGRAM_DATA(this.engramTitle);
	},
};
</script>
