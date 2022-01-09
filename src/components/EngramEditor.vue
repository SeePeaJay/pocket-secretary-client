<template>
  <div class="engram-editor-pane">
		<div class="engram-editor-area">
			<EngramBlockEditor
				v-for="(engramBlock, index) in engramBlocks" :key="index"
				:ref="el => { if (el) engramBlockEditors[index] = el }"
				:engram-title="engramTitle"
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
import EngramBlockEditor from './EngramBlockEditor.vue';

export default {
  name: 'EngramEditor',
	components: {
		EngramBlockEditor,
	},
  props: {
		engramTitle: String,
  },
	setup(props) {
		const store = useStore();

		const engramBlockEditors = ref([]);
		const engramBlocks = computed(() => store.getters.engramRootBlocks(props.engramTitle));

		function editPreviousBlock(currentBlockIndex, contentForPreviousBlock = null) {
			if (currentBlockIndex > 0) { // make sure current block is not the first one
				const previousBlockIndex = currentBlockIndex - 1;

				if (contentForPreviousBlock !== null) { // comes from deleteCurrentBlockAndEditPreviousBlock
					const payload = {
						engramTitle: props.engramTitle,
						blockIndex: previousBlockIndex,
						blockContent: engramBlocks.value[previousBlockIndex] + contentForPreviousBlock,
					};

					store.commit('updateEngramBlock', payload);

					nextTick(() => {
						engramBlockEditors.value[previousBlockIndex].enterEditMode();
					});
				} else {
					engramBlockEditors.value[previousBlockIndex].enterEditMode();
				}
			}
		}

		function editNextBlock(currentBlockIndex, contentForNextBlock = null) {
			if (currentBlockIndex < engramBlocks.value.length - 1) { // make sure current block is not the last one, as 'next block' would not exist
				const nextBlockIndex = currentBlockIndex + 1;

				if (contentForNextBlock !== null) { // comes from createAndEditNextBlock
					const payload = {
						engramTitle: props.engramTitle,
						blockIndex: nextBlockIndex,
						blockContent: contentForNextBlock,
					};

					store.commit('updateEngramBlock', payload);

					nextTick(() => {
						engramBlockEditors.value[nextBlockIndex].enterEditMode();
					});
				} else {
					engramBlockEditors.value[nextBlockIndex].enterEditMode();
				}
			}
		}

		function createAndEditNextBlock(currentBlockIndex, contentForNextBlock) {
			const payload = {
				engramTitle: props.engramTitle,
				blockIndex: currentBlockIndex + 1,
				blockContent: '',
			};

			store.commit('createEngramBlock', payload);

			nextTick(() => {
				editNextBlock(currentBlockIndex, contentForNextBlock);
			});
		}

		function deleteCurrentBlockAndEditPreviousBlock(currentBlockIndex, contentForPreviousBlock) {
			const payload = {
				engramTitle: props.engramTitle,
				blockIndex: currentBlockIndex,
			};

			store.commit('deleteEngramBlock', payload);

			nextTick(() => {
				editPreviousBlock(currentBlockIndex, contentForPreviousBlock);
			});
			return '';
		}

		// make sure to reset the refs before each update
		onBeforeUpdate(() => {
			engramBlockEditors.value = [];
		});

		return {
			engramBlocks,
			engramBlockEditors,
			editPreviousBlock,
			editNextBlock,
			createAndEditNextBlock,
			deleteCurrentBlockAndEditPreviousBlock,
		};
	},
};
</script>

<style scoped>
.engram-editor-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.engram-editor-area{
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 8px 0 8px;
}
</style>
