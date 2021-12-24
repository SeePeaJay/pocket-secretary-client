<template>
	<div v-show="!isOnEditMode" v-html="blockInPlainHtml" @click="enterEditMode"></div>
	<!-- <textarea v-show="isOnEditMode" v-model="blockContent" ref="textarea" @blur="exitEditMode"  @keyup="resizeTextarea"></textarea> -->
	<CustomTextArea v-show="isOnEditMode" :initial-textarea-value="blockContent" ref="customTextarea" @blur="exitEditMode()" @textarea-content-update="updateBlockContent"/>
</template>

<script>
import Cryptarch from '../cryptarch/cryptarch';
import CustomTextArea from './CustomTextarea.vue';

export default {
	name: 'EditorBlock',
	props: {
    initialBlockContent: String,
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
		enterEditMode() { // make the text area appear AND focus on it
			this.isOnEditMode = !this.isOnEditMode;
			this.$nextTick(() => { // wait for the textarea to show up, then ...
				this.$refs.customTextarea.resizeAndFocus();
      });
		},
		exitEditMode() {
			setTimeout(() => { this.isOnEditMode = !this.isOnEditMode; }, 100); // a timeout is necessary to be able to consistently edit other blocks BEFORE re-rendering the previously editted block; nextTick cannot achieve this I think
		},
		updateBlockContent(textareaContent) {
			this.blockContent = textareaContent;
		},
	},
	components: {
		CustomTextArea,
	},
};
</script>

<style scoped>
textarea {
	border: none;
	overflow: hidden;
	outline: none;

	-webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;

	resize: none; /*remove the resize handle on the bottom right*/

	font-family: Avenir, Helvetica, Arial, sans-serif;
	width: 100%;
}
</style>
