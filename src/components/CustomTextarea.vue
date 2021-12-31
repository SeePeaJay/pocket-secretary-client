<template>
	<textarea
    :value="textareaContent"
    ref="textarea"
    rows="1"
		@blur="textareaContent = $event.target.value; $emit('exitEditMode');"
    @focus="resizeTextarea"
    @keyup="resizeTextarea"
		@keydown.up="isAtStartOfTexarea() && !isTheFirstTextarea() && $emit('editPreviousBlock')"
		@keydown.down="isAtEndOfTexarea() && !isTheLastTextarea() && $emit('editNextBlock')"
		@keydown.enter="shouldEnterKeyCreateAndEditNextBlock($event) && createAndEditNextBlock()"
		@keydown.delete="shouldBackspaceKeyDeleteCurrentBlockAndEditPreviousBlock($event) && deleteCurrentBlockAndEditPreviousBlock()"
  >
  </textarea>
</template>

<script>
export default {
	name: 'CustomTextarea',
	props: {
		engramId: Number,
		customTextareaIndex: Number,
	},
	emits: ['exitEditMode', 'editPreviousBlock', 'editNextBlock', 'createAndEditNextBlock', 'deleteCurrentBlockAndEditPreviousBlock'],
	computed: {
		textareaContent: {
			get() {
				return this.$store.state.engrams.find((engram) => engram.id === this.engramId).blocks[this.customTextareaIndex];
			},
			set(value) {
				const payload = {
					engramId: this.engramId,
					blockIndex: this.customTextareaIndex,
					blockContent: value,
				};

				this.$store.commit('updateEngramBlock', payload);
			},
		},
	},
	mounted() {
		this.resizeAndFocus();
	},
	methods: {
		resizeAndFocus() {
			this.resizeTextarea();
			this.$refs.textarea.focus();
		},
		resizeTextarea() {
			const { textarea } = this.$refs;
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		},
		isAtStartOfTexarea() {
			if (this.$refs.textarea.selectionEnd === 0) { // selectionEnd because selected text can end at the start of textarea and if you want to remove said text you shouldn't remove the block
				return true;
			}
			return false;
		},
		isAtEndOfTexarea() {
			if (this.$refs.textarea.selectionEnd === this.textareaContent.length) {
				return true;
			}
			return false;
		},
		isTheFirstTextarea() {
			return this.customTextareaIndex === 0;
		},
		isTheLastTextarea() {
			const totalBlockCount = this.$store.state.engrams.find((engram) => engram.id === this.engramId).blocks.length;

			return this.customTextareaIndex === totalBlockCount - 1;
		},
		shouldEnterKeyCreateAndEditNextBlock($keydownEvent) {
			if ($keydownEvent.keyCode === 13 && !$keydownEvent.shiftKey) {
				$keydownEvent.preventDefault();

				return true;
			}

			return false;
		},
		createAndEditNextBlock() {
			const contentForNextBlock = this.$refs.textarea.value.substring(this.$refs.textarea.selectionStart); // can also use this.textareaContent, but this.$refs.textarea.value is consistent with deleteCurrent...
			this.textareaContent = this.$refs.textarea.value.substring(0, this.$refs.textarea.selectionStart);
			this.$emit('createAndEditNextBlock', contentForNextBlock);
		},
		shouldBackspaceKeyDeleteCurrentBlockAndEditPreviousBlock($keydownEvent) {
			if ($keydownEvent.keyCode === 8 && this.isAtStartOfTexarea() && !this.isTheFirstTextarea()) { // make sure it's actually backspace and not delete key
				$keydownEvent.preventDefault();

				return true;
			}

			return false;
		},
		deleteCurrentBlockAndEditPreviousBlock() {
			const contentForPreviousBlock = this.$refs.textarea.value; // this.textareaContent is not used here because it may be outdated compared to the actual textarea value at this point (textareaContent does not track any changes to the textarea value before this function is called)
			this.textareaContent = ''; // look better?
			this.$emit('deleteCurrentBlockAndEditPreviousBlock', contentForPreviousBlock);
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
</style>
