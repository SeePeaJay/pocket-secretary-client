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
  },
	getters: {
		userIsLoggedIn: (state) => {
			return !!state.username;
		},
		allEngramTitlesByUser: (state) => (sortFunction, sortIsReverse) => { // does not include Starred, and are sorted based on current sorted column
			return sortIsReverse
				? state.engrams.filter((engram) => engram.title !== 'Starred').map((engram) => engram.title).sort(sortFunction).reverse()
				: state.engrams.filter((engram) => engram.title !== 'Starred').map((engram) => engram.title).sort(sortFunction);
		},
		wordCount: (state, getters) => (engramTitle) => { // TODO: ignore block markers?
			return getters.engramRootBlocks(engramTitle).reduce((accumulator, currentValue) => {
				if (currentValue) {
					return accumulator + currentValue.trim().split(/[\n\r\s]+/).length; // words are characters delimited by any amount of whitespaces or newlines
				}

				return accumulator;
			}, 0);
		},
		lastModifiedDate: (state) => (engramTitle) => {
			return new Date(state.engrams.find((engram) => engram.title === engramTitle).lastModified);
		},
		lastModifiedDateAsLocaleString: (state, getters) => (engramTitle) => {
			return getters.lastModifiedDate(engramTitle).toLocaleString(
				'en-CA',
				{
					year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
				},
			);
				/*
		 			* https://stackoverflow.com/a/36478563
		 			* toLocaleString + arguments should make date appear as YYYY-MM-DD, HH:MM
		 				* https://stackoverflow.com/a/63160519
		 		*/
		},
		engramRootBlocks: (state) => (engramTitle) => {
			const foundEngram = state.engrams.find((engram) => engram.title === engramTitle);
			if (foundEngram) { // for some reason, a route change still affects old EngramEditor's computed property that said, so this check is added; that said, this check is needed anyway for completeness
				return foundEngram.rootBlocks;
			}

			return null;
		},
		engramTitleHasTag: (state) => (engramTitle, tag) => {
			const foundEngram = state.engrams.find((engram) => engram.title === engramTitle);

			if (foundEngram) {
				return foundEngram.rootBlocks[0].includes(`${tag}`);
			}

			return null;
		},
	},
  mutations: {
		SET_USERNAME_AND_ALL_ENGRAMS(state, { username, dataForAllEngrams }) {
			state.username = username;
			// console.log(`state.username: ${state.username}`);

			state.engrams = dataForAllEngrams.map((engramData) => ({
				title: engramData.title,
				rootBlocks: Buffer.from(engramData.content, 'base64').toString('ascii').split(RULES.rootBlockSeparator),
				lastModified: engramData.lastModified, // as a ISO 8601 UTC string
			}));

			// console.log(`state.engrams: ${JSON.stringify(state.engrams)}`);
		},
		REMOVE_ALL_USER_DATA(state) {
			state.username = '';
			state.engrams = [];
		},
		ADD_ENGRAM(state, engramTitle) {
			state.engrams.push({
				title: engramTitle,
				rootBlocks: [`* ${engramTitle}`],
				lastModified: `${new Date().toISOString().split('.')[0]}Z`,
			});
		},
		REMOVE_ENGRAMS(state, engramTitles) {
			engramTitles.forEach((title) => {
				const foundEngram = state.engrams.find((engram) => engram.title === title);
				state.engrams.splice(state.engrams.indexOf(foundEngram), 1);
			});
		},
		ADD_ENGRAM_BLOCK(state, { engramTitle, blockIndex, blockContent }) {
			const engramToBeUpdated = state.engrams.find((engram) => engram.title === engramTitle);

			engramToBeUpdated.rootBlocks.splice(blockIndex, 0, blockContent);
			engramToBeUpdated.lastModified = `${new Date().toISOString().split('.')[0]}Z`;
		},
		SET_ENGRAM_BLOCK(state, { engramTitle, blockIndex, blockContent }) { // might need to set the whole engram if multiple simultaneous block edits are possible?
			const engramToBeUpdated = state.engrams.find((engram) => engram.title === engramTitle);

			engramToBeUpdated.rootBlocks[blockIndex] = blockContent;
			engramToBeUpdated.lastModified = `${new Date().toISOString().split('.')[0]}Z`;
		},
		REMOVE_ENGRAM_BLOCK(state, { engramTitle, blockIndex }) {
			const engramToBeUpdated = state.engrams.find((engram) => engram.title === engramTitle);

			engramToBeUpdated.rootBlocks.splice(blockIndex, 1);
			engramToBeUpdated.lastModified = `${new Date().toISOString().split('.')[0]}Z`;
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
						dataForAllEngrams: response.data.dataForAllEngrams,
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
			await dispatch('putEngram', { engramTitle, commitMessage: 'create' });
		},
		async putEngram({ state }, { engramTitle, commitMessage }) {
			try {
				const matchedEngram = state.engrams.find((engram) => engram.title === engramTitle);
				const engramContent = matchedEngram.rootBlocks.join('\n\n');

				await axios.put('http://localhost:3000/engram',
					{ engramTitle, engramContent, commitMessage },
					{ withCredentials: true, signal: abortController.signal }); // there shouldn't be any need to call cancelPreviousRequest here; the last uninterrupted request must be sent regardless of whatever route the user is in
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request from indivudal engram is canceled.');
				} else {
					console.error(error);
				}
			}
		},
		setPutEngramRequest({ dispatch }, { engramTitle, commitMessage }) {
			if (putEngramRequest) { // remove queue if it was created within the past specified amount of seconds
				clearTimeout(putEngramRequest);
			}

			putEngramRequest = setTimeout(async () => {
				await dispatch('putEngram', { engramTitle, commitMessage }); // assume only one file can be updated at one time
			}, 1500);
		},
		async destroyEngrams({ commit }, { engramTitles, commitMessage }) {
			commit('REMOVE_ENGRAMS', engramTitles);

			try {
				await axios.delete('http://localhost:3000/engrams', {
					headers: { 'Content-Type': 'application/json; charset=utf-8' },
					data: { engramTitles, commitMessage },
					withCredentials: true,
					signal: abortController.signal,
				}); // delete format is a bit different ...
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request to delete engrams is canceled.');
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
