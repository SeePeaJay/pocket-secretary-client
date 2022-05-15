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
					<v-html v-else :html="textNode"></v-html>
				</template>
				<RenderedEngramList
					v-if="'listNode' in listItemNode"
					:ulOrOl="listItemNode.listNode.type"
					:listNode="listItemNode.listNode"
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
		getEngramTitle(engramLink) { // duplicated method from parent component; consider improvements
			return engramLink.slice(1, -2);
		},
	},
};
</script>
