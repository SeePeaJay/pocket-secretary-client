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
// import axios from 'axios';
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
		// const currentInstance = getCurrentInstance();

		const store = useStore();

		// console.log(props.engramTitle);

		const engramBlockEditors = ref([]);
		// console.log(props.engramTitle);
		console.log(store.state.engrams);
		const targetCopy = Object.assign({}, store.state.engrams);
		console.log(store.state.engrams);
		console.log(targetCopy);
		// console.log(store.state.engrams.find((engram) => engram.title === props.engramTitle).rootBlocks);
		// console.log(store.getters.engramRootBlocks(store.state)(props.engramTitle));

		console.log(props.engramTitle);
		const engramBlocks = computed(() => store.getters.engramRootBlocks(props.engramTitle));

		console.log(engramBlocks.value);

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

		// onMounted(async () => {
		// 	const response = await axios.get(`http://localhost:3000/engrams/${encodeURIComponent(props.engramTitle)}`, { withCredentials: true });

		// 	store.commit('setEngram', response.data);

		// 	console.log(response.data);
		// });

		// onBeforeMount(async () => {
    //   const response = await axios.get(`http://localhost:3000/engrams/${encodeURIComponent(props.engramTitle)}`, { withCredentials: true });

		// 	store.commit('setEngram', response.data);

		// 	console.log(response.data);
		// });

		// make sure to reset the refs before each update
		onBeforeUpdate(() => {
			engramBlockEditors.value = [];
		});

		// 	store.commit('setEngram', response.data);
		// 	console.log('jijo');
    // });

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
