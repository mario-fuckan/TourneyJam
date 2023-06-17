<script lang="ts">
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"

	$: ({ pathname } = $page.url)
	$: ({ id } = $page.params)

	$: newPath = pathname.slice(0, -id.length)
</script>

<div class="error">
	<h1>{$page.status}</h1>
	<h2>{$page.error?.message}</h2>
	<button
		on:click={() => {
			goto(newPath)
		}}>Go back</button
	>
</div>
