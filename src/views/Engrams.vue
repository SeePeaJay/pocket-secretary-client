<template>
	<AppBar />
	<div class="engrams-pane">
		<div class="engrams-area">
				<h1>Engrams</h1>
				<table>
					<tr>
						<th><input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"></th>
						<th>Title</th>
						<th>Word Count</th>
						<th>Last Modified</th>
					</tr> <!-- Name it Title later I think, when the alignment of the header is known -->
					<tr v-for="engram in engrams" :key="engram.title">
						<td><input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"></td>
						<td>
							<router-link :to="{ name: 'Engram', params: { engramTitle: engram.title }}">{{ engram.title }}</router-link>
						</td>
						<td style="text-align:center">{{ getWordCount(engram.title) }}</td>
						<td style="text-align:center">2022-07-01</td>
					</tr>
				</table>
		</div>
	</div>
</template>

<script>
import AppBar from '../components/AppBar.vue';

export default {
  name: 'Engrams',
	components: {
		AppBar,
	},
  computed: {
		engrams() { // Starred engram at top
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
		getWordCount(engramTitle) { // TODO: ignore block markers?
			const { rootBlocks } = this.$store.state.engrams.find((engram) => engram.title === engramTitle);

			return rootBlocks.reduce((accumulator, currentValue) => {
				if (currentValue) {
					// console.log(currentValue.trim().split(/[\n\r\s]+/));
					return accumulator + currentValue.trim().split(' ').length;
				}

				return accumulator;
			}, 0);
		},
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
