<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1 class="is-size-1">Semesters</h1>
<div>
	{#each data.semesters as semester (semester.id)}
		<a href={semester.name}>{semester.name.replace(/-/g, ' ')}<br/></a>
	{/each}
</div>
