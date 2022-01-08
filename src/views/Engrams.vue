<template>
	<div class="engrams-pane">
		<div class="engrams-area">
				<h1>Engrams</h1>
				<table>
					<tr><th>Title--&nbsp;&nbsp;</th></tr> <!--Name it Title later I think, when the alignment of the header is known-->
					<tr v-for="engram in engrams" :key="engram.title">
						<router-link :to="{ name: 'Engram', params: { engramTitle: engram.title }}">{{ engram.title }}</router-link>
					</tr>
					<!-- <router-link to="/sample">sample</router-link> -->
					<!-- <router-link :to="{ name: 'Engram', params: { engramTitle: 'sample' }}">{{ 'sample' }}</router-link> -->
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
		...mapActions(['fetchEngrams']),
	},
	created() {
		this.fetchEngrams();
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
