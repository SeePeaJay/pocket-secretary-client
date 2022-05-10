<template>
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

export default {
  name: 'Engrams',
  computed: {
		engrams() {
			return this.$store.state.engrams;
		},
	},
	methods: {
		...mapActions(['setAbortController', 'fetchEngramList', 'cancelPreviousRequest']),
	},
	created() {
		this.setAbortController().then((value) => {
			console.log(`At creation of Engrams. And right after setting the abort controller, it should be ${value}.`);
			this.fetchEngramList();
		});
	},
	beforeRouteLeave(to, from, next) { // this won't execute during refresh; called when the route that renders this component is about to be navigated away from.
		console.log(`On first line of before route leave in ${from.name} ...`);
		this.cancelPreviousRequest().then(() => {
			next();
		});
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
