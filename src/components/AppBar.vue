<template>
	<nav>
		<router-link v-if="userIsLoggedIn()" to="/engrams">
			<img src="../assets/stack-2.svg" alt="tabler stack-2 icon" />
		</router-link>
		<span v-else></span> <!-- a quick hack for fixing the login button in place when unauthed-->
		<a v-if="userIsLoggedIn()" @click="logout()">
			<img src="../assets/logout.svg" alt="tabler logout icon" />
		</a>
		<a v-else href="/auth/github"> <!-- Github only supports auth via href; axios won't work -->
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
		...mapMutations(['REMOVE_ALL_USER_DATA']),
		userIsLoggedIn() { // TODO: refactor if all components use Composition API
			return !!this.$store.state.username;
		},
		async logout() {
			try {
				await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
				this.REMOVE_ALL_USER_DATA();

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

nav > :not(span) {
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
