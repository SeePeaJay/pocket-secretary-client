<template>
	<div class="test">
		<component v-if="isTextualBlock" :is="htmlTagName">
			<template v-for="(htmlChunk, index1) in htmlChunks" :key="index1">
				<li v-if="htmlTagName === 'ul' || htmlTagName === 'ol'">
					<template v-for="(listItemChunk, index2) in htmlChunk.textNodes" :key="index2">
						<router-link
							v-if="engramLinkRegex.test(listItemChunk)"
							:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(listItemChunk) }}"
						>
							{{ getEngramTitle(listItemChunk) }}
						</router-link>
						<v-html v-else :html="listItemChunk"></v-html>
					</template>
					<RenderedEngramBlock
						v-if="'listNode' in htmlChunks[index1]"
						:htmlChunksFromThisComponent="htmlChunks[index1].listNode.listItemNodes"
					/>
				</li>
				<router-link
					v-else-if="engramLinkRegex.test(htmlChunk)"
					:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(htmlChunk) }}"
				>
					{{ getEngramTitle(htmlChunk) }}
				</router-link>
				<v-html v-else :html="htmlChunk"></v-html>
			</template>
		</component>
		<v-html v-else :html="html"></v-html> <!-- if image or line break -->
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
		htmlChunksFromThisComponent: Array,
  },
	data() {
		return {
			componentKey: 0,
			engramLinkRegex: /(\*(?:.|\n(?! *\n)(?! *\d{0,9}\.))+{})/, // bracket to include delimiter in result after split
		};
	},
	computed: {
		isTextualBlock() { // check if currently rendered block contains textual info (not image or line breaks).
			console.log(this.htmlTagName);
			return this.htmlTagName !== 'img' && this.htmlTagName !== 'hr';
		},
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
		html() {
			let cryptarch = new Cryptarch();
			const html = cryptarch.decrypt(this.blockContent);
			cryptarch = null; // is there a better way to prevent memory leak than this?

			console.log(html);

			return html;
		},
		htmlChunks() { // chunks include engram links.
			if (this.htmlChunksFromThisComponent) {
				return this.htmlChunksFromThisComponent;
			}

			let cryptarch = new Cryptarch();
			const tree = cryptarch.getParseTree(this.blockContent);
			cryptarch = null;

			if (tree.rootBlockNodes.length === 0) {
				return [''];
			}

			// if (tree.rootBlockNodes[0].type === 'image') {
			// 	return this.getHtmlChunksForImage(tree.rootBlockNodes[0]);
			// }

			if (tree.rootBlockNodes[0].type === 'paragraph') {
				return this.getHtmlChunksForParagraph();
			}

			if (tree.rootBlockNodes[0].type === 'unordered list' || tree.rootBlockNodes[0].type === 'ordered list') {
				// return this.getHtmlChunksForParagraph();
				return this.getHtmlChunksForList(tree.rootBlockNodes[0].listItemNodes);
			}

			console.log(tree.rootBlockNodes[0]);

			return this.getHtmlChunksForRemainingBlocksWithBlockMarker(tree.rootBlockNodes[0].textNodes);
		},
	},
	methods: {
		getHtmlChunksForParagraph() {
			const textChunks = this.blockContent.split(this.engramLinkRegex).filter((item) => item);

			const htmlChunks = [];
			textChunks.forEach((textChunk) => {
				if (this.engramLinkRegex.test(textChunk)) {
					htmlChunks.push(textChunk);
				} else {
					let cryptarch = new Cryptarch();
					let htmlChunk = cryptarch.decrypt(textChunk);
					cryptarch = null;

					htmlChunk = htmlChunk.replace('<p>', '').replace(/<\/p>$/, '');

					htmlChunks.push(htmlChunk);
				}
			});

			return htmlChunks;
		},
		getHtmlChunksForList(listItemNodes) {
			const htmlChunksForList = [];

			listItemNodes.forEach((listItemNode) => {
				// console.log(node);
				const htmlChunksForListItem = { title: listItemNode.type };

				if ('textNodes' in listItemNode) {
					htmlChunksForListItem.textNodes = [];

					const listItemTextChunks = this.getJoinedText(listItemNode.textNodes).split(this.engramLinkRegex).filter((item) => item);

					listItemTextChunks.forEach((listItemTextChunk) => {
						if (this.engramLinkRegex.test(listItemTextChunk)) {
							htmlChunksForListItem.textNodes.push(listItemTextChunk);
						} else {
							let cryptarch = new Cryptarch();
							let htmlChunk = cryptarch.decrypt(listItemTextChunk);
							cryptarch = null;

							htmlChunk = htmlChunk.replace('<p>', '').replace(/<\/p>$/, '');

							htmlChunksForListItem.textNodes.push(htmlChunk);
						}
					});
				}

				if ('listNode' in listItemNode) {
					htmlChunksForListItem.listNode = this.getHtmlChunksForList(listItemNode.listNode.listItemNodes);
				}

				htmlChunksForList.push(htmlChunksForListItem);
			});

			return htmlChunksForList;
		},
		getHtmlChunksForRemainingBlocksWithBlockMarker(textNodes) {
			const textChunks = this.getJoinedText(textNodes).split(this.engramLinkRegex).filter((item) => item);

			const htmlChunks = [];
			textChunks.forEach((textChunk) => {
				if (this.engramLinkRegex.test(textChunk)) {
					htmlChunks.push(textChunk);
				} else {
					let cryptarch = new Cryptarch();
					let htmlChunk = cryptarch.decrypt(textChunk);
					cryptarch = null;

					htmlChunk = htmlChunk.replace('<p>', '').replace(/<\/p>$/, '');

					htmlChunks.push(htmlChunk);
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

/* div >>> *:not(ul, li) {
	display: inline;
} */
</style>
