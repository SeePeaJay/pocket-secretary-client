import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const mixin = {
  methods: {
    userIsLoggedIn() {
      console.log('hello from mixin!');
			return !!store.state.username;
    },
  },
};

createApp(App).use(router).use(store).mixin(mixin)
.mount('#app');
