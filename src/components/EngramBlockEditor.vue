<template>
	<div v-show="!isOnEditMode" @click="enterEditMode" v-html="blockInPlainHtml"></div>
	<CustomTextarea
		v-show="isOnEditMode"
		ref="customTextarea"
		:engram-title="engramTitle"
		:custom-textarea-index="blockIndex"
		@exit-edit-mode="exitEditMode"
		@edit-previous-block="editPreviousBlock"
		@edit-next-block="editNextBlock"
		@create-and-edit-next-block="createAndEditNextBlock"
		@delete-current-block-and-edit-previous-block="deleteCurrentBlockAndEditPreviousBlock"
	/>
</template>

<script>
import Cryptarch from '../cryptarch/cryptarch';
import CustomTextarea from './CustomTextarea.vue';

export default {
	name: 'EngramBlockEditor',
	components: {
		CustomTextarea,
	},
	props: {
		engramTitle: String,
		blockIndex: Number,
  },
	emits: ['editNextBlock', 'editPreviousBlock', 'createAndEditNextBlock', 'deleteCurrentBlockAndEditPreviousBlock'],
	data() {
		return {
			isOnEditMode: false,
		};
	},
	computed: {
		blockInPlainHtml() {
			const blockContent = this.$store.state.engrams.find((engram) => engram.title === this.engramTitle).rootBlocks[this.blockIndex];

			let cryptarch = new Cryptarch();
			const html = cryptarch.decrypt(blockContent);
			cryptarch = null; // is there a better way to prevent memory leak than this?

			return html;
		},
	},
	methods: {
		enterEditMode() {
			this.isOnEditMode = true;

			this.$nextTick(() => { // wait for the textarea to show up, then make the text area appear AND focus on it
				this.$refs.customTextarea.resizeAndFocus();
			});
		},
		exitEditMode() {
			setTimeout(() => { this.isOnEditMode = false; }, 100); // a timeout is necessary to be able to consistently edit other blocks BEFORE re-rendering the previously editted block; nextTick cannot achieve this I think
			// 0 to eliminate variables now
		},
		editPreviousBlock() {
			this.exitEditMode();
			this.$emit('editPreviousBlock', this.blockIndex);
		},
		editNextBlock() {
			this.exitEditMode();
			this.$emit('editNextBlock', this.blockIndex);
		},
		createAndEditNextBlock(contentForNextBlock) {
			this.exitEditMode();
			this.$emit('createAndEditNextBlock', this.blockIndex, contentForNextBlock);
		},
		deleteCurrentBlockAndEditPreviousBlock(contentForPreviousBlock) {
			this.exitEditMode();
			this.$emit('deleteCurrentBlockAndEditPreviousBlock', this.blockIndex, contentForPreviousBlock);
		},
	},
};
</script>

<style scoped>
div {
	border: solid;
}
</style>
