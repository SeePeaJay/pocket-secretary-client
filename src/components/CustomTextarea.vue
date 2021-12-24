<template>
	<textarea
    v-model="textareaContent"
    ref="textarea"
    rows="1"
    @focus="resizeTextarea"
    @keyup="resizeTextarea(); this.$emit('textareaContentUpdate', textareaContent);"
  >
  </textarea>
</template>

<script>
export default {
	props: {
		initialTextareaValue: {
			type: String,
			required: true,
		},
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
	},
	mounted() {
		this.resizeTextarea();
	},
};
</script>
