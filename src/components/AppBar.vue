<template>
	<nav>
		<router-link to="/engrams">
			<img src="../assets/stack-2.svg" alt="tabler stack-2 icon" />
		</router-link>
		<a v-if="!isLoggedIn" href="auth/github">
			<img src="../assets/login.svg" alt="tabler login icon" />
		</a>
	</nav>
</template>

<script>
export default {
	name: 'AppBar',
	data() {
		return {
			isLoggedIn: false,
		};
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
}

nav > *:hover {
	filter: brightness(0%);; /* = #000000 */
}
</style>
