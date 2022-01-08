<template>
	<EngramEditor :engram-title="engramTitle"/>
</template>

<script>
// import { computed } from 'vue';
// // import { beforeRouteLeave } from 'vue-router';
// import { useRoute } from 'vue-router';
// import { useStore } from 'vuex';
// import axios from 'axios';
import { mapActions } from 'vuex';
// import store from '../store/index';
import EngramEditor from '../components/EngramEditor.vue';

export default {
	name: 'Engram',
	components: {
		EngramEditor,
  },
	// data() {
	// 	return {
	// 		isLoading: false,
	// 	};
	// },
	// setup() {
	// 	const route = useRoute();
	// 	const store = useStore();

	// 	// const isLoading = ref(false);
	// 	const engramTitle = computed(() => route.params.engramTitle);
	// 	// const engramTitle = ref('sample');

	// 	// isLoading.value = true;
	// 	// console.log(engramTitle.value);
	// 	store.dispatch('fetchEngram', engramTitle.value);
	// 	// isLoading.value = false;

	// 	return {
	// 		engramTitle,
	// 	};
	// },
	computed: {
		engramTitle() {
			return this.$route.params.engramTitle;
		},
	},
	methods: {
		...mapActions(['fetchEngram']),
	},
	created() {
		this.fetchEngram(this.engramTitle);
	},
	// beforeRouteEnter(to) {
	// 	// const route = useRoute();
	// 	// this.isLoading = true;
	// 	console.log(to.name);
	// 	// console.log(from);
	// 	// console.log(next);
	// 	store.dispatch('fetchEngram', to.name);
	// 	// this.isLoading = false;
	// 	console.log('hello?');
	// 	// axios.get(`http://localhost:3000/engrams/${encodeURIComponent(this.engramTitle)}`, { withCredentials: true }).then((response) => {
	// 	// 	this.$store.commit('setEngram', response.data);
	// 	// 	console.log('jijo');
	// 	// });
	// },
};
</script>
