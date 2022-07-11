<template>
	<!-- <p v-if="userIsLoggedIn()">User authenticated</p>
	<p v-else>User not authenticated</p> -->
	<EngramEditor v-if="userIsLoggedIn()" engram-title="Starred" isEditable/>
	<EngramEditor
		v-else engram-title="Default Engram Page" :unauthenticated-engram-blocks="unauthenticatedEngramBlocks"
	/>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import EngramEditor from '../components/EngramEditor.vue';

export default {
	name: 'Landing',
	components: {
		EngramEditor,
  },
	data() {
		return {
			unauthenticatedEngramBlocks: ['* Multi-Tool', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec orci justo, finibus id turpis finibus, convallis viverra arcu. Aliquam risus ligula, malesuada et commodo eu, ornare eget mauris. Aenean ac risus vitae lacus varius cursus sit amet eu diam. Morbi ultricies orci eros, ac luctus ante euismod eget. Vivamus et orci a augue vulputate imperdiet ac vestibulum lorem. Donec placerat accumsan orci, ut cursus ante volutpat et. Aliquam erat volutpat. Cras euismod est diam, a malesuada metus malesuada sit amet. Curabitur vel vulputate libero. Nulla a diam pulvinar, lacinia diam vitae, aliquam sem. ', '*_1 Motivation', 'Donec malesuada dignissim leo, nec pulvinar orci convallis non. Duis ullamcorper massa non enim consequat pellentesque. Aliquam a diam ac magna varius egestas. Etiam gravida volutpat tincidunt. Praesent faucibus mauris enim, sit amet laoreet felis tempor quis. Donec faucibus iaculis varius. Sed risus nunc, vehicula eu lorem id, facilisis rutrum nunc. Ut ultrices iaculis blandit. Aliquam imperdiet odio nec egestas accumsan. Mauris varius ultrices dui sit amet molestie.'],
		};
	},
	methods: {
		...mapMutations(['SET_LAST_COMMITTED_ENGRAM_DATA']),
		...mapActions(['setAbortController', 'fetchUserAndAllEngrams', 'fetchEngram', 'createEngram']),
		userIsLoggedIn() { // TODO: refactor when all components use Composition API
			return !!this.$store.state.username;
		},
	},
	created() {
		this.setAbortController().then(() => {
			this.fetchUserAndAllEngrams().then(() => {
				console.log(`In creation of Landing, user is: ${this.$store.state.username}`);

				if (this.userIsLoggedIn()) {
					const engramTitles = this.$store.state.engrams.map((engram) => engram.title);

					if (!engramTitles.includes('Starred')) {
						this.createEngram('Starred');
						this.SET_LAST_COMMITTED_ENGRAM_DATA('Starred');
					}

					// this.fetchEngram('Starred');
				}
			});
		});

		// this.setAbortController().then((value) => {
		// 	console.log(`At creation of Engrams. And right after setting the abort controller, it should be ${value}`);
		// 	this.fetchEngramList();
		// });
	},
};
</script>
