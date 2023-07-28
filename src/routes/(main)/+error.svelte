<script lang="ts">
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"

	let newPath: string

	$: ({ pathname } = $page.url)
	$: ({ id } = $page.params)

	$: if (id) {
		newPath = pathname.slice(0, -id.length)
	} else {
		newPath = pathname
	}
</script>

<svelte:head>
	<title>TourneyJam - 404</title>
</svelte:head>

<div class="error">
	<h1>{$page.status}</h1>
	<h2>{$page.error?.message}</h2>
	<button
		on:click={() => {
			goto(newPath)
		}}>Go back</button
	>
</div>
