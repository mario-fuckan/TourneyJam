<script lang="ts">
	import Icon from "@iconify/svelte"
	import type { Tournament } from "$lib/types/tournament"
	import type { User } from "$lib/types/user"
	import type { Tag } from "$lib/types/tags"
	import { onMount } from "svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import { goto } from "$app/navigation"
	import NoContent from "$lib/components/others/nocontent.svelte"

	let search: string = ""
	let tournaments: Tournament[] = []
	let tournamentCount: number
	let loading: boolean = true

	onMount(async () => {
		const res = await fetch("/api/getAllTournaments", {
			method: "POST"
		})

		const data = await res.json()

		tournaments = data.tournaments
		tournamentCount = data.tournamentCount
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
		tags = data.tags
	}
</script>

<svelte:head>
	<title>TourneyJam - Tournaments</title>
</svelte:head>

<div class="gameswrapper tournamentswrapper">
	<div class="gamesheader">
		<div class="gamesheaderleft">
			<h1>Tournaments</h1>
			<p>Browse all active tournaments.</p>
		</div>
		<div class="gamesheaderright">
			<div class="dashboardsearch">
				<a href="/tournaments/create">Create a tournament</a>
				<input
					class="tournamentsearch"
					type="text"
					placeholder="Search by name, game or tag..."
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
	{:else if tournaments.length == 0}
		<NoContent missing="games or tags" />
	{:else}
		<div class="games">
			{#each tournaments as { id, cover_image, title, tags, type, status, authUser, prize, startOn, max_slots, players }}
				{@const firstDate = new Date(startOn).toLocaleDateString("en-US", {
					month: "long",
					day: "numeric"
				})}
				{@const startHours = new Date(startOn).getHours()}
				{@const startMinutes = new Date(startOn).getMinutes()}

				<div class="twrapper">
					<div class="tournament">
						<img
							class="tournamentimg"
							src={cover_image == "tournament.png" ? `/${cover_image}` : cover_image}
							alt={title}
							draggable="false"
						/>
						<p class="startdate">
							{firstDate}
							<Icon icon="mdi:dot" />
							{#if status == "active"}
								<span class="active">Active</span>
							{:else}
								<span class="scheduled">Starting at {startHours}:{startMinutes}</span>
							{/if}
						</p>
						<h2>{title}</h2>
						<div class="tags">
							{#each tags as tag}
								<button>{tag}</button>
							{/each}
						</div>
						<hr />
						<div class="gamestats">
							<div class="gameinfo">
								<h3>Prize Pool</h3>
								<div class="gameinfo2"><Icon icon="mdi:trophy" /> ${prize}</div>
							</div>
							<div class="gameinfo">
								<h3>Tournament Type</h3>
								<div class="gameinfo2">
									<Icon icon="material-symbols:lock" />
									{type == "open" ? "Open" : "Private"}
								</div>
							</div>
							<div class="gameinfo">
								<h3>Patricipants</h3>
								<div class="gameinfo2"><Icon icon="mdi:stopwatch" /> 3/{max_slots}</div>
							</div>
						</div>
					</div>
					<div class="tournamentactions">
						<div class="organizer">
							<div class="orgimage">
								<a href="/profile/myusername">
									<img src="profile_pictures/picture_7.png" alt="User Profile" />
								</a>
							</div>
							<div class="orgname">
								<p>Organized by</p>
								<a href="/profile/myusername"> Username </a>
							</div>
						</div>
						<div class="tbutton">
							<button>Registration</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
		{#if tournaments.length < tournamentCount}
			<button class="more" on:click={loadMoreGames}>Load More Tournaments</button>
		{/if}
	{/if}
</div>
