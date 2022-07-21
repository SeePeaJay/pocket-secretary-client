<template>
	<router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
	methods: {
		...mapActions(['cancelPreviousRequest']),
		beforeWindowUnload() { // TODO: alert popup when user wants to leave?
			this.cancelPreviousRequest(); // otherwise, request aborted error upon refresh
		},
	},
	created() {
		window.addEventListener('beforeunload', this.beforeWindowUnload);
	},
	beforeUnmount() {
		window.removeEventListener('beforeunload', this.beforeWindowUnload);
	},
};
</script>

<style lang="scss">
// for global variables and styles see main.scss

* { /* TODO: perhaps there's a better way of resetting? */
	margin: 0;
	/* padding: 0; */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $default-color;
	display: flex;
	flex-direction: column;
}

.icon { // generic icon TODO: change to clickable?
	filter: $inactive-filter;

	&:hover {
		filter: $default-filter;
		cursor: pointer;
	}

	// &:active { // TODO
	// 	// background-color: red;
	// 	// filter: $default-filter;
	// 	border-radius: 3px;
	// }

	&.disabled { // if disabled
		filter: $disabled-filter;
		cursor: default;
	}
}

.engram-link {
	display: inline-block; // so icon and link stays together

	cursor: pointer;
	text-decoration: none;
	color: $active-link-color;

	img { // engram link icon, specifically
		@extend .icon-with-text;

		filter: $active-link-filter;
			/*
				* don't know if there's a better way to align the icon with the engram link, but this method seems to work so far
				* tried, but didn't work:
					* display: inline-flex then align-items: center in .engram-link
					* ...
			*/
		margin-left: -0.1em; // image needs negative margin to offset the space in image, to make actual whitespace look identical
	}

	&:hover {
		text-decoration: underline;
	}

	&.inactive { // if inactive/empty
		color: $inactive-color;

		img {
			filter: $inactive-filter;
		}
	}
}

// .inactive { /* has to be below .engram-link to avoid being overwritten by it */
// }
</style>
