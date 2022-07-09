import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';
import { RULES } from '../cryptarch/constants';

let abortController = null;
let putEngramRequest;

export default createStore({
  state: {
		username: '',
		engrams: [],
		lastCommittedEngramData: {},
  },
	getters: {
		engramRootBlocks: (state) => (engramTitle) => {
			// const foundEngram = state.engrams.find((engram) => engram.title === engramTitle);
			// if (foundEngram) {
			// 	return state.engrams.find((engram) => engram.title === engramTitle).rootBlocks;
			// }
			// return [];
			return state.engrams.find((engram) => engram.title === engramTitle).rootBlocks;
		},
	},
  mutations: {
		SET_USERNAME(state, serverUsername) {
			state.username = serverUsername;
		},
		ADD_ENGRAM(state, engramTitle) {
			state.engrams.push({
				title: engramTitle,
				rootBlocks: [`* ${engramTitle}`],
			});
		},
		SET_ENGRAMS(state, serverEngramTitles) { // the content needs to be decoded first, then parsed into rootBlocks.
			state.engrams = serverEngramTitles.map((serverEngramTitle) => ({
					title: serverEngramTitle,
					rootBlocks: [],
				}));

			console.log(state.engrams);
		},
		SET_ENGRAM(state, serverEngramData) {
			const matchingStateEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === serverEngramData.title);

			if (!matchingStateEngramData) {
				state.engrams.push(serverEngramData);
			} else if (matchingStateEngramData && JSON.stringify(matchingStateEngramData) !== JSON.stringify(serverEngramData)) {
				matchingStateEngramData.rootBlocks = Buffer.from(serverEngramData.content, 'base64').toString('ascii').split(RULES.rootBlockSeparator);
			}
		},
		SET_LAST_COMMITTED_ENGRAM_DATA(state, engramTitle) {
			const matchingEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === engramTitle);

			state.lastCommittedEngramData = JSON.parse(JSON.stringify(matchingEngramData));
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
		setPutEngramRequestAndLastCommittedEngramData({ commit, dispatch }, engramTitle) { // TODO: add async/await?
			if (putEngramRequest) {
				clearTimeout(putEngramRequest);
			}

			putEngramRequest = setTimeout(() => {
				dispatch('putEngram', { engramTitle, engramIsNew: false });
				commit('SET_LAST_COMMITTED_ENGRAM_DATA', engramTitle); // assume only one file can be updated at one time
			}, 1500);
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
					const matchingStateEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === response.data.title);

					if (!matchingStateEngramData) {
						commit('SET_ENGRAM', response.data);
					} else if (matchingStateEngramData && JSON.stringify(matchingStateEngramData) !== JSON.stringify(response.data)) {
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
		async putEngram({ state }, { engramTitle, engramIsNew }) {
			try {
				const matchedEngram = state.engrams.find((engram) => engram.title === engramTitle);
				const engramContent = matchedEngram.rootBlocks.join('\n\n');

				await axios.put('http://localhost:3000/engram',
					{ engramTitle, engramContent, engramIsNew },
					{ withCredentials: true, signal: abortController.signal });
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from indivudal engram is canceled.');
				} else {
					console.error(error);
				}
			}
		},
		async createEngram({ commit, dispatch }, engramTitle) {
			commit('ADD_ENGRAM', engramTitle);

			// call axios to save newly created engram to Github
			await dispatch('putEngram', { engramTitle, engramIsNew: true });
		},
  },
  modules: {
  },
	plugins: [createPersistedState({
		storage: window.sessionStorage,
	})],
});
