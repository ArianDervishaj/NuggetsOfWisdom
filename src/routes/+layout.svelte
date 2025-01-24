<script>
	import '../app.css';
	import { goto } from '$app/navigation';

	let { children } = $props();

	function goBack() {
		goto('.');
	}
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
	<header
		class="sticky top-0 z-10 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-800 py-6 shadow-md"
	>
		<button
			onclick={goBack}
			aria-label="Go back"
			class="absolute left-4 transform rounded-full p-2 text-white transition-all duration-300 ease-in-out hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<h1 class="text-center text-4xl font-extrabold tracking-tight text-white">Nuggets of Wisdom</h1>
	</header>

	<main class="flex flex-grow justify-center bg-gray-100 p-6 w-full">
		<div class="w-full w-full rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
			{@render children()}
		</div>
	</main>

	<footer
		class="bg-gradient-to-r from-green-600 to-green-800 py-5 text-center text-sm text-white shadow-inner"
	>
		<span class="opacity-80">Fais avec amour par Arian</span>
	</footer>
</div>
