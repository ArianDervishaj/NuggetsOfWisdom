<script lang="ts">
	import { onMount } from 'svelte';
	import panzoom from 'panzoom';

	export let data;
	console.log(data.note.file_path);
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

	// Function to trigger the download
	function downloadSVG() {
		const link = document.createElement('a');

		link.href = `${data.note.file_path}`;

		const fileName = data.note.file_path.split('/').pop();
		link.download = fileName;

		link.click();
	}
</script>

<div class="container mx-auto w-full overflow-hidden px-4 py-8">
	<h1 class="mb-6 text-center text-3xl font-bold text-green-700">
		{data.note.name.replace(/-/g, ' ')}
	</h1>
	<div class="overflow-hidden">
		<div
			id="svg-container"
			class="svg-container flex h-[60vh] items-center justify-center rounded-lg border border-gray-200 bg-white shadow-md"
		>
			<img
				src={`${data.note.file_path}`}
				alt="SVG"
				class="max-h-full max-w-full cursor-move object-contain"
				
			/>
		</div>
	</div>
</div>

<div class="text-center">
	<button
		onclick={downloadSVG}
		class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
	>
		Download SVG
	</button>
</div>
