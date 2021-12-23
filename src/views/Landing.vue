<template>
	<Editor :content="engram"/>
</template>

<script>
import Editor from '../components/Editor.vue';

export default {
	name: 'Landing',
	data() {
		return {
			engram: '* Title\n\n*_1 Level 1 Subtitle\n\n*_2 Level 2 Subtitle\n\n*_3 Level 3 Subtitle\n\n. Unordered list item a\n. Unordered list item b\n. Unordered list item c\n\n1. Ordered list item 1\n2. Ordered list item 2\n3. Ordered list item 3\n\n---\n\n$http://static.wikia.nocookie.net/ninjajojos-bizarre-adventure/images/f/f7/Made_in_Heaven.png/revision/latest/top-crop/width/360/height/450?cb=20210721002513{}\n\nA paragraph.\n\nA paragraph with *bold*, /italic/, _underlined_, =highlighted=, and -strikethrough- text.\n\nA paragraph with nested styles: *bold, /italic, _underlined, =highlighted, and -strikethrough-=_/* text.\n\nA paragraph with two types of links: autolink ( www.google.com ), and _link alias_(www.google.com).\n\nA paragraph with an inline image: $http://static.wikia.nocookie.net/ninjajojos-bizarre-adventure/images/f/f7/Made_in_Heaven.png/revision/latest/top-crop/width/360/height/450?cb=20210721002513{}.',
		};
	},
	components: {
		Editor,
  },
};
</script>
