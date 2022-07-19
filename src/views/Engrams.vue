<template>
	<AppBar />
	<div class="engrams-pane">
		<div class="engrams-area">
			<h1>Engrams</h1>
			<table>
				<tr>
					<th >
						<img v-show="atLeastOneEngramTitleIsSelected"
							id="active-trash-icon" src="../assets/trash.svg" alt="tabler trash icon" @click="togglePopup()"
						/>
						<img v-show="!atLeastOneEngramTitleIsSelected"
							id="disabled-trash-icon" src="../assets/trash-off.svg" alt="tabler trash icon"
						/>
					</th>
				</tr>
				<tr>
					<th >
						<input type="checkbox" id="select-all-checkbox" v-model="selectAll">
					</th>
					<th @click="updateCurrentSortState('Title')">Title</th>
					<th @click="updateCurrentSortState('Word Count')">Word Count</th>
					<th @click="updateCurrentSortState('Last Modified')">Last Modified</th>
				</tr>
				<tr v-for="engramTitle in allEngramTitlesByUser" :key="engramTitle"> <!-- engramTitle should be unique -->
					<td style="text-align:center">
						<input type="checkbox" v-model="selectedEngramTitles" :value="engramTitle"> <!-- must have the value bind for this to work -->
					</td>
					<td>
						<router-link :to="{ name: 'Engram', params: { engramTitle: engramTitle }}">{{ engramTitle }}</router-link>
					</td>
					<td style="text-align:center">{{ getWordCount(engramTitle) }}</td>
					<td style="text-align:center">{{ getLastModifiedAsLocaleString(engramTitle) }}</td>
				</tr>
			</table>
		</div>
	</div>
	<DeletePopup v-if="popupShouldBeActive" :selected-engram-titles="selectedEngramTitles" @toggle-popup="togglePopup()" @clear-selected-engrams="clearSelectedEngramTitles()"/>
</template>

<script>
import AppBar from '../components/AppBar.vue';
import DeletePopup from '../components/DeletePopup.vue';

export default {
  name: 'Engrams',
	components: {
		AppBar,
		DeletePopup,
	},
	data() {
		return {
			selectedEngramTitles: [],
			popupShouldBeActive: false,
			currentSortedColumn: 'Title',
			sortIsReverse: false,
		};
	},
  computed: {
		allEngramTitlesByUser() { // does not include Starred, and are sorted based on current sorted column
			const allEngramTitlesByUser = this.$store.state.engrams.filter((engram) => engram.title !== 'Starred').map((engram) => engram.title);

			if (this.currentSortedColumn === 'Title') {
				allEngramTitlesByUser.sort(this.sortTitlesByAlphabeticalOrder);
			} else if (this.currentSortedColumn === 'Word Count') {
				allEngramTitlesByUser.sort(this.sortTitlesByDecreasingWordCount);
			} else {
				allEngramTitlesByUser.sort(this.sortTitlesByLastModified);
			}

			if (this.sortIsReverse) {
				allEngramTitlesByUser.reverse();
			}

			return allEngramTitlesByUser;
		},
		selectAll: {
			get() {
				return this.allEngramTitlesByUser ? this.selectedEngramTitles.length === this.allEngramTitlesByUser.length : false;
			},
			set(value) {
				const selected = [];

				if (value) {
					this.allEngramTitlesByUser.forEach((engramTitle) => {
						selected.push(engramTitle);
					});
				}

				this.selectedEngramTitles = selected;
			},
		},
		atLeastOneEngramTitleIsSelected() {
			return this.selectedEngramTitles.length;
		},
	},
	methods: {
		sortTitlesByAlphabeticalOrder(titleA, titleB) {
			if (titleA.toUpperCase() < titleB.toUpperCase()) {
				return -1;
			}

			if (titleA.toUpperCase() > titleB.toUpperCase()) {
				return 1;
			}

			return 0;
		},
		sortTitlesByDecreasingWordCount(titleA, titleB) {
			if (this.getWordCount(titleA) < this.getWordCount(titleB)) {
				return 1;
			}

			if (this.getWordCount(titleA) > this.getWordCount(titleB)) {
				return -1;
			}

			return 0;
		},
		sortTitlesByLastModified(titleA, titleB) {
			if (this.getLastModifiedAsDate(titleA).getTime() < this.getLastModifiedAsDate(titleB).getTime()) {
				return 1;
			}

			if (this.getLastModifiedAsDate(titleA).getTime() > this.getLastModifiedAsDate(titleB).getTime()) {
				return -1;
			}

			return 0;
		},
		getWordCount(engramTitle) { // TODO: ignore block markers?
			const { rootBlocks } = this.$store.state.engrams.find((engram) => engram.title === engramTitle);

			return rootBlocks.reduce((accumulator, currentValue) => {
				if (currentValue) {
					return accumulator + currentValue.trim().split(/[\n\r\s]+/).length; // words are characters delimited by any amount of whitespaces or newlines
				}

				return accumulator;
			}, 0);
		},
		getLastModifiedAsDate(engramTitle) {
			return new Date(this.$store.state.engrams.find((engram) => engram.title === engramTitle).lastModified);
		},
		getLastModifiedAsLocaleString(engramTitle) {
			return this.getLastModifiedAsDate(engramTitle).toLocaleString(
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
		updateCurrentSortState(columnToSort) {
			if (this.currentSortedColumn === columnToSort) {
				this.sortIsReverse = !this.sortIsReverse;
			} else {
				this.currentSortedColumn = columnToSort;
				this.sortIsReverse = false;
			}
		},
		togglePopup() {
			this.popupShouldBeActive = !this.popupShouldBeActive;
		},
		clearSelectedEngramTitles() {
			this.selectedEngramTitles = [];
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

#disabled-trash-icon {
	filter: invert(85%) sepia(10%) saturate(8%) hue-rotate(319deg) brightness(104%) contrast(90%); /* #dddddd */
}

#active-trash-icon {
filter: invert(58%) sepia(0%) saturate(420%) hue-rotate(146deg) brightness(94%) contrast(79%);
}

#active-trash-icon:hover {
	filter: invert(21%) sepia(9%) saturate(2115%) hue-rotate(169deg) brightness(96%) contrast(89%); /* #2c3e50 */
	cursor: pointer;
}

table {
	width: 100%;
}
</style>
