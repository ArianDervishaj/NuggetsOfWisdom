<script lang="ts">
	import type { PageData } from './$types'; 
	export let data: PageData; 
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<h1 class="text-4xl font-bold text-green-700 mb-8 text-center">Semestres</h1>
	<div class="grid gap-4">
		{#each data.semesters as semester (semester.id)}
			<a 
				href={semester.name} 
				class="block bg-white shadow-md rounded-lg p-4 hover:bg-green-50 transition-colors duration-300 ease-in-out border border-gray-200 text-center text-lg font-semibold text-green-800 hover:shadow-lg"
			>
				{semester.name.replace(/-/g, ' ')}
			</a>
		{/each}
	</div>
</div>