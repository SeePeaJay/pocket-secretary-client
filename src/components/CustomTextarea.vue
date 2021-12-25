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
		@keydown.delete="isAtStartOfTexarea && $emit('removeCurrentBlockAndEditPreviousBlock')"
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
			if (this.$refs.textarea.selectionStart === 0) {
				return true;
			}

			return false;
		},
		isAtEndOfTexarea() {
			if (this.$refs.textarea.selectionStart === this.textareaContent.length) {
				return true;
			}

			return false;
		},
		createAndEditNextBlock() {
			const nextBlockContent = this.textareaContent.substring(this.$refs.textarea.selectionStart);
			this.textareaContent = this.textareaContent.substring(0, this.$refs.textarea.selectionStart);

			this.$emit('createAndEditNextBlock', this.textareaContent, nextBlockContent);
		},
		isTheFirstTextarea() {
			return this.customTextareaIndex === 0;
		},
		isTheLastTextarea() {
			return this.customTextareaIndex === this.totalCustomTextareaCount - 1;
		},
	},
	emits: ['textareaContentUpdate', 'editNextBlock', 'editPreviousBlock', 'exitEditMode', 'createAndEditNextBlock', 'removeCurrentBlockAndEditPreviousBlock'],
	mounted() {
		this.resizeAndFocus();
		// this.resizeTextarea();
	},
};
</script>
