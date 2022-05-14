<template>
	<div class="test">
		<component :is="htmlTagName">
			<template v-for="(chunk, index1) in htmlChunks" :key="index1">
				<router-link
					v-if="engramLinkRegex.test(chunk)"
					:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(chunk) }}"
				>
					{{ getEngramTitle(chunk) }}
				</router-link>
				<!-- <li v-else-if="htmlTagName === 'ul' || htmlTagName === 'ol'">
					<template v-for="(listItemChunk, index2) in chunk.textNodes" :key="index2">
						<router-link
							v-if="engramLinkRegex.test(listItemChunk)"
							:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(listItemChunk) }}"
						>
							{{ getEngramTitle(listItemChunk) }}
						</router-link>
						<div v-else v-html="listItemChunk"></div>
					</template>
					<RenderedEngramBlock
						v-if="'listNode' in htmlChunks[index2]"
						:htmlChunksRecursive="htmlChunks[index2].listNode"
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
import { TREE_NODE_TYPES } from '../cryptarch/constants';

export default {
	name: 'RenderedEngramBlock',
	props: {
		blockContent: String,
		htmlChunksRecursive: Array,
  },
	data() {
		return {
			engramLinkRegex: /(\*(?:.|\n(?! *\n)(?! *\d{0,9}\.))+{})/, // bracket to include delimiter in result during split
		};
	},
	computed: {
		htmlTagName() {
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
		htmlChunks() {
			if (this.htmlChunksRecursive) {
				return this.htmlChunksRecursive;
			}

			let cryptarch = new Cryptarch();
			const tree = cryptarch.getParseTree(this.blockContent);
			cryptarch = null;

			console.log(tree);

			if (tree.rootBlockNodes.length === 0 || tree.rootBlockNodes[0].type === 'paragraph') {
				return this.getHtmlChunksForParagraph();
			}

			if (tree.rootBlockNodes[0].type === 'image') {
				return this.getHtmlChunksForImage(tree.rootBlockNodes[0]);
			}

			if (tree.rootBlockNodes[0].type === 'unordered list' || tree.rootBlockNodes[0].type === 'ordered list') {
				return this.getHtmlChunksForParagraph();
				// return this.getHtmlChunksForList(tree.rootBlockNodes[0].listItemNodes);
			}

			return this.getHtmlChunksForRemainingBlocksWithBlockMarker(tree.rootBlockNodes[0].textNodes);
		},
	},
	methods: {
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
		getHtmlChunksForList(listItemNodes) {
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
					blockTextChunkItem.listNode = this.getHtmlChunksForList(node.listNode.listItemNodes);
				}

				blockTextChunks.push(blockTextChunkItem);
			});

			return blockTextChunks;
		},
		getHtmlChunksForRemainingBlocksWithBlockMarker(textNodes) {
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

div >>> *:not(ul, li) {
	display: inline;
}
</style>
