<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';

	/**
	 * Data object containing notes information.
	 * @type {PageData}
	 * @property {Array} notes - An array of note objects.
	 * @property {string} notes[].name - The name of the note.
	 * @property {string} notes[].id - The unique identifier of the note.
	 */
	export let data: PageData;

	/**
	 * The current path of the page.
	 * @type {string}
	 */
	const currentPath = page.url.pathname;
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<h1 class="text-4xl font-bold text-green-700 mb-8 text-center">Notes</h1>
	<div class="grid gap-4">
		{#each data.notes as note (note.id)}
			<a 
				href={currentPath + '/' + note.name}
				class="block bg-white shadow-md rounded-lg p-4 hover:bg-green-50 transition-colors duration-300 ease-in-out border border-gray-200 text-center text-lg font-semibold text-green-800 hover:shadow-lg"
			>
				{note.name.replace(/-/g, ' ')}
			</a>
		{/each}
	</div>
</div>