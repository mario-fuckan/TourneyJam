<script lang="ts">
	import Icon from "@iconify/svelte"
	import type { Game } from "$lib/types/gamesGame"
	import { onMount } from "svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import { goto } from "$app/navigation"
	import { toSlug } from "$lib/actions/tag-slug"

	let search: string = ""
	let games: Game[] = []
	let loading: boolean = true

	onMount(async () => {
		const res = await fetch("/api/getAllGames", {
			method: "POST"
		})

		const data = await res.json()

		games = data.games
		loading = false
	})
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
					<input
						type="text"
						placeholder="Search..."
						maxlength="15"
						on:keyup={() => ""}
						bind:value={search}
					/>
					<Icon icon="material-symbols:search" />
				</div>
			</div>
		</div>
		<hr />
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
	</div>
{/if}
