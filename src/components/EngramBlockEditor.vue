<template>
	<CustomTextarea
		v-if="isOnEditMode"
		ref="customTextarea"
		:engram-title="engramTitle"
		:custom-textarea-index="blockIndex"
		:is-exiting-edit-mode-by-enter-or-delete-key="isExitingEditModeByEnterOrDeleteKey"
		@exit-edit-mode="exitEditMode"
		@edit-previous-block="editPreviousBlock"
		@edit-next-block="editNextBlock"
		@create-and-edit-next-block="createAndEditNextBlock"
		@delete-current-and-edit-previous-block="deleteCurrentAndEditPreviousBlock"
	/>
	<RenderedEngramBlock
		v-else
		:blockContent="$store.state.engrams.find((engram) => engram.title === this.engramTitle).rootBlocks[this.blockIndex]"
		@click="enterEditMode"
	/>
</template>

<script>
import CustomTextarea from './CustomTextarea.vue';
import RenderedEngramBlock from './RenderedEngramBlock.vue';

export default {
	name: 'EngramBlockEditor',
	components: {
		CustomTextarea,
		RenderedEngramBlock,
	},
	props: {
		engramTitle: String,
		blockIndex: Number,
  },
	emits: ['editNextBlock', 'editPreviousBlock', 'createAndEditNextBlock', 'deleteCurrentAndEditPreviousBlock'],
	data() {
		return {
			isOnEditMode: false,
			isExitingEditModeByEnterOrDeleteKey: false,
		};
	},
	methods: {
		enterEditMode() {
			this.isOnEditMode = true;
			this.isExitingEditModeByEnterOrDeleteKey = false;

			this.$nextTick(() => { // wait for the textarea to show up, then make the text area appear AND focus on it
				this.$refs.customTextarea.resizeAndFocus(); // triggers onBlur
			});
		},
		exitEditMode() { // convert textarea back to div
			setTimeout(() => { this.isOnEditMode = false; }, 100); // a timeout is necessary to be able to consistently edit other blocks BEFORE re-rendering the previously editted block; nextTick was not able to achieve this
		},
		editPreviousBlock() {
			this.$emit('editPreviousBlock', this.blockIndex);
		},
		editNextBlock() {
			this.$emit('editNextBlock', this.blockIndex);
		},
		createAndEditNextBlock(contentForNextBlock) {
			this.isExitingEditModeByEnterOrDeleteKey = true;
			this.$emit('createAndEditNextBlock', this.blockIndex, contentForNextBlock);
		},
		deleteCurrentAndEditPreviousBlock(contentForPreviousBlock) {
			this.isExitingEditModeByEnterOrDeleteKey = true;
			this.$emit('deleteCurrentAndEditPreviousBlock', this.blockIndex, contentForPreviousBlock);
		},
	},
};
</script>
