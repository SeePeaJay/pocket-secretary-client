<template>
  <div class="editor-pane">
		<div class="editor-area">
			<EditorBlock
				v-for="(engramBlock, index) in engramBlocks"
				:key="engramBlock"
				:ref="el => { if (el) editorBlocks[index] = el }"
				:block-index="index"
				:initial-block-content="engramBlock"
				:total-block-count="engramBlocks.length"
				@edit-previous-block="editPreviousBlock"
				@edit-next-block="editNextBlock"
				@create-and-edit-next-block="createAndEditNextBlock"
				@delete-current-block-and-edit-previous-block="deleteCurrentBlockAndEditPreviousBlock"
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

		function editPreviousBlock(currentBlockIndex, contentForPreviousBlock = null) {
			if (currentBlockIndex > 0) { // make sure current block is not the first one
				const previousBlockIndex = currentBlockIndex - 1;

				editorBlocks.value[previousBlockIndex].enterEditMode();

				if (contentForPreviousBlock) {
					editorBlocks.value[previousBlockIndex].blockContent += contentForPreviousBlock;
				}
			}

			console.log(engramBlocks.value); // answering above q: seems like it?
		}

		function editNextBlock(currentBlockIndex, contentForNextBlock = null) {
			if (currentBlockIndex < engramBlocks.value.length - 1) { // make sure current block is not the last one
				nextTick(() => {
					const nextBlockIndex = currentBlockIndex + 1;

					editorBlocks.value[nextBlockIndex].enterEditMode();

					console.log(contentForNextBlock);

					// if (contentForNextBlock) {
					// 	editorBlocks.value[nextBlockIndex].blockContent = contentForNextBlock;
					// 	// nextTick(() => {
					// 	// 	editorBlocks.value[currentBlockIndex + 1].blockContent = contentForNextBlock;
					// 	// 	console.log(editorBlocks.value[currentBlockIndex + 1].blockContent);
					// 	// });
					// }
				});
			}

			console.log(engramBlocks.value); // answering above q: seems like it?
		}

		function createAndEditNextBlock(currentBlockIndex, contentForNextBlock) {
			const currentEngramBlock = engramBlocks.value[currentBlockIndex];
			engramBlocks.value[currentBlockIndex] = currentEngramBlock.substring(0, currentEngramBlock.length - contentForNextBlock.length);

			if (currentBlockIndex !== engramBlocks.value.length - 1) {
				engramBlocks.value.splice(currentBlockIndex + 1, 0, contentForNextBlock);
			} else {
				engramBlocks.value.push(contentForNextBlock);
			}

			nextTick(() => {
				// console.log(editorBlocks.value[currentBlockIndex + 1].blockContent);
				// console.log(engramBlocks.value[currentBlockIndex + 1]);
				editNextBlock(currentBlockIndex, contentForNextBlock);
				console.log(engramBlocks.value); // answering above q: seems like it?
				// console.log(currentEngramBlock);
			});
		}

		function deleteCurrentBlockAndEditPreviousBlock(currentBlockIndex, contentForPreviousBlock) {
			if (currentBlockIndex > 0) {
				engramBlocks.value[currentBlockIndex - 1] += contentForPreviousBlock;
			}

			engramBlocks.value.splice(currentBlockIndex, 1); // same as above - set value for previous??

			nextTick(() => {
				// console.log(editorBlocks.value[currentBlockIndex - 1].blockContent);
				// console.log(engramBlocks.value[currentBlockIndex - 1]);
				editPreviousBlock(currentBlockIndex, contentForPreviousBlock);
				console.log(engramBlocks.value);
			});

			return '';
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
			deleteCurrentBlockAndEditPreviousBlock,
		};
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
