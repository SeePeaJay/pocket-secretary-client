<template>
	<div id="context-menu-with-background" @click.self="$emit('closeMenu')">
		<ul
			ref="context-menu"
			:style="`position: absolute; top: calc(${this.yPosition}px + 12px); left: calc(${this.xPosition}px + 12px)`"
		>
			<li v-if="!engramTitleHasTag(engramTitle, '#starred')" @click="$emit('closeMenu'); starCurrentEngram();">
				<img src="../assets/star.svg" alt="tabler star icon"/>
				Star
			</li>
			<li v-else @click="$emit('closeMenu'); unstarCurrentEngram();">
				<StarOff class="icon-with-text" />
				Unstar
			</li>
			<li id="delete-list-item" @click="toggleAlertPopup()">
				<img src="../assets/trash.svg" alt="tabler trash icon"/>
				Delete
			</li>
		</ul>
	</div>
	<AlertPopup v-if="alertPopupShouldAppear"
		:engram-titles-to-delete="[engramTitle]"
		@close-popup="toggleAlertPopup(); $emit('closeMenu');"
	/> <!-- get rid of all "floating components" -->
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import AlertPopup from './AlertPopup.vue';
import StarOff from '../assets/StarOff.vue';

export default {
	name: 'ContextMenu',
	components: {
		AlertPopup,
		StarOff,
	},
	props: {
		engramTitle: String,
		xPosition: Number,
		yPosition: Number,
	},
	data() {
		return {
			alertPopupShouldAppear: false,
		};
	},
	emits: ['closeMenu', 'starCurrentEngram', 'unstarCurrentEngram'],
	computed: {
		...mapGetters(['engramRootBlocks', 'engramTitleHasTag']),
	},
	methods: {
		...mapMutations(['ADD_ENGRAM_BLOCK', 'SET_ENGRAM_BLOCK', 'REMOVE_ENGRAM_BLOCK']),
		...mapActions(['putEngram']),
		async starCurrentEngram() {
			/* add tag to engram title block */
			let blockContent;
			const titleBlock = this.engramRootBlocks(this.engramTitle)[0];

			const matchIndex = titleBlock.search(/\n{[\S\s]*}/);
				// matches a newline character plus everything starting from the first '{' and ending with the last '}'
				// TODO: assumes a block does not contain content for multiple blocks; upon render each root block should 	split into multiple
			if (matchIndex >= 0) {
				const indexOfMetadataContainer = matchIndex + 1;
				const metadataContainer = titleBlock.slice(indexOfMetadataContainer);
				const endIndexOfMetadataForContainer = metadataContainer.search(/[\S\s]*}/);
				const starredMetadataContainer = `${metadataContainer.slice(0, endIndexOfMetadataForContainer + 1)} #starred ${metadataContainer.slice(endIndexOfMetadataForContainer + 1)}`;

				blockContent = `${titleBlock.slice(0, indexOfMetadataContainer)}${this.getFormattedMetadataContainer(starredMetadataContainer)}`;
			} else {
				blockContent = `${this.engramRootBlocks(this.engramTitle)[0]}\n{ #starred }`;
			}

			this.SET_ENGRAM_BLOCK({ engramTitle: this.engramTitle, blockIndex: 0, blockContent });
			await this.putEngram({ engramTitle: this.engramTitle, commitMessage: 'auto save' });

			/* add a block link to this engram in Starred (assume inline links don't count for now) */
			const starredRootBlocks = this.engramRootBlocks('Starred');

			if (!starredRootBlocks.includes(`*${this.engramTitle}{}`)) {
				this.ADD_ENGRAM_BLOCK({
					engramTitle: 'Starred',
					blockIndex: starredRootBlocks.length + 1,
					blockContent: `*${this.engramTitle}{}`,
				});
			}
			await this.putEngram({ engramTitle: 'Starred', commitMessage: 'auto save' });
		},
		async unstarCurrentEngram() {
			/* remove tag from engram title block */
			let blockContent = '';
			const titleBlock = this.engramRootBlocks(this.engramTitle)[0];

			const titleBlockWithoutTag = titleBlock.replace('#starred', '');

			const matchIndex = titleBlockWithoutTag.search(/\n{[\S\s]*}/);
			if (matchIndex >= 0) {
				const indexOfMetadataContainer = matchIndex + 1;
				const metadataContainer = titleBlockWithoutTag.slice(indexOfMetadataContainer);

				blockContent = `${titleBlockWithoutTag.slice(0, indexOfMetadataContainer)}${this.getFormattedMetadataContainer(metadataContainer)}`;
			} else {
				blockContent = titleBlockWithoutTag;
			}

			this.SET_ENGRAM_BLOCK({ engramTitle: this.engramTitle, blockIndex: 0, blockContent });
			await this.putEngram({ engramTitle: this.engramTitle, commitMessage: 'auto save' });

			/* remove all block links to this engram in Starred (assume inline links don't count for now) */
			const starredRootBlocks = this.engramRootBlocks('Starred');

			for (let i = starredRootBlocks.length - 1; i >= 0; i--) { // iterate backwards to avoid skipping items https://stackoverflow.com/a/11058498
				if (starredRootBlocks[i] === `*${this.engramTitle}{}`) {
					this.REMOVE_ENGRAM_BLOCK({ engramTitle: 'Starred', blockIndex: i });
				}
			}
			await this.putEngram({ engramTitle: 'Starred', commitMessage: 'auto save' });
		},
		getFormattedMetadataContainer(metadataContainer) {
			const trimmedMetadata = metadataContainer.slice(1, -1).trim();

			if (trimmedMetadata === '') {
				return '{}';
			}

			return `{ ${trimmedMetadata.split(/\s+/).join(' ')} }`;
		},
		toggleAlertPopup() {
			this.alertPopupShouldAppear = !this.alertPopupShouldAppear;
		},
	},
};
</script>

<style lang="scss" scoped>
#context-menu-with-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 98;
}

ul {
	list-style: none;

	margin: 0;
	padding: 3px;

	border: 0.3mm solid $disabled-color;
	border-radius: 3px;
	box-shadow: 3px 3px 3px #dddddd;

	font-size: 16px;

	color: $inactive-color;
	background: white;

	li {
		padding: 3px;

		&:hover {
			cursor: pointer;

			color: $default-color;

			background: $disabled-color;
			border-radius: 3px;

			img {
				filter: $default-filter;
			}
		}

		img {
			@extend .icon-with-text;

			filter: $inactive-filter;
		}
	}
}
</style>
