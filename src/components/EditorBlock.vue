<template>
	<div v-show="!isOnEditMode" v-html="blockInPlainHtml" @click="enterEditMode"></div>
	<!-- <textarea v-show="isOnEditMode" v-model="blockContent" ref="textarea" @blur="exitEditMode"  @keyup="resizeTextarea"></textarea> -->
	<CustomTextarea
		v-show="isOnEditMode"
		:initial-textarea-value="blockContent"
		:custom-textarea-index="blockIndex"
		:total-custom-textarea-count="totalBlockCount"
		ref="customTextarea"
		@textarea-content-update="updateBlockContent"
		@edit-previous-block="editPreviousBlock"
		@edit-next-block="editNextBlock"
		@create-and-edit-next-block="createAndEditNextBlock"
		@exit-edit-mode="exitEditMode"
		@delete-current-block-and-edit-previous-block="deleteCurrentBlockAndEditPreviousBlock"
	/>
</template>

<script>
import Cryptarch from '../cryptarch/cryptarch';
import CustomTextarea from './CustomTextarea.vue';

export default {
	name: 'EditorBlock',
	props: {
		blockIndex: Number,
    initialBlockContent: String,
		totalBlockCount: Number,
  },
	data() {
		return {
			isOnEditMode: false,
			blockContent: this.initialBlockContent,
		};
	},
	computed: {
		blockInPlainHtml() {
			let cryptarch = new Cryptarch();
			const html = cryptarch.decrypt(this.blockContent);
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
		updateBlockContent(textareaContent) {
			this.blockContent = textareaContent;
		},
		editPreviousBlock() {
			this.exitEditMode();
			this.$emit('editPreviousBlock', this.blockIndex);
		},
		editNextBlock() {
			this.exitEditMode();
			this.$emit('editNextBlock', this.blockIndex);
		},
		createAndEditNextBlock(currentBlockContent, contentForNextBlock) {
			this.blockContent = currentBlockContent;
			this.exitEditMode();
			this.$emit('createAndEditNextBlock', this.blockIndex, contentForNextBlock);
		},
		deleteCurrentBlockAndEditPreviousBlock(contentForPreviousBlock) {
			this.blockContent = '';
			this.exitEditMode();
			this.$emit('deleteCurrentBlockAndEditPreviousBlock', this.blockIndex, contentForPreviousBlock);
		},
	},
	emits: ['editNextBlock', 'editPreviousBlock', 'createAndEditNextBlock', 'deleteCurrentBlockAndEditPreviousBlock'],
	components: {
		CustomTextarea,
	},
	watch: {
		blockContent(newVal) {
			this.$refs.customTextarea.textareaContent = newVal;
		},
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
