<template>
	<AppBar />
	<div class="engrams-pane">
		<div class="engrams-area">
			<h1>Engrams</h1>
			<table>
				<tr>
					<th >
						<img
							id="trash-icon"
							:class="atLeastOneEngramIsSelected ? 'active-trash-icon' : 'disabled-trash-icon'"
							:src="(this.atLeastOneEngramIsSelected) ? require('../assets/trash.svg') : require('../assets/trash-off.svg')"
							alt="tabler trash icon"
						/>
					</th>
				</tr>
				<tr>
					<th >
						<input type="checkbox" id="select-all-checkbox" v-model="selectAll">
					</th>
					<th>Title</th>
					<th>Word Count</th>
					<th>Last Modified</th>
				</tr>
				<tr v-for="engramTitle in allEngramTitles" :key="engramTitle"> <!-- engramTitle should be unique -->
					<td style="text-align:center">
						<input type="checkbox" v-model="selectedEngrams" :value="engramTitle"> <!-- must have the value bind for this to work -->
					</td>
					<td>
						<router-link :to="{ name: 'Engram', params: { engramTitle: engramTitle }}">{{ engramTitle }}</router-link>
					</td>
					<td style="text-align:center">{{ getWordCount(engramTitle) }}</td>
					<td style="text-align:center">2022-07-01</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
import AppBar from '../components/AppBar.vue';

export default {
  name: 'Engrams',
	components: {
		AppBar,
	},
	data() {
		return {
			// selectAllShouldBeOn: false,
			selectedEngrams: [],
			isInDefaultState: true,
		};
	},
  computed: {
		allEngramTitles() {
			return this.$store.state.engrams.map((engram) => engram.title).sort((a, b) => {
				const titleA = a.toUpperCase();
				const titleB = b.toUpperCase();

				if (titleA < titleB) {
					return -1;
				}

				if (titleA > titleB) {
					return 1;
				}

				return 0;
			});
		},
		selectAll: {
			get() {
				return this.allEngramTitles ? this.selectedEngrams.length === this.allEngramTitles.length : false;
			},
			set(value) {
				const selected = [];

				if (value) {
					this.allEngramTitles.forEach((engramTitle) => {
						selected.push(engramTitle);
					});
				}

				this.selectedEngrams = selected;
			},
		},
		// trashIconSrc() {
		// 	return (this.atLeastOneEngramIsSelected) ? require('../assets/trash.svg') : '../assets/trash.svg';
		// },
		engrams() { // Starred engram at top
			return [...this.$store.state.engrams].sort((a, b) => {
				const titleA = a.title.toUpperCase();
				const titleB = b.title.toUpperCase();

				if (titleA < titleB) {
					return -1;
				}

				if (titleA > titleB) {
					return 1;
				}

				return 0;
			});
		},
		atLeastOneEngramIsSelected() {
			// console.log(this.selectedEngrams.length);
			return this.selectedEngrams.length;
		},
		allEngramsAreSelected() {
			return this.selectedEngrams.length === this.allEngramTitles.length;
		},
		atLeastOneCheckboxIsSelected() {
			return this.selectAllShouldBeOn || this.atLeastOneEngramIsSelected;
		},
	},
	methods: {
		getWordCount(engramTitle) { // TODO: ignore block markers?
			const { rootBlocks } = this.$store.state.engrams.find((engram) => engram.title === engramTitle);

			return rootBlocks.reduce((accumulator, currentValue) => {
				if (currentValue) {
					// console.log(currentValue.trim().split(/[\n\r\s]+/));
					return accumulator + currentValue.trim().split(' ').length;
				}

				return accumulator;
			}, 0);
		},
		toggleSelectAllEngrams() {
			// console.log(this.selectAll);
			// this.selectAllShouldBeOn = !this.selectAllShouldBeOn;

			if (this.selectedEngrams.length === this.allEngramTitles.length) {
				this.selectAllShouldBeOn = false;
				this.selectedEngrams = [];
			} else {
				console.log('after toggle all ...');
				this.selectAllShouldBeOn = true;
				this.selectedEngrams = [...this.allEngramTitles];
				console.log(this.selectedEngrams);
			}
		},
		// selectAll() {
		// 	console.log();
		// },
		modifySelectedEngrams(engramTitle) {
			const foundTitle = this.selectedEngrams.find((selectedTitle) => selectedTitle === engramTitle);
			// console.log(foundTitle);
			if (foundTitle) {
				console.log(this.selectedEngrams.indexOf(foundTitle));
				this.selectedEngrams.splice(this.selectedEngrams.indexOf(foundTitle), 1);
				// console.log(this.selectedEngrams);
				// this.selectAllShouldBeOn = true;
			} else {
				this.selectedEngrams.push(engramTitle);
				// this.selectAllShouldBeOn = true;
			}
			console.log(this.selectedEngrams);

			// if (this.atLeastOneEngramIsSelected) {
			// 	this.selectAllShouldBeOn = true;
			// } else {
			// 	this.selectAllShouldBeOn = false;
			// }

			// if (this.selected.length === this.engrams.length) {
			// 	this.selectAll = true;
			// }
		},
	},
};
</script>

<style scoped>
.engrams-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.engrams-area {
	width: 75%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 8px 0 8px;
}

h1 {
	margin-bottom: 5%;
}

table {
	width: 100%;
}

/* #trash-icon {
	width: 24px;
	height: 24px;
} */

.disabled-trash-icon {
	filter: invert(85%) sepia(10%) saturate(8%) hue-rotate(319deg) brightness(104%) contrast(90%); /* #dddddd */
}

.active-trash-icon {
filter: invert(58%) sepia(0%) saturate(420%) hue-rotate(146deg) brightness(94%) contrast(79%);
}

.active-trash-icon:hover {
	filter: invert(21%) sepia(9%) saturate(2115%) hue-rotate(169deg) brightness(96%) contrast(89%); /* #2c3e50 */
	cursor: pointer;
}

</style>
