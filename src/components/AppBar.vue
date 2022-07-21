<template>
	<nav>
		<template v-if="userIsLoggedIn">
			<router-link id="link-to-engrams" class="icon" to="/engrams">
				<img src="../assets/stack-2.svg" alt="tabler stack-2 icon" />
			</router-link>
			<router-link id="link-to-starred" class="icon" :to="{ name: 'Engram', params: { engramTitle: 'Starred' }}">
				<img src="../assets/star.svg" alt="tabler star icon" />
			</router-link>
			<a class="right-side icon" @click="logout()">
				<img src="../assets/logout.svg" alt="tabler logout icon" />
			</a>
		</template>
		<template v-else>
			<span></span> <!-- a quick hack for fixing the login button in place when unauthed-->
			<a class="right-side icon" href="/auth/github"> <!-- Github only supports auth via href; axios won't work -->
				<img src="../assets/login.svg" alt="tabler login icon" />
			</a>
		</template>
	</nav>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';

export default {
	name: 'AppBar',
	computed: {
		...mapGetters(['userIsLoggedIn']),
	},
	methods: {
		...mapMutations(['REMOVE_ALL_USER_DATA']),
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

<style lang="scss">
nav {
	width: 100%;
	height: 40px;

	display: flex;
	justify-content: space-between;
}

nav > :not(span) {
	width: 24px;
	height: 24px;

	margin: 8px;
}

.right-side {
	margin-left: auto;
}

#link-to-starred {
	margin-left: 0;

	&:hover {
		filter: $starred-filter;
	}
}

// .router-link-active { // TODO: how to use starred filter right after login
// 	filter: $default-filter;

// 	&#link-to-starred {
// 		filter: $starred-filter;
// 	}
// }
</style>
