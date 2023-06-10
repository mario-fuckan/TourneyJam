<script lang="ts">
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import { fly } from "svelte/transition"

	let options: string[] = []

	onMount(() => {
		if (localStorage.getItem("hide")) {
			//@ts-ignore
			options = JSON.parse(localStorage.getItem("hide")).options
		}
	})

	function setSettings() {
		if (options.length > 0) {
			localStorage.setItem(
				"hide",
				JSON.stringify({
					options
				})
			)
		} else {
			localStorage.removeItem("hide")
		}

		window.location.href = $page.url.pathname
	}
</script>

<div class="settingswindow" transition:fly={{ x: -50 }}>
	<div class="soption">
		<p>Hide Gaming News</p>
		<input bind:group={options} type="checkbox" value="News" checked />
	</div>
	<button on:click={setSettings}>Apply Changes</button>
</div>
