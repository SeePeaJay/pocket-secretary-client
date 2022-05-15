import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App).use(router).use(store).component('VHtml', { // https://forum.vuejs.org/t/raw-html-without-a-parent-element-via-v-html/87160/4
	name: 'VHtml',
  props: {
    html: {
      type: String,
      required: true,
    },
  },
  directives: {
    swap: (el, binding) => {
			// createContextualFragment allows script execution
			// why you would probably want to sanitize the html
			// e.g. using https://github.com/cure53/DOMPurify
			const safe = binding.value; // cryptarch should not produce unsanitary html, so extra sanitizing calls aren't being made here

			const frag = document.createRange().createContextualFragment(safe);
			el.replaceWith(frag);
		},
  },
  template: '<div v-swap="html"></div>',
})
.mount('#app');
