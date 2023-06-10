<script lang="ts">
	import type { PageData } from "./$types"
	import { goto } from "$app/navigation"

	export let data: PageData

	$: articles = data.articles.results

	let numberOfNews: number = 8
	let allNews: any[] = []
	let loading: boolean = false

	async function moreNews() {
		loading = true
		const res = await fetch("/api/moreNews", {
			method: "POST",
			body: JSON.stringify(numberOfNews)
		})

		const data = await res.json()

		allNews = [...allNews, ...data]

		loading = false

		numberOfNews += 8
	}
</script>

<div class="section">
	<h1>Discover News</h1>
	<hr />
	<div class="morenews">
		{#each articles as { title, image, id, deck }}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<article on:click={() => goto("/news/" + id)}>
				<img src={image.original} alt={title} />
				<h2>{title}</h2>
				<hr />
				<p>{deck}</p>
			</article>
		{/each}
		{#each allNews as { title, image, id, deck }}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<article on:click={() => goto("/news/" + id)}>
				<img src={image.original} alt={title} />
				<h2>{title}</h2>
				<hr />
				<p>{deck}</p>
			</article>
		{/each}
	</div>
	<button class="more" on:click={moreNews}>Load More News</button>
	{#if loading}
		<div class="loading">
			<div class="sk-chase">
				<div class="sk-chase-dot" />
				<div class="sk-chase-dot" />
				<div class="sk-chase-dot" />
				<div class="sk-chase-dot" />
				<div class="sk-chase-dot" />
				<div class="sk-chase-dot" />
			</div>
		</div>
	{/if}
</div>
