<template>
	<template v-if="isLoading">
		<p>Loading ...</p>
	</template>
	<template v-else>
		<AppBar/>
		<EngramEditor v-if="userIsLoggedIn" engram-title="Starred" engramIsEditable/>
		<EngramEditor
			v-else engram-title="Default Engram Page" :unauthenticated-engram-blocks="unauthenticatedEngramBlocks"
		/>
	</template>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import store from '../store';
import AppBar from '../components/AppBar.vue';
import EngramEditor from '../components/EngramEditor.vue';

export default {
	name: 'Landing',
	components: {
		AppBar,
		EngramEditor,
  },
	data() {
		return {
			unauthenticatedEngramBlocks: ['* Multi-Tool', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec orci justo, finibus id turpis finibus, convallis viverra arcu. Aliquam risus ligula, malesuada et commodo eu, ornare eget mauris. Aenean ac risus vitae lacus varius cursus sit amet eu diam. Morbi ultricies orci eros, ac luctus ante euismod eget. Vivamus et orci a augue vulputate imperdiet ac vestibulum lorem. Donec placerat accumsan orci, ut cursus ante volutpat et. Aliquam erat volutpat. Cras euismod est diam, a malesuada metus malesuada sit amet. Curabitur vel vulputate libero. Nulla a diam pulvinar, lacinia diam vitae, aliquam sem. ', '*_1 Motivation', 'Donec malesuada dignissim leo, nec pulvinar orci convallis non. Duis ullamcorper massa non enim consequat pellentesque. Aliquam a diam ac magna varius egestas. Etiam gravida volutpat tincidunt. Praesent faucibus mauris enim, sit amet laoreet felis tempor quis. Donec faucibus iaculis varius. Sed risus nunc, vehicula eu lorem id, facilisis rutrum nunc. Ut ultrices iaculis blandit. Aliquam imperdiet odio nec egestas accumsan. Mauris varius ultrices dui sit amet molestie.'],
			isLoading: false,
		};
	},
	computed: {
		...mapGetters(['userIsLoggedIn']),
	},
	methods: {
		...mapActions(['fetchUserAndAllEngrams', 'createEngram']),
	},
	created() {
		console.log(`At Landing's created(), user is: ${store.state.username}`);

		if (!this.userIsLoggedIn) {
			this.isLoading = true;

			store.dispatch('fetchUserAndAllEngrams').then(() => {
				if (this.userIsLoggedIn) { // without this, will attempt to create engram even if unauthed
					const engramTitles = store.state.engrams.map((engram) => engram.title);

					if (!engramTitles.includes('Starred')) {
						store.dispatch('createEngram', 'Starred');
					}
				}

				this.isLoading = false;
			});
		}
	},
};
</script>

<style lang="scss" scoped>
p {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);

	font-size: 2em;

	animation: color-change 2.5s infinite;
}

@keyframes color-change {
  0% { color: white; }
  50% { color: $default-color; }
  100% { color: white; }
}
</style>
