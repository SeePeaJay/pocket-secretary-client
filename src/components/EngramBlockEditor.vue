<template>
	<div v-show="!isOnEditMode" class="test" @click="enterEditMode">
		<component :is="blockHtmlTagName">
			<template v-for="(chunk, index) in blockChunksAsHtmlOrEngramLinks" :key="index">
				<router-link
					v-if="engramLinkRegex.test(chunk)"
					:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(chunk) }}"
				>
					{{ getEngramTitle(chunk) }}
				</router-link>
				<span v-else v-html="chunk"></span>
			</template>
		</component>
	</div>
	<CustomTextarea
		v-show="isOnEditMode"
		ref="customTextarea"
		:engram-title="engramTitle"
		:custom-textarea-index="blockIndex"
		:is-exiting-edit-mode-by-enter-or-delete-key="isExitingEditModeByEnterOrDeleteKey"
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
import { RULES } from '../cryptarch/constants';

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
			isExitingEditModeByEnterOrDeleteKey: false,
			engramLinkRegex: /(\*.+{})/g,
		};
	},
	computed: {
		blockHtmlTagName() {
			if (!this.getBlockContent) {
				return 'p';
			}

			let cryptarch = new Cryptarch();
			const html = cryptarch.decrypt(this.getBlockContent);
			cryptarch = null;

			const domParser = new DOMParser();
			const document = domParser.parseFromString(html, 'text/html');
			return document.body.firstChild.tagName.toLowerCase();
		},
		getBlockContent() {
			return this.$store.state.engrams.find((engram) => engram.title === this.engramTitle).rootBlocks[this.blockIndex];
		},
		blockChunksAsHtmlOrEngramLinks() {
			const blockChunksWithoutBlockMarker = this.getBlockChunksWithoutBlockMarker();
			const blockChunksAsHtmlOrEngramLinks = [];

			console.log(blockChunksWithoutBlockMarker);
			blockChunksWithoutBlockMarker.forEach((chunk) => {
				if (this.engramLinkRegex.test(chunk)) {
					blockChunksAsHtmlOrEngramLinks.push(chunk);
				} else {
					let cryptarch = new Cryptarch();
					const html = cryptarch.decrypt(chunk);
					cryptarch = null; // is there a better way to prevent memory leak than this?

					blockChunksAsHtmlOrEngramLinks.push(html);
				}
			});

			return blockChunksAsHtmlOrEngramLinks;
		},
	},
	methods: {
		getBlockChunksWithoutBlockMarker() {
			const blockContent = this.getBlockContent;

			const matchingBlockMarker = blockContent.match(this.getTitleAndSubtitleMarkerPattern());
			if (matchingBlockMarker) {
				const blockContentWithoutBlockMarker = blockContent.replace(this.getTitleAndSubtitleMarkerPattern(), '');
				return blockContentWithoutBlockMarker.split(this.engramLinkRegex).filter((item) => item);
			}

			return blockContent.split(this.engramLinkRegex).filter((item) => item);
		},
		getTitleAndSubtitleMarkerPattern() {
			const titleAndSubtitlePatterns = [RULES.marker.titleMarker, RULES.marker.level1SubtitleMarker, RULES.marker.level2SubtitleMarker, RULES.marker.level3SubtitleMarker];

			let titleAndSubtitlePatternString = '';
			titleAndSubtitlePatterns.forEach((pattern) => {
				titleAndSubtitlePatternString += `(${pattern.source})|`;
			});
			titleAndSubtitlePatternString = titleAndSubtitlePatternString.slice(0, -1);

			return new RegExp(titleAndSubtitlePatternString, 'g');
		},
		getEngramTitle(engramLink) {
			return engramLink.slice(1, -2);
		},
		enterEditMode() {
			this.isOnEditMode = true;
			this.isExitingEditModeByEnterOrDeleteKey = false;

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
			this.isExitingEditModeByEnterOrDeleteKey = true;
			this.$emit('createAndEditNextBlock', this.blockIndex, contentForNextBlock);
		},
		deleteCurrentAndEditPreviousBlock(contentForPreviousBlock) {
			this.isExitingEditModeByEnterOrDeleteKey = true;
			this.$emit('deleteCurrentAndEditPreviousBlock', this.blockIndex, contentForPreviousBlock);
		},
	},
};
</script>

<style scoped>
/* div {
	display: flex;
	flex: 1 0 auto;
	min-width: 0;
} */

.test{
	border: solid;
}

span >>> * {
	display: inline;
}
</style>
