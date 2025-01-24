<script>
	import '../app.css';
	import { goto } from '$app/navigation';

	let { children } = $props();

	function goBack() {
		goto('.');
	}
</script>

<div class="flex flex-col min-h-screen">
	<header class="relative flex items-center justify-center py-4 bg-gray-100">
		<button 
			onclick={goBack} 
			class="absolute left-4 text-2xl text-gray-700 hover:text-gray-900 transition-colors"
		>
			&LeftArrow;
		</button>
		<h1 class="text-3xl font-bold text-center">Nuggets of Wisdom</h1>
	</header>

	<main class="flex-grow flex items-center justify-center p-4">
		{@render children()}
	</main>

	<footer class="bg-gray-100 text-center py-4 text-sm text-gray-600">
		Fais avec amour par Arian
	</footer>
</div>