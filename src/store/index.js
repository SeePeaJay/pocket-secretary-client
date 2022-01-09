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
			return state.engrams.find((engram) => engram.title === engramTitle).rootBlocks;
		},
	},
  mutations: {
		setUsername(state, serverUsername) {
			state.username = serverUsername;
		},
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
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks.splice(blockIndex, 0, blockContent);
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
		async fetchUser({ commit, state }) {
			try {
				const response = await axios.get('http://localhost:3000/', { withCredentials: true });

				if (response.data && !state.username) {
					commit('setUsername', response.data);
				} else if (!response.data) {
					console.log('Cannot fetch user; user is not authenticated.');
				}
			} catch (error) {
				console.error(error);
			}
		},
		async fetchEngrams({ commit, state }) {
			try {
				const response = await axios.get('http://localhost:3000/engrams', { withCredentials: true, signal: abortController.signal });

				if (state.engrams.length === 0) {
					commit('setEngrams', response.data);
				} else {
					const stateEngramTitles = state.engrams.map((stateEngram) => stateEngram.title);

					if (JSON.stringify(stateEngramTitles) !== JSON.stringify(response.data.engramTitles)) {
						commit('setEngrams', response.data);
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
					console.log('Request from indivudal engram is canceled.');
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
