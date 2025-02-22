<script lang="ts">
	import { onMount } from 'svelte';
	let email = '';
	let password = '';
	let errorMessage = '';
	let token = '';
	let semesters = [];
	let courses = [];
	let selectedSemester = '';
	let selectedCourse = '';
	let noteName = '';
	let svgFile: File | null = null; // Track the selected file

	/**
	 * Fetch semesters from the server on page load.
	 */
	onMount(async () => {
		const res = await fetch('/admin/semesters');

		if (res.ok) {
			const data = await res.json();
			semesters = data;
		}
	});

	/**
	 * Fetch courses based on the selected semester.
	 */
	async function fetchCourses() {
		const semester = semesters.find((s) => s.name === selectedSemester);

		if (semester) {
			courses = semester.courses;
		} else {
			courses = [];
		}
	}

	/**
	 * Log in the user with the provided email and password.
	 */
	async function login() {
		const res = await fetch('/admin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (res.ok) {
			const data = await res.json();
			token = data.token; // Save the JWT token
			errorMessage = '';
		} else {
			errorMessage = 'Invalid credentials';
		}
	}

	/**
	 * Log out the user by clearing the token and sending a DELETE request.
	 */
	async function logout() {
		token = ''; // Clear the local token
		await fetch('/admin', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	/**
	 * Handle form submission to upload a new note.
	 */
	async function handleSubmit() {
		if (!selectedSemester || !selectedCourse || !noteName || !svgFile) {
			errorMessage = 'Please fill in all the fields.';
			return;
		}

		const formData = new FormData();
		formData.append('course_name', selectedCourse);
		formData.append('name', noteName);
		formData.append('file', svgFile);

		// Send request to upload note
		const res = await fetch('/admin/upload', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			errorMessage = '';
			// Reset the form or provide feedback
			alert('Note uploaded successfully!');
		} else {
			errorMessage = 'Failed to upload the note.';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
		<div>
			<h1 class="text-center text-3xl font-extrabold text-green-700">Admin Login</h1>
		</div>
		{#if !token}
			<form class="mt-8 space-y-6" on:submit|preventDefault={login}>
				<div class="-space-y-px rounded-md shadow-sm">
					<input
						type="text"
						bind:value={email}
						placeholder="Email"
						required
						class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
					/>
					<input
						type="password"
						bind:value={password}
						placeholder="Password"
						required
						class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
					/>
				</div>

				{#if errorMessage}
					<p class="text-center text-sm text-red-500">{errorMessage}</p>
				{/if}

				<div>
					<button
						type="submit"
						class="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						Login
					</button>
				</div>
			</form>
		{:else}
			<div class="space-y-4 text-center">
				<p class="font-semibold text-green-600">Logged in successfully!</p>
				<button
					on:click={logout}
					class="w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
				>
					Logout
				</button>
			</div>
		{/if}

		{#if token}
			<form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
				<div>
					<label for="semester" class="block text-sm font-medium text-gray-700">Semester</label>
					<select
						id="semester"
						bind:value={selectedSemester}
						on:change={fetchCourses}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="" disabled>Select Semester</option>
						{#each semesters as semester}
							<option value={semester.name}>{semester.name}</option>
						{/each}
					</select>
				</div>

				{#if selectedSemester}
					<div>
						<label for="course" class="block text-sm font-medium text-gray-700">Course</label>
						<select
							id="course"
							bind:value={selectedCourse}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						>
							<option value="" disabled>Select Course</option>
							{#each courses as course}
								<option value={course.name}>{course.name}</option>
							{/each}
						</select>
					</div>
				{/if}

				<div>
					<label for="noteName" class="block text-sm font-medium text-gray-700">Note Name</label>
					<input
						type="text"
						id="noteName"
						bind:value={noteName}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						placeholder="Note Name"
					/>
				</div>
				<div>
					<label for="svgFile" class="block text-sm font-medium text-gray-700">SVG File</label>
					<input
						type="file"
						id="svgFile"
						accept="image/svg+xml"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						on:change={(e) => (svgFile = (e.target as HTMLInputElement).files?.[0] || null)}
					/>
				</div>
				{#if errorMessage}
					<p class="text-center text-sm text-red-500">{errorMessage}</p>
				{/if}
				<div>
					<button
						type="submit"
						class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Upload Note
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
