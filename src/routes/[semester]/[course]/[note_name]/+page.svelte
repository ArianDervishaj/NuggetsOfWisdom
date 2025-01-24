<script lang="ts">
	import { onMount } from 'svelte';
	import panzoom from 'panzoom';

	export let data;

	let panzoomInstance: ReturnType<typeof panzoom>;

	onMount(() => {
		const svgContainer = document.getElementById('svg-container') as HTMLElement;

		if (svgContainer) {
			// Initialize Panzoom on the SVG container
			panzoomInstance = panzoom(svgContainer, {
				maxZoom: 10,
				minZoom: 0.1,
				zoomSpeed: 0.1
			});
		}
	});
</script>

<div>
	<h1>{data.note.name}</h1>
	<div id="svg-container" class="svg-container">
		<img src={data.note.file_path} alt="SVG" />
	</div>
</div>
