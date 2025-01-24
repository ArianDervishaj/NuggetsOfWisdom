<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	export let data: PageData;

	const currentPath = page.url.pathname;
</script>

<div>
	<h1 class="is-size-1">Notes</h1>
	<div>
		{#each data.notes as note (note.id)}
			<a href={currentPath + '/' + note.name}>{note.name.replace(/-/g, ' ')}<br /></a>
		{/each}
	</div>
</div>
