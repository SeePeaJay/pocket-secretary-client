<template>
  <div class="editor-pane">
		<div class="editor-content-container">
			<h1>{{ content }}</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor, urna a varius iaculis, urna
				nisi mattis felis, vitae bibendum nibh quam ac lacus. Mauris id turpis ut sapien suscipit venenatis. Sed
				rutrum quis mi quis hendrerit. Duis consectetur turpis velit, ac accumsan purus tristique ut. Maecenas
				volutpat euismod turpis eu suscipit. Sed suscipit dolor viverra, volutpat lacus sed, sodales urna. Donec
				eget sapien ut lorem vehicula condimentum sit amet nec nulla. Integer nec feugiat tortor. Duis ultrices
				erat risus. Maecenas mi dolor, volutpat at sem nec, mattis sollicitudin nunc. Sed id sem metus. Nunc
				pretium imperdiet viverra. Aenean convallis vitae lorem eu tincidunt.

				In convallis mi sed pellentesque ullamcorper. Maecenas accumsan lectus ac imperdiet viverra. Etiam
				imperdiet risus vel turpis venenatis rhoncus. Sed porttitor sollicitudin lorem, sit amet dictum enim
				malesuada quis. Maecenas tempor nec tellus a tincidunt. Sed erat enim, auctor vitae sem in, viverra
				lobortis magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo, dui ac mattis
				maximus, orci lectus iaculis felis, eu mollis sapien sem at purus. Nullam ut justo et ipsum tempor
				mollis eget quis tortor. Donec orci urna, facilisis sit amet augue et, gravida feugiat justo. Cras
				quis pellentesque leo, nec maximus dolor.

				Quisque malesuada venenatis viverra. Mauris faucibus iaculis interdum. Sed imperdiet efficitur posuere.
				Phasellus tempus eget velit in pharetra. Nunc mattis quis nibh vitae gravida. Quisque eleifend diam vel
				suscipit mattis. Proin ac urna varius purus malesuada pretium. Morbi blandit odio vel porta dictum.
				Aenean vel accumsan dolor. Sed sit amet orci lorem. Vestibulum ante ipsum primis in faucibus orci luctus
				et ultrices posuere cubilia curae; Aenean eget metus mauris. Cras nisl urna, malesuada ut vehicula
				porta, vehicula id enim. Maecenas vel tellus vel enim laoreet viverra eu in diam. Phasellus mollis
				velit enim, id fermentum tortor mollis quis. Donec in faucibus felis.

				Sed eget fringilla mauris. Mauris eu efficitur ex. Vivamus ac rutrum nunc. Ut iaculis nisl id arcu
				facilisis, eget vestibulum purus pharetra. Vestibulum bibendum purus ac tincidunt venenatis. Sed
				porttitor erat quis arcu vulputate, a tincidunt arcu accumsan. Aenean et auctor metus, ac maximus velit.
				Donec id tempor nulla, at dictum nisi. Nulla tincidunt elementum suscipit. Cras nisi mi, sollicitudin
				sed rhoncus a, fringilla sed dui. Nulla auctor accumsan nisl, eu faucibus dolor auctor ut. Donec
				convallis venenatis felis, vitae ullamcorper eros commodo nec. Cras non erat risus. Nam rhoncus arcu
				vitae quam ullamcorper, vel semper libero semper. Cras maximus, ligula eu sodales suscipit, erat
				libero consequat justo, ut aliquam mauris magna a lorem. Fusce vitae ipsum vitae nulla viverra finibus.

				Suspendisse pellentesque sodales velit et pellentesque. Pellentesque sollicitudin id est sit amet
				sagittis. Aenean id consequat magna. Pellentesque ultricies massa non leo convallis consequat. Maecenas
				magna magna, ullamcorper nec condimentum quis, bibendum ac augue. Vestibulum mattis vehicula mi. Lorem
				ipsum dolor sit amet, consectetur adipiscing elit.
				<a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
			</p>
			<h3>Installed CLI Plugins</h3>
			<ul>
				<li>
					<a
						href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
						target="_blank"
						rel="noopener"
					>
						babel
					</a>
				</li>
				<li>
					<a
						href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
						target="_blank"
						rel="noopener"
					>
						eslint
					</a>
				</li>
			</ul>
			<h3>Essential Links</h3>
			<ul>
				<li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
				<li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
				<li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
				<li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
				<li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
			</ul>
			<h3>Ecosystem</h3>
			<ul>
				<li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
				<li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
				<li>
					<a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">
						vue-devtools
					</a>
				</li>
				<li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
				<li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
			</ul>
		</div>
  </div>
</template>

<script>
export default {
  name: 'Editor',
  props: {
    content: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.editor-content-container{
	width: 50%;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
