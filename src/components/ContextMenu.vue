<template>
	<div id="context-menu-with-background" @click.self="$emit('closeMenu')">
		<ul
			ref="context-menu"
			:style="`position: absolute; top: calc(${this.yPosition}px + 12px); left: calc(${this.xPosition}px + 12px)`"
		>
			<li v-if="!engramTitleHasTag(engramTitle, '#starred')" @click="starCurrentEngram(); $emit('closeMenu')">
				<img src="../assets/star.svg" alt="tabler star icon"/>
				Star
			</li>
			<li v-else @click="unstarCurrentEngram()">
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
import { mapGetters } from 'vuex';
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
		...mapGetters(['engramTitleHasTag']),
	},
	methods: {
		starCurrentEngram() {
			console.log('oh yes starred');
		},
		unstarCurrentEngram() { // prob diff enough to warrant separate functions
			console.log('oh no unstarred');
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
