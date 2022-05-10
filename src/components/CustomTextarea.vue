<template>
	<textarea
    v-model="textareaContent"
    ref="textarea"
    rows="1"
		@blur="onBlurHandler();"
    @focus="resizeTextarea"
    @keyup="resizeTextarea"
		@keydown.up="isAtStartOfTexarea() && !isTheFirstTextarea() && $emit('editPreviousBlock')"
		@keydown.down="isAtEndOfTexarea() && !isTheLastTextarea() && $emit('editNextBlock')"
		@keydown.enter="shouldEnterKeyCreateAndEditNextBlock($event) && createAndEditNextBlock()"
		@keydown.delete="shouldDeleteKeyDeleteCurrentAndEditPreviousBlock($event) && deleteCurrentAndEditPreviousBlock();"
  >
  </textarea>
</template>

<script>
export default {
	name: 'CustomTextarea',
	props: {
		engramTitle: String,
		customTextareaIndex: Number,
		isExitingEditModeByEnterOrDeleteKey: Boolean,
	},
	emits: ['exitEditMode', 'editPreviousBlock', 'editNextBlock', 'createAndEditNextBlock', 'deleteCurrentAndEditPreviousBlock'],
	computed: {
		textareaContent: {
			get() {
				return this.$store.state.engrams.find((engram) => engram.title === this.engramTitle).rootBlocks[this.customTextareaIndex];
			},
			set(value) {
				const payload = {
					engramTitle: this.engramTitle,
					blockIndex: this.customTextareaIndex,
					blockContent: value,
				};

				this.$store.commit('SET_ENGRAM_BLOCK', payload);
			},
		},
	},
	mounted() {
		this.resizeAndFocus();
	},
	methods: {
		msg(obj) {
			console.log(obj);
		},
		onBlurHandler() {
			this.$emit('exitEditMode');

			if (!this.isExitingEditModeByEnterOrDeleteKey && this.isCurrentEngramBlockUpdated()) { // shouldn't be satisfied if exit by enter key
				this.$store.dispatch('setPutEngramRequestAndLastCommittedEngramData', this.engramTitle);
			}
		},
		isCurrentEngramBlockUpdated() {
			return this.textareaContent !== this.$store.state.lastCommittedEngramData.rootBlocks[this.customTextareaIndex];
		},
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
			if (this.$refs.textarea.selectionEnd === 0) { // selectionEnd because selected text can end at start of textarea and if you want to remove said text you shouldn't remove the block
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
			const totalBlockCount = this.$store.state.engrams.find((engram) => engram.title === this.engramTitle).rootBlocks.length;

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
		shouldDeleteKeyDeleteCurrentAndEditPreviousBlock($keydownEvent) {
			if ($keydownEvent.keyCode === 8 && this.isAtStartOfTexarea() && !this.isTheFirstTextarea()) { // make sure it's actually backspace and not delete key
				$keydownEvent.preventDefault();

				return true;
			}

			return false;
		},
		deleteCurrentAndEditPreviousBlock() {
			const contentForPreviousBlock = this.$refs.textarea.value; // this.textareaContent is not used here because it may be outdated compared to the actual textarea value at this point (textareaContent does not track any changes to the textarea value before this function is called)
			this.textareaContent = ''; // look better?
			this.$emit('deleteCurrentAndEditPreviousBlock', contentForPreviousBlock);
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
