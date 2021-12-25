<template>
  <div class="editor-pane">
		<div class="editor-area">
			<EditorBlock
				v-for="(engramBlock, index) in engramBlocks"
				:key="engramBlock"
				:initial-block-content="engramBlock"
				:block-index="index"
				:total-block-count="engramBlocks.length"
				:ref="el => { if (el) editorBlocks[index] = el }"
				@edit-previous-block="editPreviousBlock"
				@edit-next-block="editNextBlock"
				@create-and-edit-next-block="createAndEditNextBlock"
			/>
		</div>
  </div>
</template>

<script>
import { ref, onBeforeUpdate, nextTick } from 'vue';
import { RULES } from '../cryptarch/constants';
import EditorBlock from './EditorBlock.vue';

export default {
  name: 'Editor',
  props: {
    engram: String,
  },
	setup(props) {
		const engramBlocks = ref(props.engram.split(RULES.rootBlockSeparator));
		const editorBlocks = ref([]);

		function editPreviousBlock(currentBlockIndex) {
			if (currentBlockIndex > 0) {
				editorBlocks.value[currentBlockIndex - 1].enterEditMode();
			}
		}

		function editNextBlock(currentBlockIndex, nextBlockContent) {
			// console.log(editorBlocks.value);
			if (currentBlockIndex < engramBlocks.value.length - 1) {
				editorBlocks.value[currentBlockIndex + 1].enterEditMode();

				if (nextBlockContent) {
					editorBlocks.value[currentBlockIndex + 1].blockContent = nextBlockContent;
					// nextTick(() => {
					// 	editorBlocks.value[currentBlockIndex + 1].blockContent = nextBlockContent;
					// 	console.log(editorBlocks.value[currentBlockIndex + 1].blockContent);
					// });
				}
			}
		}

		function createAndEditNextBlock(currentBlockIndex, nextBlockContent) {
			if (currentBlockIndex !== engramBlocks.value.length - 1) {
				engramBlocks.value.splice(currentBlockIndex + 1, 0, '');
			} else {
				engramBlocks.value.push('');
			}

			nextTick(() => {
				console.log(editorBlocks.value[currentBlockIndex + 1].blockContent);
				console.log(engramBlocks.value[currentBlockIndex + 1]);
				editNextBlock(currentBlockIndex, nextBlockContent);
			});
		}

		// make sure to reset the refs before each update
		onBeforeUpdate(() => {
			editorBlocks.value = [];
		});

		return {
			engramBlocks,
			editorBlocks,
			editPreviousBlock,
			editNextBlock,
			createAndEditNextBlock,
		};
	},
	// data() {
	// 	return {
	// 		engramBlocks: this.engram.split(RULES.rootBlockSeparator),
	// 	};
	// },
	// computed: {
		// engramInPlainHtmlArray() {
		// 	let cryptarch = new Cryptarch();
		// 	const html = cryptarch.decrypt(this.engram);
		// 	cryptarch = null; // is there a better way to prevent memory leak than this?
		// 	return html;
		// },
		// engramBlocks() {
		// 	return this.engram.split(RULES.rootBlockSeparator);
		// },
	// },
	// methods: {
		// editPreviousBlock(currentBlockIndex) {
		// 	if (currentBlockIndex > 0) {
		// 		this.$refs.editorBlocks[currentBlockIndex - 1].enterEditMode();
		// 	}
		// },
		// editNextBlock(currentBlockIndex) {
		// 	if (currentBlockIndex < this.engramBlocks.length - 1) {
		// 		this.$refs.editorBlocks[currentBlockIndex + 1].enterEditMode();
		// 	}
		// },
		// createAndEditNextBlock(currentBlockIndex) {
		// 	if (currentBlockIndex !== this.engramBlocks.length - 1) {
		// 		this.engramBlocks.splice(currentBlockIndex + 1, 0, '');
		// 	} else {
		// 		this.engramBlocks.push('');
		// 	}

		// 	this.editNextBlock(currentBlockIndex);

			// this.editorBlocks = 'editorBlock';
			// this.$nextTick(() => {
			// 	console.log(this.$refs[`editorBlock${currentBlockIndex}`]);
			// });

			// this.$nextTick(() => {
			// 	this.renderComponent = true;

			// 	console.log(this.$refs.editorBlocks[currentBlockIndex + 1].blockContent);
			// 	console.log(this.engramBlocks[currentBlockIndex + 1]);
			// 	this.$refs.editorBlocks[currentBlockIndex + 1].enterEditMode();
			// });

			// setTimeout(() => {
			// 	this.renderComponent = true;

			// 	console.log(this.$refs.editorBlock[currentBlockIndex + 1].blockContent);
			// 	console.log(this.engramBlock[currentBlockIndex + 1]);
			// 	this.$refs.editorBlock[currentBlockIndex + 1].enterEditMode();
			// }, 1000);
		// },
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
