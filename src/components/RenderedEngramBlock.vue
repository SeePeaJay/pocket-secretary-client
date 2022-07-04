<template>
	<div class="test"> <!-- div to make block clickable -->
		<RenderedEngramList v-if="htmlTagName === 'ul' || htmlTagName === 'ol'"
			:ulOrOl="htmlTagName" :listNode="parseTreeForList.rootBlockNodes[0]" :engramLinkRegex="engramLinkRegex"
		/>
		<component v-else-if="isTextualBlock" :is="htmlTagName"> <!-- if not list, image, or line break -->
			<template v-for="(chunk, index) in htmlChunks" :key="index">
				<!-- <router-link
					v-if="engramLinkRegex.test(chunk)"
					:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(chunk) } }"
				>
					{{ getEngramTitle(chunk) }}
				</router-link> -->
				<EngramLink v-if="engramLinkRegex.test(chunk)" :engramTitle="getEngramTitle(chunk)" />
				<span v-else v-html="chunk"></span>
			</template>
		</component>
		<p v-else-if="htmlTagName === 'img'" v-html="html"></p> <!-- make it <img></img> instead? -->
		<hr v-else>
	</div>
</template>

<script>
import Cryptarch from '../cryptarch/cryptarch';
import { TREE_NODE_TYPES } from '../cryptarch/constants';
import RenderedEngramList from './RenderedEngramList.vue';
import EngramLink from './EngramLink.vue';

export default {
	name: 'RenderedEngramBlock',
	components: {
		RenderedEngramList,
		EngramLink,
	},
	props: {
		blockContent: String,
  },
	data() {
		return {
			componentKey: 0,
			engramLinkRegex: /(\*(?:.|\n(?! *\n)(?! *\d{0,9}\.))+?{})/, // bracket to include delimiter in result after split
		};
	},
	computed: {
		isTextualBlock() { // check if currently rendered block contains textual info (not image or line breaks).
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

			// console.log(html);

			return html;
		},
		parseTree() {
			let cryptarch = new Cryptarch();
			const tree = cryptarch.getParseTree(this.blockContent);
			cryptarch = null;

			return tree;
		},
		parseTreeForList() { // simplified for rendering lists
			return {
				type: this.parseTree.type,
				rootBlockNodes: [
					{
						type: this.parseTree.rootBlockNodes[0].type,
						listItemNodes: this.getSimplifiedListItemNodes(this.parseTree.rootBlockNodes[0].listItemNodes),
					},
				],
			};
		},
		htmlChunks() { // chunks include engram links
			if (this.parseTree.rootBlockNodes.length === 0) {
				return [''];
			}

			if (this.parseTree.rootBlockNodes[0].type === 'paragraph') {
				return this.getHtmlChunksForParagraph();
			}

			return this.getHtmlChunksForBlocksWithBlockMarker(this.parseTree.rootBlockNodes[0].textNodes);
		},
	},
	methods: {
		getSimplifiedListItemNodes(originalListItemNodes) { // used by parseTreeForList
			const simplifiedListItemNodes = [];

			originalListItemNodes.forEach((originalListItemNode) => {
				const simplifiedListItemNode = { title: originalListItemNode.type };

				if ('textNodes' in originalListItemNode) {
					simplifiedListItemNode.textNodes = [];

					const listItemTextChunks = this.getJoinedText(originalListItemNode.textNodes).split(this.engramLinkRegex).filter((item) => item);

					listItemTextChunks.forEach((listItemTextChunk) => {
						if (this.engramLinkRegex.test(listItemTextChunk)) {
							simplifiedListItemNode.textNodes.push(listItemTextChunk);
						} else {
							let cryptarch = new Cryptarch();
							let listItemHtmlChunk = cryptarch.decrypt(listItemTextChunk);
							cryptarch = null;

							listItemHtmlChunk = listItemHtmlChunk.replace('<p>', '').replace(/<\/p>$/, '');

							simplifiedListItemNode.textNodes.push(listItemHtmlChunk);
						}
					});
				}

				if ('listNode' in originalListItemNode) {
					simplifiedListItemNode.listNode = {
						type: originalListItemNode.listNode.type,
						listItemNodes: this.getSimplifiedListItemNodes(originalListItemNode.listNode.listItemNodes),
					};
				}

				simplifiedListItemNodes.push(simplifiedListItemNode);
			});

			// console.log(simplifiedListItemNodes);

			return simplifiedListItemNodes;
		},
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
		getHtmlChunksForBlocksWithBlockMarker(textNodes) {
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
		getEngramTitle(engramLink) { // remove * and {}
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
