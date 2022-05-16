<template>
	<component :is="ulOrOl">
		<template v-for="(listItemNode, listItemNodeIndex) in listNode.listItemNodes" :key="listItemNodeIndex">
			<li>
				<template v-for="(textNode, textNodeIndex) in listItemNode.textNodes" :key="textNodeIndex">
					<router-link
						v-if="engramLinkRegex.test(textNode)"
						:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(textNode) } }"
					>
						{{ getEngramTitle(textNode) }}
					</router-link>
					<!-- this commment is required for custom VHtml component to work; consider alternative implementations -->
					<!-- <v-html v-else :html="textNode"></v-html> -->
					<span v-else v-html="textNode"></span>
				</template>
				<RenderedEngramList
					v-if="'listNode' in listItemNode"
					:ulOrOl="getUlOrOl(listItemNode.listNode)"
					:listNode="listItemNode.listNode"
					:engramLinkRegex="engramLinkRegex"
				/>
			</li>
		</template>
	</component>
	<!-- <li v-if="htmlTagName === 'ul' || htmlTagName === 'ol'">
		<template v-for="(listItemChunk, listItemChunkIndex) in htmlChunk.textNodes" :key="listItemChunkIndex">
			<router-link
				v-if="engramLinkRegex.test(listItemChunk)"
				:to="{ name: 'Engram', params: { engramTitle: getEngramTitle(listItemChunk) }}"
			>
				{{ getEngramTitle(listItemChunk) }}
			</router-link>
			<v-html v-else :html="listItemChunk"></v-html>
		</template>
		<RenderedEngramBlock
			v-if="'listNode' in htmlChunks[index]"
			:htmlChunksFromThisComponent="htmlChunks[index].listNode"
		/>
	</li> -->
</template>

<script>
export default {
	name: 'RenderedEngramList',
	props: {
		ulOrOl: String,
		listNode: Object,
		engramLinkRegex: RegExp,
	},
	methods: {
		getUlOrOl(listNode) {
			if (listNode.type === 'unordered list') {
				return 'ul';
			}

			return 'ol';
		},
		getEngramTitle(engramLink) { // duplicated method from parent component; consider improvements
			return engramLink.slice(1, -2);
		},
	},
};
</script>
