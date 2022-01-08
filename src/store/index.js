import { createStore } from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import { RULES } from '../cryptarch/constants';

export default createStore({
  state: {
		engrams: [
			// {
			// 	title: 'Title',
			// 	rootBlocks: [
			// 		'* Title',
			// 		'*_1 Level 1 Subtitle',
			// 		'*_2 Level 2 Subtitle',
			// 		'*_3 Level 3 Subtitle',
			// 		'. Unordered list item a\n. Unordered list item b\n. Unordered list item c',
			// 		'1. Ordered list item 1\n2. Ordered list item 2\n3. Ordered list item 3',
			// 		'---',
			// 		'$http://static.wikia.nocookie.net/ninjajojos-bizarre-adventure/images/f/f7/Made_in_Heaven.png/revision/latest/top-crop/width/360/height/450?cb=20210721002513{}',
			// 		'A paragraph.',
			// 		'A paragraph with *bold*, /italic/, _underlined_, =highlighted=, and -strikethrough- text.',
			// 		'A paragraph with nested styles: *bold, /italic, _underlined, =highlighted, and -strikethrough-=_/* text.',
			// 		'A paragraph with two types of links: autolink ( www.google.com ), and _link alias_(www.google.com).',
			// 		'A paragraph with an inline image: $http://static.wikia.nocookie.net/ninjajojos-bizarre-adventure/images/f/f7/Made_in_Heaven.png/revision/latest/top-crop/width/360/height/450?cb=20210721002513{}.',
			// 	],
			// },
		],
  },
	getters: {
		engramRootBlocks: (state) => (engramTitle) => {
			console.log(state.engrams);
			// console.log(typeof state.engrams.find((engram) => engram.title === engramTitle).rootBlocks);
			return state.engrams.find((engram) => engram.title === engramTitle).rootBlocks;
		},
	},
  mutations: {
		setEngrams(state, serverEngramTitles) { // the content needs to be decoded first, then parsed into rootBlocks.
			state.engrams = serverEngramTitles.map((serverEngramTitle) => ({
					title: serverEngramTitle,
					rootBlocks: [],
				}));

			console.log(state.engrams);
		},
		setEngram(state, serverEngramData) {
			const matchedStateEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === serverEngramData.title);

			if (!matchedStateEngramData) {
				state.engrams.push(serverEngramData);
			} else if (matchedStateEngramData && JSON.stringify(matchedStateEngramData) !== JSON.stringify(serverEngramData)) {
				matchedStateEngramData.rootBlocks = Buffer.from(serverEngramData.content, 'base64').toString('ascii').split(RULES.rootBlockSeparator);
			}
		},
		createEngramBlock(state, { engramTitle, blockIndex, blockContent }) {
			// console.log([...new Proxy(state.engrams.find((engram) => engram.title === engramTitle).blocks, [])]);
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks.splice(blockIndex, 0, blockContent);
			// console.log([...new Proxy(state.engrams.find((engram) => engram.title === engramTitle).blocks, [])]);
		},
		updateEngramBlock(state, { engramTitle, blockIndex, blockContent }) {
			// console.log(`engramTitle at store: ${engramTitle}`);
			// console.log(`blockIndex at store: ${blockIndex}`);
			// console.log(`blockContent at store: ${blockContent}`);

			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks[blockIndex] = blockContent;

			console.log([...new Proxy(state.engrams.find((engram) => engram.title === engramTitle).rootBlocks, [])]);
		},
		deleteEngramBlock(state, { engramTitle, blockIndex }) {
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks.splice(blockIndex, 1);
		},
  },
  actions: {
		async fetchEngrams({ commit, state }) {
			const response = await axios.get('http://localhost:3000/engrams', { withCredentials: true });

			if (state.engrams.length === 0) {
				commit('setEngrams', response.data);
			} else {
				const stateEngramTitles = state.engrams.map((stateEngram) => stateEngram.title);

				if (JSON.stringify(stateEngramTitles) !== JSON.stringify(response.data)) {
					commit('setEngrams', response.data);
				}
			}
		},
		async fetchEngram({ commit, state }, engramTitle) {
			const response = await axios.get(`http://localhost:3000/${encodeURIComponent(engramTitle)}`, { withCredentials: true });

			console.log(response);
			if (state.engrams.length === 0) {
				commit('setEngram', response.data);
			} else {
				const matchedStateEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === response.data.title);

				if (!matchedStateEngramData) {
					commit('setEngram', response.data);
				} else if (matchedStateEngramData && JSON.stringify(matchedStateEngramData) !== JSON.stringify(response.data)) {
					commit('setEngram', response.data);
				}
			}
		},
  },
  modules: {
  },
	plugins: [createPersistedState({
		storage: window.sessionStorage,
	})],
});
