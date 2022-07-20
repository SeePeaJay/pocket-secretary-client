<template>
	<div id="popup-with-background" @click.self="$emit('togglePopup')">
		<div id="popup">
			<p><strong>Are you sure you want to delete the following engrams?</strong></p>
			<ul>
				<li v-for="(engramTitle, index) of selectedEngramTitles" :key="index">{{ engramTitle }}</li>
			</ul>
			<div id="buttons">
				<img id="confirm" class="button icon" src="../assets/check.svg" alt="tabler check icon" @click="confirmHandler()" />
				<img id="close" class="button icon" src="../assets/x.svg" alt="tabler x icon" @click="$emit('togglePopup')" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DeletePopup',
	props: {
		selectedEngramTitles: Array,
	},
	emits: ['togglePopup', 'clearSelectedEngrams'],
	methods: {
		confirmHandler() {
			this.$store.dispatch('destroyEngrams', {
				engramTitles: this.selectedEngramTitles,
				commitMessage: 'delete',
			});
			this.$emit('clearSelectedEngrams');

			this.$emit('togglePopup');
		},
	},
};
</script>

<style lang="scss" scoped>
#popup-with-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	background-color: rgba(0, 0, 0, 0.2);

	display: flex;
	align-items: center;
	justify-content: center;
}

#popup {
	background: white;
	padding: 32px;
	border-radius: 12px;

	display:flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

ul {
	max-height: 340px;
	width: 420px; /* this value happens to place the list items right under the start of paragraph */
	overflow-y: scroll;

	padding-left: 0px; /* don't know why there's a padding-left by default, so this resets it. */
	list-style-position: inside; /* for now, this setting places the marker inside the element border, which doesn't require additional padding tweaks, but this also means the second line of a list item will be right under the marker ... explore other options in the future */
}

#buttons {
	align-self: center;
}

.button {
	margin: 12px 12px -12px;
}

#confirm:hover {
	filter: $alert-filter;
}
</style>
