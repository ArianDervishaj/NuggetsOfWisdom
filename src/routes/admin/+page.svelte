<script lang="ts">
	let username = '';
	let password = '';
	let errorMessage = '';
	let loggedIn = false;

	async function login() {
		const res = await fetch('/admin/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (res.ok) {
			loggedIn = true;
			errorMessage = '';
		} else {
			errorMessage = 'Invalid credentials';
		}
	}
</script>

<div class="login-form">
	<h1>Admin Login</h1>
	{#if !loggedIn}
		<div>
			<input type="text" bind:value={username} placeholder="Username" />
			<input type="password" bind:value={password} placeholder="Password" />
			<button on:click={login}>Login</button>
		</div>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
	{:else}
		<p>Logged in successfully! You can now upload SVGs.</p>
	{/if}
</div>

<style>
	.login-form {
		max-width: 400px;
		margin: auto;
		padding: 1rem;
		background: #f8f8f8;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}
	.error {
		color: red;
	}
</style>
