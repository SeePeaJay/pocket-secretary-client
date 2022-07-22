<template>
	<AppBar />
	<div class="engrams-pane">
		<div class="engrams-area">
			<h1>Engrams</h1>
			<table>
				<tr>
					<th>
						<img v-show="atLeastOneEngramTitleIsSelected"
							class="icon"
							src="../assets/trash.svg" alt="tabler trash icon"
							:style="alertPopupShouldAppear ? 'filter: invert(21%) sepia(9%) saturate(2115%) hue-rotate(169deg) brightness(96%) contrast(89%);' : ''"
							@click="togglePopup()"
						/> <!-- $default-filter -->
						<img v-show="!atLeastOneEngramTitleIsSelected"
							class="icon disabled" src="../assets/trash-off.svg" alt="tabler trash off icon"
						/>
					</th>
				</tr>
				<tr>
					<th>
						<input type="checkbox" id="select-all-checkbox" v-model="selectAll">
					</th>
					<th
						:class="currentSortFunction === sortTitlesByAlphabeticalOrder ? 'column-header selected' : 'column-header'" @click="updateSort(sortTitlesByAlphabeticalOrder)"
					>
						<div id="div-in-title-column-header">
							Title
							<img v-show="currentSortFunction === sortTitlesByAlphabeticalOrder && sortIsReverse"
								class="column-header-icon" src="../assets/sort-descending.svg" alt="tabler sort descending icon"
							/>
							<img v-show="currentSortFunction === sortTitlesByAlphabeticalOrder && !sortIsReverse"
								class="column-header-icon" src="../assets/sort-ascending.svg" alt="tabler sort ascending icon"
							/>
						</div>
					</th>
					<th
						:class="currentSortFunction === sortTitlesByWordCount ? 'column-header selected' : 'column-header'"
						@click="updateSort(sortTitlesByWordCount)"
					>
						<div>
							Word Count
							<img v-show="currentSortFunction === sortTitlesByWordCount && sortIsReverse"
								class="column-header-icon" src="../assets/sort-ascending.svg" alt="tabler sort ascending icon"
							/>
							<img v-show="currentSortFunction === sortTitlesByWordCount && !sortIsReverse"
								class="column-header-icon" src="../assets/sort-descending.svg" alt="tabler sort descending icon"
							/>
						</div>
					</th>
					<th
						:class="currentSortFunction === sortTitlesByLastModified ? 'column-header selected' : 'column-header'"
						@click="updateSort(sortTitlesByLastModified)"
					>
						<div>
							Last Modified
							<img v-show="currentSortFunction === sortTitlesByLastModified && sortIsReverse"
								class="column-header-icon" src="../assets/sort-ascending.svg" alt="tabler sort ascending icon"
							/>
							<img v-show="currentSortFunction === sortTitlesByLastModified && !sortIsReverse"
								class="column-header-icon" src="../assets/sort-descending.svg" alt="tabler sort descending icon"
							/>
						</div>
					</th>
				</tr>
				<tr v-for="engramTitle in allEngramTitlesByUser(currentSortFunction, sortIsReverse)" :key="engramTitle"> <!-- engramTitle should be unique -->
					<td style="text-align:center">
						<input type="checkbox" v-model="selectedEngramTitles" :value="engramTitle"> <!-- must have the value bind for this to work -->
					</td>
					<td>
						<router-link class="engram-link" :to="{ name: 'Engram', params: { engramTitle: engramTitle }}">
							{{ engramTitle }}
						</router-link>
					</td>
					<td style="text-align:center">{{ wordCount(engramTitle) }}</td>
					<td style="text-align:center">{{ lastModifiedDateAsLocaleString(engramTitle) }}</td>
				</tr>
			</table>
		</div>
	</div>
	<AlertPopup v-if="alertPopupShouldAppear"
		:engram-titles-to-delete="selectedEngramTitles"
		@close-popup="togglePopup()" @clear-selected-engrams="clearSelectedEngramTitles()"
	/>
</template>

<script>
import { mapGetters } from 'vuex';
import AppBar from '../components/AppBar.vue';
import AlertPopup from '../components/AlertPopup.vue';

export default {
  name: 'Engrams',
	components: {
		AppBar,
		AlertPopup,
	},
	data() {
		return {
			currentSortFunction: this.sortTitlesByLastModified,
			sortIsReverse: false,
			selectedEngramTitles: [],
			alertPopupShouldAppear: false, // for styling
		};
	},
  computed: {
		...mapGetters(['allEngramTitlesByUser', 'wordCount', 'lastModifiedDate', 'lastModifiedDateAsLocaleString']),
		selectAll: { // https://stackoverflow.com/a/38033792
			get() {
				return this.allEngramTitlesByUser(this.currentSortFunction, this.sortIsReverse)
					? this.selectedEngramTitles.length === this.allEngramTitlesByUser(this.currentSortFunction, this.sortIsReverse).length
					: false;
			},
			set(value) {
				const selected = [];

				if (value) {
					this.allEngramTitlesByUser(this.currentSortFunction, this.sortIsReverse).forEach((engramTitle) => {
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
		sortTitlesByWordCount(titleA, titleB) {
			if (this.wordCount(titleA) < this.wordCount(titleB)) {
				return 1;
			}

			if (this.wordCount(titleA) > this.wordCount(titleB)) {
				return -1;
			}

			return 0;
		},
		sortTitlesByLastModified(titleA, titleB) {
			if (this.lastModifiedDate(titleA).getTime() < this.lastModifiedDate(titleB).getTime()) {
				return 1;
			}

			if (this.lastModifiedDate(titleA).getTime() > this.lastModifiedDate(titleB).getTime()) {
				return -1;
			}

			return 0;
		},
		updateSort(newSortFunction) {
			if (this.currentSortFunction === newSortFunction) {
				this.sortIsReverse = !this.sortIsReverse;
			} else {
				this.currentSortFunction = newSortFunction;
				this.sortIsReverse = false;
			}
		},
		togglePopup() {
			this.alertPopupShouldAppear = !this.alertPopupShouldAppear;
		},
		clearSelectedEngramTitles() {
			this.selectedEngramTitles = [];
		},
	},
};
</script>

<style lang="scss" scoped>
.engrams-pane {
	height: calc(100vh - 40px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;

	.engrams-area {
		width: 75%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin: 8px 0 8px;
	}
}

h1 {
	margin-bottom: 5%;
}

table {
	width: 100%;
}

.column-header {
	&:hover {
		cursor: pointer;
		text-decoration: underline;
	}

	div { /* to align icon with column header */
		display: flex;
		align-items: center;

		&:not(#div-in-title-column-header) {
			justify-content: center;
		}

		&:hover {
			cursor: pointer;
			text-decoration: underline;
		}
	}

	&.selected {
		text-decoration: underline;
	}
}

.column-header-icon {
	width: 16px;
	height: 16px;

	filter: $default-filter;
}
</style>
