<template>
	<component :is="ulOrOl">
		<template v-for="(listItemNode, listItemNodeIndex) in listNode.listItemNodes" :key="listItemNodeIndex">
			<li>
				<template v-for="(textNode, textNodeIndex) in listItemNode.textNodes" :key="textNodeIndex">
					<EngramLink v-if="engramLinkRegex.test(textNode)" :engramTitle="getEngramTitle(textNode)" />
					<span v-else @click="$emit('enterEditMode')" v-html="textNode"></span>
				</template>
				<RenderedEngramList
					v-if="'listNode' in listItemNode"
					:ulOrOl="getUlOrOl(listItemNode.listNode)"
					:listNode="listItemNode.listNode"
					:engramLinkRegex="engramLinkRegex"
					@enterEditMode="$emit('enterEditMode')"
				/>
			</li>
		</template>
	</component>
</template>

<script>
import EngramLink from './EngramLink.vue';

export default {
	name: 'RenderedEngramList',
	components: {
		EngramLink,
	},
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
