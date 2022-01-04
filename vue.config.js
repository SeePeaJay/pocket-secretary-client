module.exports = {
  devServer: {
    proxy: {
      '^/auth/github': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
      },
    },
  },
};
