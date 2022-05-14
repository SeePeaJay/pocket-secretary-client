<template>
	<div class="test">
		<component :is="blockHtmlTagName">
			<template v-for="(chunk, index1) in htmlBlockTextChunks" :key="index1">
				<router-link
					v-if="engramLinkRegex.test(chunk)"
					:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(chunk) }}"
				>
					{{ getEngramTitle(chunk) }}
				</router-link>
				<!-- <li v-else-if="blockHtmlTagName === 'ul' || blockHtmlTagName === 'ol'">
					<template v-for="(listItemChunk, index2) in chunk.textNodes" :key="index2">
						<router-link
							v-if="engramLinkRegex.test(listItemChunk)"
							:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(listItemChunk) }}"
						>
							{{ getEngramTitle(listItemChunk) }}
						</router-link>
						<span v-else v-html="chunk"></span>
					</template>
					<RenderedEngramBlock
						v-if="'listNode' in htmlBlockTextChunks[index1]"
						:htmlBlockTextChunksRecursive="htmlBlockTextChunks[index1].listNode"
					/>
				</li> -->
				<div v-else v-html="chunk"></div>
			</template>
		</component>
	</div>
</template>

<script>
import Cryptarch from '../cryptarch/cryptarch';
// import Lexer from '../cryptarch/lexer';
import { RULES, TREE_NODE_TYPES } from '../cryptarch/constants';

export default {
	name: 'RenderedEngramBlock',
	props: {
		blockContent: String,
		htmlBlockTextChunksRecursive: Array,
  },
	data() {
		return {
			engramLinkRegex: /(\*(?:.|\n(?! *\n)(?! *\d{0,9}\.))+{})/, // bracket to include delimiter in result during split
		};
	},
	computed: {
		blockHtmlTagName() {
			if (!this.blockContent) {
				return 'p';
			}

			let cryptarch = new Cryptarch();
			const html = cryptarch.decrypt(this.blockContent);
			cryptarch = null;

			const domParser = new DOMParser();
			const document = domParser.parseFromString(html, 'text/html');
			return document.body.firstChild.tagName.toLowerCase();
		},
		htmlBlockTextChunks() {
			if (this.htmlBlockTextChunksRecursive) {
				return this.htmlBlockTextChunksRecursive;
			}

			// let cryptarch = new Cryptarch();
			// const tree = cryptarch.getParseTree(this.blockContent);
			// cryptarch = null;

			// if (tree.rootBlockNodes[0].type === 'image') {
			// 	return this.getHtmlChunksForImage(tree.rootBlockNodes[0]);
			// }

			// if (tree.rootBlockNodes[0].type === 'paragraph') {
			// 	return this.getHtmlChunksForParagraph();
			// }

			// if (tree.rootBlockNodes[0].type === 'unordered list' || tree.rootBlockNodes[0].type === 'ordered list') {
			// 	return this.getHtmlBlockTextChunksForList(tree.rootBlockNodes[0].listItemNodes);
			// }

			// return this.getHtmlChunksForBlocksWithBlockMarker(tree.rootBlockNodes[0].textNodes);

			const blockChunksWithoutBlockMarker = this.getBlockTextChunks();
			const htmlBlockTextChunks = [];

			blockChunksWithoutBlockMarker.forEach((chunk) => {
				if (this.engramLinkRegex.test(chunk)) {
					htmlBlockTextChunks.push(chunk);
				} else {
					let cryptarch2 = new Cryptarch();
					const html = cryptarch2.decrypt(chunk);
					cryptarch2 = null; // is there a better way to prevent memory leak than this?

					htmlBlockTextChunks.push(html);
				}
			});

			return htmlBlockTextChunks;
		},
	},
	methods: {
		getBlockTextChunks() {
			let blockTextChunks;

			const matchingBlockMarker = this.blockContent.match(this.getTextualBlockMarkerPattern());
			if (matchingBlockMarker && (this.blockHtmlTagName !== 'ul' && this.blockHtmlTagName !== 'ol')) {
				const blockContentWithoutBlockMarker = this.blockContent.replace(this.getTextualBlockMarkerPattern(), '');
				blockTextChunks = blockContentWithoutBlockMarker.split(this.engramLinkRegex).filter((item) => item);
			}	else if (matchingBlockMarker && (this.blockHtmlTagName === 'ul' || this.blockHtmlTagName === 'ol')) {
				let cryptarch = new Cryptarch();
				const tree = cryptarch.getParseTree(this.blockContent);
				cryptarch = null;

				blockTextChunks = this.blockContent.split(this.engramLinkRegex).filter((item) => item);
				// blockTextChunks = [...tree.rootBlockNodes[0].listItemNodes];

				// let { listItemNodes } = tree.rootBlockNodes[0];
				// while (listItemNodes && listItemNodes.length) {
				// 	for (let i = 0; i < listItemNodes.length; i++) {
				// 		if ('listNode' in listItemNodes[i] && 'listItemNodes' in listItemNodes[i].listNode) {
				// 			listItemNodes[i] =
				// 			listItemNodes = listItemNodes[i].listNode.listItemNodes;
				// 		}
				// 	}
				// }
				console.log(this.getHtmlBlockTextChunksForList(tree.rootBlockNodes[0].listItemNodes));
			} else {
				blockTextChunks = this.blockContent.split(this.engramLinkRegex).filter((item) => item);
			}

			return blockTextChunks;
		},
		getHtmlChunksForImage() {
			let cryptarch = new Cryptarch();
			const html = cryptarch.decrypt(this.blockContent);
			cryptarch = null; // is there a better way to prevent memory leak than this?

			return [...html];
		},
		getHtmlChunksForParagraph() {
			const blockTextChunks = this.blockContent.split(this.engramLinkRegex).filter((item) => item);

			const htmlChunks = [];
			blockTextChunks.forEach((chunk) => {
				if (this.engramLinkRegex.test(chunk)) {
					htmlChunks.push(chunk);
				} else {
					let cryptarch = new Cryptarch();
					const html = cryptarch.decrypt(chunk);
					cryptarch = null;

					htmlChunks.push(html);
				}
			});

			return htmlChunks;
		},
		getHtmlBlockTextChunksForList(listItemNodes) {
			const blockTextChunks = [];

			listItemNodes.forEach((node) => {
				// console.log(node);
				const blockTextChunkItem = { title: node.type };

				if ('textNodes' in node) {
					blockTextChunkItem.textNodes = [];

					const listItemTextChunks = this.getJoinedText(node.textNodes).split(this.engramLinkRegex).filter((item) => item);

					listItemTextChunks.forEach((chunk) => {
						if (this.engramLinkRegex.test(chunk)) {
							blockTextChunkItem.textNodes.push(chunk);
						} else {
							let cryptarch = new Cryptarch();
							const html = cryptarch.decrypt(chunk);
							cryptarch = null;

							blockTextChunkItem.textNodes.push(html);
						}
					});
				}

				if ('listNode' in node) {
					blockTextChunkItem.listNode = this.getHtmlBlockTextChunksForList(node.listNode.listItemNodes);
				}

				blockTextChunks.push(blockTextChunkItem);
			});

			return blockTextChunks;
		},
		getHtmlChunksForBlocksWithBlockMarker(textNodes) {
			const blockTextChunks = this.getJoinedText(textNodes).split(this.engramLinkRegex).filter((item) => item);

			const htmlChunks = [];
			blockTextChunks.forEach((chunk) => {
				if (this.engramLinkRegex.test(chunk)) {
					htmlChunks.push(chunk);
				} else {
					let cryptarch = new Cryptarch();
					const html = cryptarch.decrypt(chunk);
					cryptarch = null;

					htmlChunks.push(html);
				}
			});

			return htmlChunks;
		},
		getJoinedText(textNodes) {
			let text = '';
			textNodes.forEach((node) => {
				switch (node.type) {
					case TREE_NODE_TYPES.boldText:
						text += `@@${this.getJoinedText(node.textNodes)}@@`;
						break;
					case TREE_NODE_TYPES.italicText:
						text += `//${this.getJoinedText(node.textNodes)}//`;
						break;
					case TREE_NODE_TYPES.underlinedText:
						text += `__${this.getJoinedText(node.textNodes)}__`;
						break;
					case TREE_NODE_TYPES.highlightedText:
						text += `==${this.getJoinedText(node.textNodes)}==`;
						break;
					case TREE_NODE_TYPES.strikethroughText:
						text += `--${this.getJoinedText(node.textNodes)}--`;
						break;
					case TREE_NODE_TYPES.linkAlias:
						text += `__${node.title}__(${node.url})`;
						break;
					case TREE_NODE_TYPES.autolink:
						text += node.url;
						break;
					case TREE_NODE_TYPES.image:
						text += `$${node.path}{}`;
						break;
					default:
						text += node.text;
				}
			});

			return text;
		},
		getTextualBlockMarkerPattern() {
			const textualBlockPatterns = [RULES.marker.titleMarker, RULES.marker.level1SubtitleMarker, RULES.marker.level2SubtitleMarker, RULES.marker.level3SubtitleMarker, RULES.marker.unorderedListMarker, RULES.marker.orderedListMarker];

			let textualBlockPatternString = '';
			textualBlockPatterns.forEach((pattern) => {
				textualBlockPatternString += `(${pattern.source})|`;
			});
			textualBlockPatternString = textualBlockPatternString.slice(0, -1);

			return new RegExp(textualBlockPatternString, 'g');
		},
		getEngramTitle(engramLink) {
			return engramLink.slice(1, -2);
		},
	},
};
</script>

<style scoped>
.test {
	border: solid;
}

div >>> * {
	display: inline;
}
</style>
