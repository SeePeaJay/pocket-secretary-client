module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'indent': 0,
		'no-tabs': 0,
		'max-len': 0, // no need for this with editor config
		'class-methods-use-this': 0,
		'no-plusplus': 0,
		'space-unary-ops': [0, { 'words': true, 'nonwords': false }],
		'no-param-reassign': [2, { 'props': false }],
		'vue/no-multiple-template-root': 0,
		'arrow-body-style': 0,
		'prefer-object-spread': 0,
		'no-underscore-dangle': [0, { 'allow': ['_vnode'] }],
  },
};
