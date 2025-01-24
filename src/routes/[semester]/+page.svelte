<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';

	export let data: PageData;

	// access the current path
	const currentPath = page.url.pathname;
</script>

<h1 class="is-size-1">Cours</h1>
<div>
	{#each data.courses as course (course.id)}
		<!-- Append course.name to the current path -->
		<a href={currentPath + '/' + course.name}>{course.name.replace(/-/g, ' ')}<br /></a>
	{/each}
</div>
