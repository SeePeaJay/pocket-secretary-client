<template>
	<nav>
		<router-link to="/engrams">
			<img src="../assets/stack-2.svg" alt="tabler stack-2 icon" />
		</router-link>
		<a v-if="userIsLoggedIn()" @click="logout()">
			<img src="../assets/logout.svg" alt="tabler logout icon" />
		</a>
		<a v-else href="/auth/github">
			<img src="../assets/login.svg" alt="tabler login icon" />
		</a>
	</nav>
</template>

<script>
import { mapMutations } from 'vuex';
import axios from 'axios';

export default {
	name: 'AppBar',
	methods: {
		...mapMutations(['SET_USERNAME', 'SET_ENGRAMS']),
		userIsLoggedIn() { // TODO: refactor when all components use Composition API
			return !!this.$store.state.username;
		},
		async login() {
			try {
				await axios.get('http://localhost:3000/login', {}, { withCredentials: true }); // TODO: axios relative url

				// this.SET_USERNAME('');
				// this.SET_ENGRAMS([]);
				// this.$router.push('/');
				// console.log(this.$store.state.username);
			} catch (error) {
				console.error(error);
			}
			// create Starred engram if it doesn't exist
		},
		async logout() {
			try {
				await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
				this.SET_USERNAME('');
				this.SET_ENGRAMS([]);
				this.$router.push('/');
				console.log(this.$store.state.username);
			} catch (error) {
				console.error(error);
			}
		},
	},
};
</script>

<style>
nav {
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: space-between;
}

nav > * {
	width: 24px;
	height: 24px;
	filter: invert(67%) sepia(0%) saturate(261%) hue-rotate(157deg) brightness(88%) contrast(79%); /* = #919191 */
	margin: 8px;
	cursor: pointer;
}

nav > *:hover {
	filter: brightness(0%);; /* = #000000 */
}
</style>
