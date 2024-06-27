<script>
	import { onMount } from 'svelte';

	let users = [];
	let loggedInUserName;
	let loggedInUserId;

	onMount(async () => {
		// Überprüfe, ob ein Benutzer im Local Storage gespeichert ist
		loggedInUserName = await localStorage.getItem('loggedInUserName');
		loggedInUserId = await parseInt(localStorage.getItem('loggedInUserId'));
		try {
			const response = await fetch('/backend/users');
			if (response.ok) {
				users = await response.json();
			} else {
				console.error('Error fetching users:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching users:', error);
		}
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<main>
	<h1>Users</h1>
	<ul>
		{#each users as user}
			<li>{user.name}</li> <!-- Anpassung je nach Attributen deiner User -->
		{/each}
	</ul>
</main>
