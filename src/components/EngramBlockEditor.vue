<template>
	<div v-show="!isOnEditMode" @click="enterEditMode" v-html="blockInPlainHtml"></div>
	<CustomTextarea
		v-show="isOnEditMode"
		ref="customTextarea"
		:engram-title="engramTitle"
		:custom-textarea-index="blockIndex"
		:exit-edit-by-keystroke="exitEditByKeystroke"
		@exit-edit-mode="exitEditMode"
		@edit-previous-block="editPreviousBlock"
		@edit-next-block="editNextBlock"
		@create-and-edit-next-block="createAndEditNextBlock"
		@delete-current-and-edit-previous-block="deleteCurrentAndEditPreviousBlock"
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
	emits: ['editNextBlock', 'editPreviousBlock', 'createAndEditNextBlock', 'deleteCurrentAndEditPreviousBlock'],
	data() {
		return {
			isOnEditMode: false,
			exitEditByKeystroke: false,
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
			this.exitEditByKeystroke = false;

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
			this.exitEditByKeystroke = true;
			this.$emit('createAndEditNextBlock', this.blockIndex, contentForNextBlock);
		},
		deleteCurrentAndEditPreviousBlock(contentForPreviousBlock) {
			this.exitEditByKeystroke = true;
			this.$emit('deleteCurrentAndEditPreviousBlock', this.blockIndex, contentForPreviousBlock);
		},
	},
};
</script>

<style scoped>
div {
	border: solid;
}
</style>
