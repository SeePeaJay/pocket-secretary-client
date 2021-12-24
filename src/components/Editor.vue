<template>
  <div class="editor-pane">
		<div class="editor-area">
			<EditorBlock v-for="engramBlock in engramBlocks" :key="engramBlock" :initial-block-content="engramBlock"/>
		</div>
  </div>
</template>

<script>
import { RULES } from '../cryptarch/constants';
import EditorBlock from './EditorBlock.vue';

export default {
  name: 'Editor',
  props: {
    engram: String,
  },
	computed: {
		// engramInPlainHtmlArray() {
		// 	let cryptarch = new Cryptarch();
		// 	const html = cryptarch.decrypt(this.engram);
		// 	cryptarch = null; // is there a better way to prevent memory leak than this?
		// 	return html;
		// },
		engramBlocks() {
			return this.engram.split(RULES.rootBlockSeparator);
		},
	},
	components: {
		EditorBlock,
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.editor-area{
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}
</style>
