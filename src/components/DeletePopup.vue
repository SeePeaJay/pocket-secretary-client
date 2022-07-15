<template>
	<div id="popup-with-background" @click.self="$emit('togglePopup')">
		<div id="popup">
			<p>Are you sure you want to delete the following engrams?</p>
			<ul>
				<li v-for="(engramTitle, index) of selectedEngrams" :key="index">{{ engramTitle }}</li>
			</ul>
			<div id="buttons">
				<img id="confirm" class="button" src="../assets/check.svg" alt="tabler check icon" />
				<img id="close" class="button" src="../assets/x.svg" alt="tabler x icon" @click="$emit('togglePopup')" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DeletePopup',
	props: {
		selectedEngrams: Array,
	},
	emits: ['togglePopup'],
};
</script>

<style scoped>
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
	background: #FFF;
	padding: 32px;
	border-radius: 12px;

	display:flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

ul { /* don't know why there's a padding-left by default, so this resets it. */
	/* padding-left: 0; */

	max-height: 340px;
	width: 50%;
	overflow-y: scroll;
}

#buttons {
	align-self: center;
}

.button {
	filter: invert(58%) sepia(0%) saturate(420%) hue-rotate(146deg) brightness(94%) contrast(79%); /* #888888 */
	margin: 12px 12px -12px;
}

#confirm:hover {
	cursor: pointer;
	filter: invert(28%) sepia(100%) saturate(7376%) hue-rotate(359deg) brightness(113%) contrast(123%); /* #ff0000 */
}

#close:hover {
	cursor: pointer;
	filter: invert(21%) sepia(9%) saturate(2115%) hue-rotate(169deg) brightness(96%) contrast(89%); /* #2c3e50 */
}
</style>
