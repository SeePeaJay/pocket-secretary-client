<template>
	<div v-show="!isOnEditMode" v-html="blockInPlainHtml" @click="enterEditMode"></div>
	<CustomTextarea
		v-show="isOnEditMode"
		ref="customTextarea"
		:engramId="engramId"
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
	name: 'EditorBlock',
	props: {
		engramId: Number,
		blockIndex: Number,
  },
	data() {
		return {
			isOnEditMode: false,
		};
	},
	computed: {
		blockInPlainHtml() {
			const blockContent = this.$store.state.engrams.find((engram) => engram.id === this.engramId).blocks[this.blockIndex];

			let cryptarch = new Cryptarch();
			const html = cryptarch.decrypt(blockContent);
			cryptarch = null; // is there a better way to prevent memory leak than this?

			return html;
		},
		engramContent() {
			return this.$store.state.engrams.find((engram) => engram.id === this.engramId).blocks[this.customTextareaIndex];
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
			// console.log(`this block index at editor block: ${this.blockIndex}`);
			this.$emit('createAndEditNextBlock', this.blockIndex, contentForNextBlock);
		},
		deleteCurrentBlockAndEditPreviousBlock(contentForPreviousBlock) {
			this.exitEditMode();
			this.$emit('deleteCurrentBlockAndEditPreviousBlock', this.blockIndex, contentForPreviousBlock);
		},
	},
	watch: {
		engramContent(newVal) {
			console.log(newVal);
			console.log(`isOneditmode: ${this.isOnEditMode}`);
		},
	},
	emits: ['editNextBlock', 'editPreviousBlock', 'createAndEditNextBlock', 'deleteCurrentBlockAndEditPreviousBlock'],
	components: {
		CustomTextarea,
	},
};
</script>

<style scoped>
textarea {
	border: none;
	overflow: hidden; /* prevent the scrollbar from appearing at all (auto can still lead to very brief appearances) */
	outline: none;

	-webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;

	resize: none; /*remove the resize handle on the bottom right*/

	font-family: Avenir, Helvetica, Arial, sans-serif;
	width: 100%;
}

div {
	/* display: flex;
	flex-direction: column; */
	border: solid;
}
</style>
