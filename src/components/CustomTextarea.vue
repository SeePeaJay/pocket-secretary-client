<template>
	<textarea
    v-model="textareaContent"
    ref="textarea"
    rows="1"
		@blur="$emit('exitEditMode')"
    @focus="resizeTextarea"
    @keyup="resizeTextarea(); $emit('textareaContentUpdate', textareaContent);"
		@keydown.up="isAtStartOfTexarea() && !isTheFirstTextarea() && editPreviousBlock()"
		@keydown.down="isAtEndOfTexarea() && !isTheLastTextarea() && editNextBlock()"
		@keydown.enter="createAndEditNextBlock"
		@keydown.delete="isAtStartOfTexarea() && !isTheFirstTextarea() && deleteCurrentBlockAndEditPreviousBlock()"
  >
  </textarea>
</template>

<script>
export default {
	props: {
		customTextareaIndex: Number,
		initialTextareaValue: {
			type: String,
			required: true,
		},
		totalCustomTextareaCount: Number,
	},
	data() {
		return {
			textareaContent: this.initialTextareaValue,
		};
	},
	methods: {
		resizeAndFocus() {
			this.resizeTextarea();
			this.$refs.textarea.focus();
		},
		resizeTextarea() {
			const { textarea } = this.$refs;
			textarea.style.height = `${textarea.scrollHeight}px`;
		},
		editPreviousBlock() {
			this.$emit('editPreviousBlock');
		},
		editNextBlock() {
			// this.textareaContent = this.textareaContent.slice(0, -1);
			this.$emit('editNextBlock');
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
		createAndEditNextBlock() {
			setTimeout(() => { // a timeout is necessary for \n to deposit in this textarea first, then take that character away and emit the event
				const contentForNextBlock = this.textareaContent.substring(this.$refs.textarea.selectionStart);
				this.textareaContent = this.textareaContent.substring(0, this.$refs.textarea.selectionStart - 1);

				this.$emit('createAndEditNextBlock', this.textareaContent, contentForNextBlock);
			}, 12);

			// this.textareaContent = this.textareaContent.substring(0, this.$refs.textarea.selectionStart);
		},
		isTheFirstTextarea() {
			return this.customTextareaIndex === 0;
		},
		isTheLastTextarea() {
			return this.customTextareaIndex === this.totalCustomTextareaCount - 1;
		},
		deleteCurrentBlockAndEditPreviousBlock() {
			setTimeout(() => { // a timeout is necessary for the backspace to occur in this textarea first, then emit the event
				const contentForPreviousBlock = this.textareaContent;
				this.textareaContent = '';

				this.$emit('deleteCurrentBlockAndEditPreviousBlock', contentForPreviousBlock);
			}, 12);
		},
	},
	emits: ['textareaContentUpdate', 'editNextBlock', 'editPreviousBlock', 'exitEditMode', 'createAndEditNextBlock', 'deleteCurrentBlockAndEditPreviousBlock'],
	mounted() {
		this.resizeAndFocus();
		// this.resizeTextarea();
	},
	watch: {
		textareaContent(newVal) {
			console.log(`Textarea content:${newVal}`);
		},
	},
};
</script>
