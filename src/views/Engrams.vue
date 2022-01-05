<template>
	<div class="engrams-pane">
		<div class="engrams-area">
				<h1>Engrams</h1>
				<table>
					<tr><th>Title--&nbsp;&nbsp;</th></tr> <!--Name it Title later I think, when the alignment of the header is known-->
					<tr v-for="(engram, index) in engrams" :key="index">
						<router-link :to="{ name: 'engram', params: { engramTitle: engram.title }}">{{ engram.title }}</router-link>
					</tr>
				</table>
		</div>
	</div>
</template>

<script>
// import Editor from '../components/Editor.vue';
import axios from 'axios';

export default {
  name: 'Engrams',
  computed: {
		engrams() {
			return this.$store.state.engrams;
		},
	},
	mounted() {
		axios.get('http://localhost:3000/engrams').then((response) => {
			this.$store.commit('setEngrams', response.data);
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
