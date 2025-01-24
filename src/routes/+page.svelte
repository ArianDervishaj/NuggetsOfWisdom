<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold text-green-700">Semestres</h1>
	<div class="grid gap-4">
		{#each data.semesters as semester (semester.id)}
			<a
				href={`/notes/${semester.name}`}
				class="block rounded-lg border border-gray-200 bg-white p-4 text-center text-lg font-semibold text-green-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-green-50 hover:shadow-lg"
			>
				{semester.name.replace(/-/g, ' ')}
			</a>
		{/each}
	</div>
</div>
