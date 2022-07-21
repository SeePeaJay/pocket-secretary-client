module.exports = {
  devServer: {
    proxy: {
      '^/auth/github': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
      },
    },
  },
	css: {
		loaderOptions: {
			scss: {
				additionalData: `
          @import "@/styles/main.scss";
        `,
			},
		},
	},
};
