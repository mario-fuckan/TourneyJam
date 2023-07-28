<script lang="ts">
	import { page } from "$app/stores"
	import { onMount, tick } from "svelte"
	import Icon from "@iconify/svelte"
	import NoContent from "$lib/components/others/nocontent.svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import type { User } from "$lib/types/user"
	import type { Game } from "$lib/types/gamesGame"

	let user: User
	let games: Game[] = []
	let search: string
	let loading: boolean = true

	onMount(async () => {
		loading = true

		const res = await fetch("/api/getGamesByTag", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		games = data.games
		loading = false
	})

	async function searchByTag() {
		const res = await fetch("/api/searchGamesByTag", {
			method: "POST",
			body: JSON.stringify({
				tag: $page.params.id,
				search
			})
		})

		const data = await res.json()

		games = data.games
	}

	$: ({ user } = $page.data)

	function capitalize(e: string): string {
		return e.charAt(0).toUpperCase() + e.slice(1)
	}
</script>

<svelte:head>
	<title>TourneyJam - {$page.params.id} games</title>
</svelte:head>

<div class="gameswrapper">
	<div class="gamesheader">
		<div class="gamesheaderleft">
			<h1>{capitalize($page.params.id)}</h1>
			<p>Browse all {$page.params.id} games.</p>
		</div>
		<div class="gamesheaderright">
			<div class="dashboardsearch">
				{#if String(user?.role) == "admin" || String(user?.role) == "company"}
					<a href="/tag/add">Add a tag</a>
				{/if}
				<input
					type="text"
					placeholder="Search..."
					maxlength="15"
					on:keyup={searchByTag}
					bind:value={search}
				/>
				<Icon icon="material-symbols:search" />
			</div>
		</div>
	</div>
	<hr />
	{#if loading}
		<Loading />
	{:else if games.length != 0}
		<div class="games">
			{#each games as { id, game_cover, game_name, activeTournaments }}
				<a href="/games/{id}" class="gameitem">
					<img
						src={game_cover == "tournament.png" ? "/tournament.png" : game_cover}
						alt={game_name}
					/>
					<h1>{game_name}</h1>
					<p>{activeTournaments} tournaments</p>
				</a>
			{/each}
		</div>
	{:else}
		<NoContent missing={`${$page.params.id} games`} />
	{/if}
</div>
