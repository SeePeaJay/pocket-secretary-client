import { createStore } from 'vuex';

export default createStore({
  state: {
		engrams: [
			{
				id: 1,
				rootBlocks: [
					'* Title',
					'*_1 Level 1 Subtitle',
					'*_2 Level 2 Subtitle',
					'*_3 Level 3 Subtitle',
					'. Unordered list item a\n. Unordered list item b\n. Unordered list item c',
					'1. Ordered list item 1\n2. Ordered list item 2\n3. Ordered list item 3',
					'---',
					'$http://static.wikia.nocookie.net/ninjajojos-bizarre-adventure/images/f/f7/Made_in_Heaven.png/revision/latest/top-crop/width/360/height/450?cb=20210721002513{}',
					'A paragraph.',
					'A paragraph with *bold*, /italic/, _underlined_, =highlighted=, and -strikethrough- text.',
					'A paragraph with nested styles: *bold, /italic, _underlined, =highlighted, and -strikethrough-=_/* text.',
					'A paragraph with two types of links: autolink ( www.google.com ), and _link alias_(www.google.com).',
					'A paragraph with an inline image: $http://static.wikia.nocookie.net/ninjajojos-bizarre-adventure/images/f/f7/Made_in_Heaven.png/revision/latest/top-crop/width/360/height/450?cb=20210721002513{}.',
				],
			},
			{
				id: 2,
			},
		],
  },
  mutations: {
		createEngramBlock(state, { engramId, blockIndex, blockContent }) {
			// console.log([...new Proxy(state.engrams.find((engram) => engram.id === engramId).blocks, [])]);
			state.engrams.find((engram) => engram.id === engramId).rootBlocks.splice(blockIndex, 0, blockContent);
			// console.log([...new Proxy(state.engrams.find((engram) => engram.id === engramId).blocks, [])]);
		},
		updateEngramBlock(state, { engramId, blockIndex, blockContent }) {
			// console.log(`engramId at store: ${engramId}`);
			// console.log(`blockIndex at store: ${blockIndex}`);
			// console.log(`blockContent at store: ${blockContent}`);

			state.engrams.find((engram) => engram.id === engramId).rootBlocks[blockIndex] = blockContent;

			console.log([...new Proxy(state.engrams.find((engram) => engram.id === engramId).rootBlocks, [])]);
		},
		deleteEngramBlock(state, { engramId, blockIndex }) {
			state.engrams.find((engram) => engram.id === engramId).rootBlocks.splice(blockIndex, 1);
		},
  },
  actions: {
  },
  modules: {
  },
});
