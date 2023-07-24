<script lang="ts">
	import Icon from "@iconify/svelte"
	import type { Game } from "$lib/types/gamesGame"
	import { page } from "$app/stores"
	import type { User } from "$lib/types/user"
	import { onMount } from "svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import { goto } from "$app/navigation"
	import { toSlug } from "$lib/actions/tag-slug"
	import NoContent from "$lib/components/others/nocontent.svelte"

	let search: string = ""
	let games: Game[] = []
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
		const res = await fetch("/api/gamesSearchGames", {
			method: "POST",
			body: JSON.stringify(search)
		})

		const data = await res.json()

		games = data.games
	}
</script>

<svelte:head>
	<title>TourneyJam - Games</title>
</svelte:head>

{#if loading}
	<Loading />
{:else}
	<div class="gameswrapper">
		<div class="gamesheader">
			<div class="gamesheaderleft">
				<h1>Games</h1>
				<p>Browse all available games.</p>
			</div>
			<div class="gamesheaderright">
				<div class="dashboardsearch">
					{#if String(user?.role) == "admin" || String(user?.role) == "company"}
						<a href="/games/add">Add a game</a>
					{/if}
					<input
						type="text"
						placeholder="Search..."
						maxlength="15"
						on:keyup={searchAllGames}
						bind:value={search}
					/>
					<Icon icon="material-symbols:search" />
				</div>
			</div>
		</div>
		<hr />
		{#if games.length == 0}
			<NoContent missing="games" />
		{:else}
			<div class="games">
				{#each games as { id, game_cover, game_name, game_tags, activeTournaments }}
					<a href="/games/{id}" class="gameitem">
						<img src={game_cover} alt={game_name} />
						<h1>{game_name}</h1>
						<p>{activeTournaments} tournaments</p>
						<div class="gametags">
							{#each game_tags as tag}
								<button on:click|preventDefault={() => goto("/tags/" + toSlug(tag))}>{tag}</button>
							{/each}
						</div>
					</a>
				{/each}
			</div>
			{#if games.length < gamesCount}
				<button class="more" on:click={loadMoreGames}>Load More Games</button>
			{/if}
		{/if}
	</div>
{/if}
