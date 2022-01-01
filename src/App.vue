<template>
	<AppBar/>
	<router-view></router-view>
</template>

<script>
import AppBar from './components/AppBar.vue';

export default {
  name: 'App',
  components: {
		AppBar,
  },
};
</script>

<style>
* { /* perhaps there's a better way of resetting? */
	margin: 0;
	/* padding: 0; */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
	display: flex;
	flex-direction: column;
}

/* div > ul {
	display: flex;
	flex-direction: column;
} */

/*
li > ul {
	display: block;
} */
</style>
