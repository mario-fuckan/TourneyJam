<script lang="ts">
	import { onMount } from "svelte"
	import { goto } from "$app/navigation"
	import type { Articles } from "$lib/types/news"
	import Loading from "$lib/components/others/loading.svelte"

	let articles: Articles[] = []
	let loading: boolean = true

	onMount(async () => {
		const res = await fetch("/api/getAllNews", {
			method: "POST"
		})
		const data = await res.json()

		articles = data.results

		loading = false
	})

	let loadMore: boolean = false
	let numberOfNews: number = 8
	let allNews: any[] = []

	async function moreNews() {
		loadMore = true
		const res = await fetch("/api/moreNews", {
			method: "POST",
			body: JSON.stringify(numberOfNews)
		})

		const data = await res.json()

		allNews = [...allNews, ...data]

		loadMore = false

		numberOfNews += 8
	}
</script>

<svelte:head>
	<title>TourneyJam - News</title>
</svelte:head>

<div class="section">
	{#if loading}
		<Loading />
	{:else}
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
	{/if}
	{#if loadMore}
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
