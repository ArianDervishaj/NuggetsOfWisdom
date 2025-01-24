<script lang="ts">
	import type { PageData } from '../[note]/$types';
	import { page } from '$app/state';
	export let data: PageData;

	const currentPath = page.url.pathname;
</script>

<h1>{data.note.name}</h1>
<img src="{data.note.file_path}" alt="">