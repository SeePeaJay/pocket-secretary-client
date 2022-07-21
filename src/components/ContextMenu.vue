<template>
	<div id="menu-with-background" @click.self="$emit('toggleMenu')">
		<ul id="context-menu" ref="context-menu" :style="`position: absolute; top: calc(${this.yPosition}px + 12px); left: calc(${this.xPosition}px + 12px)`">
			<li id="star-list-item">
				<img src="../assets/star.svg" alt="tabler star icon"/>
				Star
			</li>
			<li id="delete-list-item">
				<img src="../assets/trash.svg" alt="tabler trash icon"/>
				Delete
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'ContextMenu',
	props: {
		xPosition: Number,
		yPosition: Number,
	},
	emits: ['toggleMenu'],
};
</script>

<style lang="scss" scoped>
#menu-with-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
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
			width: 1em;
			height: 1em;

			filter: $inactive-filter;

			vertical-align: -12%;
		}
	}
}
</style>
