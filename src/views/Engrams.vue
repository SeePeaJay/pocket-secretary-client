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
					<th>Title</th>
					<th>Word Count</th>
					<th>Last Modified</th>
				</tr>
				<tr v-for="engramTitle in allEngramTitlesByUser" :key="engramTitle"> <!-- engramTitle should be unique -->
					<td style="text-align:center">
						<input type="checkbox" v-model="selectedEngramTitles" :value="engramTitle"> <!-- must have the value bind for this to work -->
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
		};
	},
  computed: {
		allEngramTitlesByUser() { // does not include Starred
			return this.$store.state.engrams.filter((engram) => engram.title !== 'Starred').map((engram) => engram.title).sort((a, b) => {
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
		togglePopup() {
			this.popupShouldBeActive = !this.popupShouldBeActive;
		},
		clearSelectedEngramTitles() {
			this.selectedEngramTitles = [];
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
