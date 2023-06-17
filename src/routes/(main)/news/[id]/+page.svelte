<script lang="ts">
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"
	import Loading from "$lib/components/others/loading.svelte"
	import type { Article } from "$lib/types/article"

	let loading: boolean = true
	let article: Article

	onMount(async () => {
		const res = await fetch("/api/getNewsArticle", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		if (data == "FAIL") {
			goto("/error")
		}

		article = data.results[0]

		loading = false
	})
</script>

{#if loading}
	<Loading />
{:else}
	<div class="newsarticle">
		<img src={article.image.original} alt={article.title} draggable="false" />
		<h1>{article.title}</h1>
		<h2>Author: {article.authors}</h2>
		<div class="newscontent">
			{@html article.body}
		</div>
	</div>
{/if}
