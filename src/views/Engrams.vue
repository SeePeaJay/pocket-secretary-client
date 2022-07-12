<template>
	<AppBar />
	<div class="engrams-pane">
		<div class="engrams-area">
				<h1>Engrams</h1>
				<table>
					<tr><th>--Titles--</th></tr> <!--Name it Title later I think, when the alignment of the header is known-->
					<tr v-for="engram in engrams" :key="engram.title">
						<router-link :to="{ name: 'Engram', params: { engramTitle: engram.title }}">{{ engram.title }}</router-link>
					</tr>
				</table>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import AppBar from '../components/AppBar.vue';

export default {
  name: 'Engrams',
	components: {
		AppBar,
	},
  computed: {
		engrams() {
			return [...this.$store.state.engrams].sort((a, b) => {
				const titleA = a.title.toUpperCase();
				const titleB = b.title.toUpperCase();

				if (titleA < titleB) {
					return -1;
				}

				if (titleA > titleB) {
					return 1;
				}

				return 0;
			});
		},
	},
	methods: {
		...mapActions(['setAbortController', 'fetchEngramList', 'cancelPreviousRequest']),
	},
};
</script>

<style scoped>
.engrams-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.engrams-area{
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 8px 0 8px;
}
</style>
