<template>
	<textarea
    :value="textareaContent"
    ref="textarea"
    rows="1"
		@blur="textareaContent = $event.target.value; $emit('exitEditMode');"
    @focus="resizeTextarea"
    @keyup="resizeTextarea"
		@keydown.up="isAtStartOfTexarea() && !isTheFirstTextarea() && editPreviousBlock()"
		@keydown.down="isAtEndOfTexarea() && !isTheLastTextarea() && editNextBlock()"
		@keydown.enter="shouldEnterKeyCreateAndEditNextBlock($event) && createAndEditNextBlock()"
		@keydown.delete="shouldBackspaceKeyDeleteCurrentBlockAndEditPreviousBlock($event) && deleteCurrentBlockAndEditPreviousBlock()"
  >
  </textarea>
</template>

<script>
export default {
	props: {
		engramId: Number,
		customTextareaIndex: Number,
	},
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

				// const { engramId } = this;
				// const blockIndex = this.customTextareaIndex;
				// const blockContent = value;

				// console.log(`engramId at custom: ${engramId}`);
				// console.log(`customTextareaIndex at custom: ${customTextareaIndex}`);
				// console.log(`value at custom: ${value}`);

				this.$store.commit('updateEngramBlock', payload);

				// console.log(`engramId at custom: ${engramId}`);
				// console.log(`customTextareaIndex at custom: ${customTextareaIndex}`);
				// console.log(`value at custom: ${value}`);
			},
		},
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
		editPreviousBlock() {
			this.$emit('editPreviousBlock');
		},
		editNextBlock() {
			// this.textareaContent = this.textareaContent.slice(0, -1);
			this.$emit('editNextBlock');
		},
		shouldEnterKeyCreateAndEditNextBlock($keydownEvent) {
			// console.log($keydownEvent);

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
	emits: ['exitEditMode', 'editPreviousBlock', 'editNextBlock', 'createAndEditNextBlock', 'deleteCurrentBlockAndEditPreviousBlock'],
	mounted() {
		this.resizeAndFocus();
	},
};
</script>
