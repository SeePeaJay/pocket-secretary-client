<template>
  <div class="editor-pane">
		<div class="editor-area">
			<EditorBlock
				v-for="(engramBlock, index) in engramBlocks" :key="index"
				:ref="el => { if (el) editorBlocks[index] = el }"
				:engram-id="engramId"
				:block-index="index"
				@edit-previous-block="editPreviousBlock"
				@edit-next-block="editNextBlock"
				@create-and-edit-next-block="createAndEditNextBlock"
				@delete-current-block-and-edit-previous-block="deleteCurrentBlockAndEditPreviousBlock"
			/>
		</div>
  </div>
</template>

<script>
import {
	computed, ref, onBeforeUpdate, nextTick,
} from 'vue';
import { useStore } from 'vuex';
// import { RULES } from '../cryptarch/constants';
import EditorBlock from './EditorBlock.vue';

export default {
  name: 'Editor',
  props: {
		engramId: Number,
  },
	setup(props) {
		const store = useStore();

		const engramBlocks = computed(() => store.state.engrams.find((engram) => engram.id === props.engramId).blocks);
		const editorBlocks = ref([]);

		function editPreviousBlock(currentBlockIndex, contentForPreviousBlock = null) {
			if (currentBlockIndex > 0) { // make sure current block is not the first one
				const previousBlockIndex = currentBlockIndex - 1;

				if (contentForPreviousBlock !== null) { // comes from deleteCurrentBlockAndEditPreviousBlock
					// const currentBlockContent = engramBlocks
					const payload = {
						engramId: props.engramId,
						blockIndex: previousBlockIndex,
						blockContent: engramBlocks.value[previousBlockIndex] + contentForPreviousBlock,
					};

					store.commit('updateEngramBlock', payload);

					nextTick(() => {
						editorBlocks.value[previousBlockIndex].enterEditMode();
					});
				} else {
					editorBlocks.value[previousBlockIndex].enterEditMode();
				}
			}
		}

		function editNextBlock(currentBlockIndex, contentForNextBlock = null) {
			if (currentBlockIndex < engramBlocks.value.length - 1) { // make sure current block is not the last one, as 'next block' would not exist
				const nextBlockIndex = currentBlockIndex + 1;

				if (contentForNextBlock !== null) { // comes from createAndEditNextBlock
					const payload = {
						engramId: props.engramId,
						blockIndex: nextBlockIndex,
						blockContent: contentForNextBlock,
					};

					store.commit('updateEngramBlock', payload);

					nextTick(() => {
						editorBlocks.value[nextBlockIndex].enterEditMode();
					});
				} else {
					editorBlocks.value[nextBlockIndex].enterEditMode();
				}
			}
		}

		function createAndEditNextBlock(currentBlockIndex, contentForNextBlock) {
			const payload = {
				engramId: props.engramId,
				blockIndex: currentBlockIndex + 1,
				blockContent: '',
			};

			store.commit('createEngramBlock', payload);

			// console.log(`currentBlockIndex at Editor: ${currentBlockIndex}`);
			// console.log(engramBlocks.value);

			nextTick(() => {
				editNextBlock(currentBlockIndex, contentForNextBlock);
			});

			// nextTick(() => {
			// 	// console.log(editorBlocks.value[currentBlockIndex + 1].blockContent);
			// 	// console.log(engramBlocks.value[currentBlockIndex + 1]);
			// 	editNextBlock(currentBlockIndex);
			// 	// console.log(engramBlocks.value); // answering above q: seems like it?
			// 	// console.log(currentEngramBlock);
			// });
		}

		function deleteCurrentBlockAndEditPreviousBlock(currentBlockIndex, contentForPreviousBlock) {
			const payload = {
				engramId: props.engramId,
				blockIndex: currentBlockIndex,
			};

			store.commit('deleteEngramBlock', payload);

			nextTick(() => {
				// console.log(editorBlocks.value[currentBlockIndex - 1].blockContent);
				// console.log(engramBlocks.value[currentBlockIndex - 1]);
				editPreviousBlock(currentBlockIndex, contentForPreviousBlock);
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
