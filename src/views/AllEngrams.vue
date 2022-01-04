<template>
	<div class="all-engrams-pane">
		<div class="all-engrams-area">
				<h1>All</h1>
				<table>
					<tr><th>Engram</th></tr>
					<tr v-for="(engram, index) in allEngrams" :key="index">{{ engram.id }}</tr>
				</table>
		</div>
	</div>
</template>

<script>
// import Editor from '../components/Editor.vue';
import axios from 'axios';

export default {
  name: 'AllEngrams',
  computed: {
		allEngrams() {
			return this.$store.state.engrams;
		},
	},
	mounted() {
		axios.get('http://localhost:3000/all').then((response) => {
			console.log(response);
		});
	},
};
</script>

<style scoped>
.all-engrams-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.all-engrams-area{
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 8px 0 8px;
}
</style>
