import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';
import { RULES } from '../cryptarch/constants';

let abortController = null;

export default createStore({
  state: {
		username: '',
		engrams: [],
  },
	getters: {
		engramRootBlocks: (state) => (engramTitle) => {
			const foundEngram = state.engrams.find((engram) => engram.title === engramTitle);
			if (foundEngram) {
				return state.engrams.find((engram) => engram.title === engramTitle).rootBlocks;
			}
			return [];
		},
	},
  mutations: {
		SET_USERNAME(state, serverUsername) {
			state.username = serverUsername;
		},
		SET_ENGRAMS(state, serverEngramTitles) { // the content needs to be decoded first, then parsed into rootBlocks.
			state.engrams = serverEngramTitles.map((serverEngramTitle) => ({
					title: serverEngramTitle,
					rootBlocks: [],
				}));

			console.log(state.engrams);
		},
		SET_ENGRAM(state, serverEngramData) {
			const matchedStateEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === serverEngramData.title);

			if (!matchedStateEngramData) {
				state.engrams.push(serverEngramData);
			} else if (matchedStateEngramData && JSON.stringify(matchedStateEngramData) !== JSON.stringify(serverEngramData)) {
				matchedStateEngramData.rootBlocks = Buffer.from(serverEngramData.content, 'base64').toString('ascii').split(RULES.rootBlockSeparator);
			}
		},
		SET_ENGRAM_BLOCK(state, { engramTitle, blockIndex, blockContent }) {
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks[blockIndex] = blockContent;

			console.log([...new Proxy(state.engrams.find((engram) => engram.title === engramTitle).rootBlocks, [])]);
		},
		ADD_ENGRAM_BLOCK(state, { engramTitle, blockIndex, blockContent }) {
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks.splice(blockIndex, 0, blockContent);
		},
		REMOVE_ENGRAM_BLOCK(state, { engramTitle, blockIndex }) {
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
		async fetchUser({ commit, state }) {
			try {
				const response = await axios.get('http://localhost:3000/', { withCredentials: true });

				if (response.data && !state.username) {
					commit('SET_USERNAME', response.data);
				} else if (!response.data) {
					console.log('Cannot fetch user; user is not authenticated.');
				}
			} catch (error) {
				console.error(error);
			}
		},
		async fetchEngramList({ commit, state }) {
			try {
				const response = await axios.get('http://localhost:3000/engrams', { withCredentials: true, signal: abortController.signal });

				if (state.engrams.length === 0) {
					commit('SET_ENGRAMS', response.data);
				} else {
					const stateEngramTitles = state.engrams.map((stateEngram) => stateEngram.title);

					if (JSON.stringify(stateEngramTitles) !== JSON.stringify(response.data)) {
						commit('SET_ENGRAMS', response.data);
					}
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from Engrams is canceled.');
				} else {
					console.error(error);
				}
			}
		},
		async fetchEngram({ commit, state }, engramTitle) {
			try {
				const response = await axios.get(`http://localhost:3000/engrams/${encodeURIComponent(engramTitle)}`, { withCredentials: true, signal: abortController.signal });

				if (state.engrams.length === 0) {
					commit('SET_ENGRAM', response.data);
				} else {
					const matchedStateEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === response.data.title);

					if (!matchedStateEngramData) {
						commit('SET_ENGRAM', response.data);
					} else if (matchedStateEngramData && JSON.stringify(matchedStateEngramData) !== JSON.stringify(response.data)) {
						commit('SET_ENGRAM', response.data);
					}
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from indivudal engram is canceled.');
				} else {
					console.error(error);
				}
			}
		},
		async putEngram({ state }, { engramTitle }) {
			try {
				// const payload = { engramTitle, blockIndex, blockContent };
				// commit('SET_ENGRAM_BLOCK', payload);
				console.log(state.engrams);
				console.log(`engramTitle: ${engramTitle}`);

				const matchedEngram = state.engrams.find((engram) => engram.title === engramTitle);
				const engramContent = matchedEngram.rootBlocks.join('\n\n');
				await axios.put('http://localhost:3000/engram',
					{ engramTitle, engramContent },
					{ withCredentials: true, signal: abortController.signal });
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from indivudal engram is canceled.');
				} else {
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
