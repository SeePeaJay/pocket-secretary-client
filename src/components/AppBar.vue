<template>
	<nav>
		<router-link v-if="userIsLoggedIn()" to="/engrams">
				<img src="../assets/stack-2.svg" alt="tabler stack-2 icon" />
			</router-link>
		<span v-else></span> <!-- a quick hack for fixing the login button in place when unauthed-->
		<router-link v-if="userIsLoggedIn()" class="starred-engram-link" :to="{ name: 'Engram', params: { engramTitle: 'Starred' }}">
			<img src="../assets/star.svg" alt="tabler star icon" />
		</router-link>
		<a v-if="userIsLoggedIn()" class="right-side" @click="logout()">
			<img src="../assets/logout.svg" alt="tabler logout icon" />
		</a>
		<a v-else class="right-side" href="/auth/github"> <!-- Github only supports auth via href; axios won't work -->
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
	filter: invert(58%) sepia(0%) saturate(420%) hue-rotate(146deg) brightness(94%) contrast(79%); /* #888888 */
	margin: 8px;
	cursor: pointer;
}

nav > *:hover {
	filter: invert(21%) sepia(9%) saturate(2115%) hue-rotate(169deg) brightness(96%) contrast(89%); /* #2c3e50 */
}

.right-side {
	margin-left: auto;
}

.starred-engram-link {
	margin-left: 0;
}

.starred-engram-link:hover {
	filter: invert(75%) sepia(64%) saturate(812%) hue-rotate(359deg) brightness(102%) contrast(103%); /* */
}
</style>
