<script lang="ts">
	import Icon from "@iconify/svelte"
	import type { Game } from "$lib/types/gamesGame"
	import { page } from "$app/stores"
	import type { User } from "$lib/types/user"
	import type { Tag } from "$lib/types/tags"
	import { onMount } from "svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import { goto } from "$app/navigation"
	import NoContent from "$lib/components/others/nocontent.svelte"

	let search: string = ""
	let games: Game[] = []
	let tags: Tag[] = []
	let gamesCount: number
	let loading: boolean = true
	let user: User

	$: ({ user } = $page.data)

	onMount(async () => {
		const res = await fetch("/api/getAllGames", {
			method: "POST"
		})

		const data = await res.json()

		games = data.games
		gamesCount = data.gamesCount
		loading = false
	})

	async function loadMoreGames() {
		const res = await fetch("/api/searchGames", {
			method: "POST",
			body: JSON.stringify(games.length)
		})

		const { moreGames } = await res.json()

		games = [...games, ...moreGames]
	}

	async function searchAllGames() {
		if (search != "") {
			const res = await fetch("/api/gamesSearchGames", {
				method: "POST",
				body: JSON.stringify(search)
			})

			const data = await res.json()

			games = data.games
			tags = data.tags
		} else {
			loading = true
			const res = await fetch("/api/getAllGames", {
				method: "POST"
			})

			const data = await res.json()

			games = data.games
			gamesCount = data.gamesCount
			loading = false
		}
	}
</script>

<svelte:head>
	<title>TourneyJam - Games</title>
</svelte:head>

<div class="gameswrapper">
	<div class="gamesheader">
		<div class="gamesheaderleft">
			<h1>Games</h1>
			<p>Browse all available games and tags.</p>
		</div>
		<div class="gamesheaderright">
			<div class="dashboardsearch">
				{#if String(user?.role) == "admin" || String(user?.role) == "company"}
					<a href="/games/add">Add a game</a>
				{/if}
				<input
					type="text"
					placeholder="Search games or tags..."
					maxlength="15"
					on:keyup={searchAllGames}
					bind:value={search}
				/>
				<Icon icon="material-symbols:search" />
			</div>
		</div>
	</div>
	<hr />
	{#if loading}
		<Loading />
	{:else if games.length == 0 && tags.length == 0}
		<NoContent missing="games or tags" />
	{:else}
		<div class="games">
			{#each games as { id, game_cover, game_name, game_tags, activeTournaments }}
				<a href="/games/{id}" class="gameitem">
					<img
						src={game_cover == "tournament.png" ? "/tournament.png" : game_cover}
						alt={game_name}
						loading="lazy"
					/>
					<h1>{game_name}</h1>
					<p>{activeTournaments} tournaments</p>
					<div class="gametags">
						{#each game_tags as tag}
							<button on:click|preventDefault={() => goto("/tag/" + tag)}>{tag}</button>
						{/each}
					</div>
				</a>
			{/each}
			{#each tags as { tag }}
				<a href="/tag/{tag}" class="tagitem">
					<span>#</span>
					<h1>{tag}</h1>
				</a>
			{/each}
		</div>
		{#if games.length < gamesCount && search == ""}
			<button class="more" on:click={loadMoreGames}>Load More Games</button>
		{/if}
	{/if}
</div>
