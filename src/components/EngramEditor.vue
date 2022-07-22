<template>
  <div class="engram-editor-pane">
		<div class="engram-editor-area">
			<EngramBlockEditor
				v-for="(engramBlock, index) in engramBlocks" :key="index"
				:ref="el => { if (el) engramBlockEditors[index] = el }"
				:engram-title="engramTitle"
				:block-index="index"
				:block-content="engramBlock"
				:block-is-editable="engramIsEditable"
				:block-should-have-more-options="engramShouldHaveMoreOptions && index === 0 ? true : false"
				@edit-previous-block="editPreviousBlock"
				@edit-next-block="editNextBlock"
				@create-and-edit-next-block="createAndEditNextBlock"
				@delete-current-and-edit-previous-block="deleteCurrentAndEditPreviousBlock"
				@open-menu="(positionCoordinates) => toggleMenu(positionCoordinates)"
			/>
		</div>
  </div>
	<ContextMenu v-if="contextMenuShouldAppear"
		:x-position="contextMenuPosition.x" :y-position="contextMenuPosition.y"
		@close-menu="toggleMenu()"
		@open-popup="togglePopup()"
	/>
	<AlertPopup v-if="alertPopupShouldAppear"
		:engram-titles-to-delete="[engramTitle]"
		@close-popup="togglePopup(); toggleMenu();"
	/> <!-- get rid of all "floating components" -->
</template>

<script>
import {
	computed, ref, onBeforeUpdate, nextTick,
} from 'vue';
import { useStore } from 'vuex';
import EngramBlockEditor from './EngramBlockEditor.vue';
import ContextMenu from './ContextMenu.vue';
import AlertPopup from './AlertPopup.vue';

export default {
  name: 'EngramEditor',
	components: {
		EngramBlockEditor,
		ContextMenu,
		AlertPopup,
	},
  props: {
		engramTitle: String,
		unauthenticatedEngramBlocks: Array,
		engramIsEditable: Boolean,
		engramShouldHaveMoreOptions: Boolean,
  },
	emits: ['toggleMenu'],
	setup(props) {
		const store = useStore();

		const engramBlockEditors = ref([]);
		const contextMenuShouldAppear = ref(false);
		const contextMenuPosition = ref({
			x: 0,
			y: 0,
		});
		const alertPopupShouldAppear = ref(false);

		const userIsLoggedIn = computed(() => store.getters.userIsLoggedIn);
		const engramBlocks = computed(() => {
			if (userIsLoggedIn.value) {
				return store.getters.engramRootBlocks(props.engramTitle);
			}

			return props.unauthenticatedEngramBlocks;
		});

		function editPreviousBlock(currentBlockIndex, contentForPreviousBlock = null) {
			const previousBlockIndex = currentBlockIndex - 1;

			if (contentForPreviousBlock !== null) { // satisfied if from deleteCurrentAndEditPreviousBlock
				const payload = {
					engramTitle: props.engramTitle,
					blockIndex: previousBlockIndex,
					blockContent: engramBlocks.value[previousBlockIndex] + contentForPreviousBlock,
				};

				store.commit('SET_ENGRAM_BLOCK', payload);
				store.dispatch('setPutEngramRequest', { engramTitle: props.engramTitle, commitMessage: 'auto save' });

				nextTick(() => {
					engramBlockEditors.value[previousBlockIndex].enterEditMode();
				});
			} else {
				engramBlockEditors.value[previousBlockIndex].enterEditMode();
			}
		}

		function editNextBlock(currentBlockIndex, contentForNextBlock = null) {
			const nextBlockIndex = currentBlockIndex + 1;

			if (contentForNextBlock !== null) { // satisfied if from createAndEditNextBlock
				const payload = {
					engramTitle: props.engramTitle,
					blockIndex: nextBlockIndex,
					blockContent: contentForNextBlock,
				};

				store.commit('SET_ENGRAM_BLOCK', payload);
				store.dispatch('setPutEngramRequest', { engramTitle: props.engramTitle, commitMessage: 'auto save' });

				nextTick(() => {
					engramBlockEditors.value[nextBlockIndex].enterEditMode();
				});
			} else {
				engramBlockEditors.value[nextBlockIndex].enterEditMode();
			}
		}

		function createAndEditNextBlock(currentBlockIndex, contentForNextBlock) {
			const payload = {
				engramTitle: props.engramTitle,
				blockIndex: currentBlockIndex + 1,
				blockContent: '',
			};

			store.commit('ADD_ENGRAM_BLOCK', payload);

			nextTick(() => {
				editNextBlock(currentBlockIndex, contentForNextBlock);
			});
		}

		function deleteCurrentAndEditPreviousBlock(currentBlockIndex, contentForPreviousBlock) {
			const payload = {
				engramTitle: props.engramTitle,
				blockIndex: currentBlockIndex,
			};

			store.commit('REMOVE_ENGRAM_BLOCK', payload);

			nextTick(() => {
				editPreviousBlock(currentBlockIndex, contentForPreviousBlock);
			});
			return '';
		}

		function toggleMenu(positionCoordinates = null) {
			contextMenuShouldAppear.value = !contextMenuShouldAppear.value;

			if (positionCoordinates) {
				contextMenuPosition.value.x = positionCoordinates.x;
				contextMenuPosition.value.y = positionCoordinates.y;
			}
		}

		function togglePopup() {
			alertPopupShouldAppear.value = !alertPopupShouldAppear.value;
		}

		// make sure to reset the refs before each update
		onBeforeUpdate(() => {
			engramBlockEditors.value = [];
		});

		return {
			engramBlocks,
			engramBlockEditors,
			contextMenuShouldAppear,
			contextMenuPosition,
			alertPopupShouldAppear,
			editPreviousBlock,
			editNextBlock,
			createAndEditNextBlock,
			deleteCurrentAndEditPreviousBlock,
			toggleMenu,
			togglePopup,
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
	width: 75%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 8px 0 8px;
}
</style>
