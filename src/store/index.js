import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';
import { RULES } from '../cryptarch/constants';

const abortController = new AbortController();
let putEngramRequest;

export default createStore({
  state: {
		username: '',
		engrams: [],
		lastCommittedEngramData: {},
  },
	getters: {
		engramRootBlocks: (state) => (engramTitle) => {
			return state.engrams.find((engram) => engram.title === engramTitle).rootBlocks;
		},
	},
  mutations: {
		SET_USERNAME_AND_ALL_ENGRAMS(state, { username, allEngramsTitleAndContent }) {
			state.username = username;
			// console.log(`state.username: ${state.username}`);

			state.engrams = allEngramsTitleAndContent.map((engramTitleAndContent) => ({
				title: engramTitleAndContent.title,
				rootBlocks: Buffer.from(engramTitleAndContent.content, 'base64').toString('ascii').split(RULES.rootBlockSeparator),
			}));
			// console.log(`state.engrams: ${JSON.stringify(state.engrams)}`);
		},
		REMOVE_ALL_USER_DATA(state) {
			state.username = '';
			state.engrams = [];
			state.lastCommittedEngramData = {};

			// console.log(`state.username: ${state.username}`);
			// console.log(`state.engrams: ${state.engrams}`);
			// console.log(`state.lastCommittedEngramData: ${JSON.stringify(state.lastCommittedEngramData)}`);
		},
		ADD_ENGRAM(state, engramTitle) {
			state.engrams.push({
				title: engramTitle,
				rootBlocks: [`* ${engramTitle}`],
			});
		},
		SET_LAST_COMMITTED_ENGRAM_DATA(state, engramTitle) {
			const matchingEngramData = state.engrams.find((stateEngramData) => stateEngramData.title === engramTitle);

			state.lastCommittedEngramData = JSON.parse(JSON.stringify(matchingEngramData));
		},
		ADD_ENGRAM_BLOCK(state, { engramTitle, blockIndex, blockContent }) {
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks.splice(blockIndex, 0, blockContent);
		},
		SET_ENGRAM_BLOCK(state, { engramTitle, blockIndex, blockContent }) { // TODO: might need to set the whole engram if multiple simultaneous block edits are possible?
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks[blockIndex] = blockContent;

			console.log([...new Proxy(state.engrams.find((engram) => engram.title === engramTitle).rootBlocks, [])]);
		},
		REMOVE_ENGRAM_BLOCK(state, { engramTitle, blockIndex }) {
			state.engrams.find((engram) => engram.title === engramTitle).rootBlocks.splice(blockIndex, 1);
		},
  },
  actions: {
		cancelPreviousRequest() {
			if (abortController) {
				abortController.abort();
			}
		},
		async fetchUserAndAllEngrams({ commit, state }) {
			try {
				const response = await axios.get('http://localhost:3000/', { withCredentials: true, signal: abortController.signal });

				if (response.data && !state.username) {
					commit('SET_USERNAME_AND_ALL_ENGRAMS', {
						username: response.data.username,
						allEngramsTitleAndContent: response.data.allEngramsTitleAndContent,
					});
				} else if (!response.data) {
					console.log(response.data);
					console.log('Cannot fetch user; user is not authenticated.');
				}
			} catch (error) {
				console.error(error);
			}
		},
		async createEngram({ commit, dispatch }, engramTitle) {
			commit('ADD_ENGRAM', engramTitle);

			// call axios to save newly created engram to Github
			await dispatch('putEngram', { engramTitle, engramIsNew: true });
		},
		async putEngram({ state }, { engramTitle, engramIsNew }) {
			try {
				const matchedEngram = state.engrams.find((engram) => engram.title === engramTitle);
				const engramContent = matchedEngram.rootBlocks.join('\n\n');

				await axios.put('http://localhost:3000/engram',
					{ engramTitle, engramContent, engramIsNew },
					{ withCredentials: true, signal: abortController.signal }); // there shouldn't be any need to call cancelPreviousRequest here; the last uninterrupted request must be sent regardless of whatever route the user is in
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from indivudal engram is canceled.');
				} else {
					console.error(error);
				}
			}
		},
		setPutEngramRequestAndLastCommittedEngramData({ commit, dispatch }, engramTitle) {
			if (putEngramRequest) { // remove queue if it was created within the past specified amount of seconds
				clearTimeout(putEngramRequest);
			}

			putEngramRequest = setTimeout(async () => {
				await dispatch('putEngram', { engramTitle, engramIsNew: false });
				commit('SET_LAST_COMMITTED_ENGRAM_DATA', engramTitle); // assume only one file can be updated at one time
			}, 1500);
		},
  },
  modules: {
  },
	plugins: [createPersistedState({
		storage: window.sessionStorage,
	})],
});
