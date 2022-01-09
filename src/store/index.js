import { createStore } from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import { RULES } from '../cryptarch/constants';

let abortController = null;

export default createStore({
  state: {
		engrams: [],
  },
	getters: {
		engramRootBlocks: (state) => (engramTitle) => {
			// console.log(state.engrams);
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
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks[blockIndex] = blockContent;

			console.log([...new Proxy(state.engrams.find((engram) => engram.title === engramTitle).rootBlocks, [])]);
		},
		deleteEngramBlock(state, { engramTitle, blockIndex }) {
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks.splice(blockIndex, 1);
		},
  },
  actions: {
		setAbortController() {
			abortController = new AbortController();

			return abortController !== null;
		},
		cancelPreviousRequest() {
			if (abortController) {
				abortController.abort();
			}
		},
		async fetchEngrams({ commit, state }) {
			try {
				const response = await axios.get('http://localhost:3000/engrams', { withCredentials: true, signal: abortController.signal });

				if (state.engrams.length === 0) {
					commit('setEngrams', response.data);
				} else {
					const stateEngramTitles = state.engrams.map((stateEngram) => stateEngram.title);

					if (JSON.stringify(stateEngramTitles) !== JSON.stringify(response.data)) {
						commit('setEngrams', response.data);
					}
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from Engrams is canceled');
				} else {
					console.error(error);
				}
			}
		},
		async fetchEngram({ commit, state }, engramTitle) {
			try {
				const response = await axios.get(`http://localhost:3000/engrams/${encodeURIComponent(engramTitle)}`, { withCredentials: true, signal: abortController.signal });

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
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from indivudal Engram is canceled');
				} else {
					// handle error
					console.error(error);
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
