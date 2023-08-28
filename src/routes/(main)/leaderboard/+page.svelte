<script lang="ts">
	import Icon from "@iconify/svelte"
	import type { Player } from "$lib/types/leaderboardplayer"
	import { onMount } from "svelte"
	import Nocontent from "$lib/components/others/nocontent.svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import { badges as userbadges } from "$lib/utils/badges"

	let filter: string = "Wins"
	let players: Player[] = []
	let maxPlayers: number
	let loading: boolean = true
	let search: string = ""

	onMount(async () => {
		const res = await fetch("/api/getLeaderboard?filter=Wins", {
			method: "GET"
		})

		const data = await res.json()

		;({ players, maxPlayers } = data)

		loading = false
	})

	async function filterLeaderboard(filterBy: string) {
		loading = true
		filter = filterBy

		const res = await fetch(`/api/getLeaderboard?filter=${filter}`, {
			method: "GET"
		})

		const data = await res.json()

		;({ players, maxPlayers } = data)

		loading = false
	}

	async function loadMore(filterBy: string) {
		loading = true
		filter = filterBy

		const res = await fetch(`/api/getLeaderboard?filter=${filter}&skip=${players.length}`, {
			method: "GET"
		})

		const data = await res.json()

		maxPlayers = data.maxPlayers
		players = [...players, ...data.players]

		loading = false
	}

	async function searchPlayer() {
		if (search != "") {
			const res = await fetch(`/api/getLeaderboard?filter=${filter}&username=${search}`, {
				method: "GET"
			})

			const data = await res.json()

			;({ players, maxPlayers } = data)
		} else {
			const res = await fetch(`/api/getLeaderboard?filter=${filter}`, {
				method: "GET"
			})

			const data = await res.json()

			;({ players, maxPlayers } = data)
		}
	}
</script>

<svelte:head>
	<title>TourneyJam - Leaderboard</title>
</svelte:head>

{#if loading}
	<Loading />
{:else}
	<div class="leaderboardwrapper">
		<header>
			<h1>Leaderboard</h1>
			<h2>Compare yourself with other players.</h2>
		</header>
		<div class="leaderboardheader">
			<div class="filteroptions">
				<div class="filterbuttons">
					<button
						class:activefilterbutton={filter == "Wins"}
						on:click={() => filterLeaderboard("Wins")}>Wins</button
					>
					<button
						class:activefilterbutton={filter == "Prize Won"}
						on:click={() => filterLeaderboard("Prize Won")}>Prize Won</button
					>
					<button
						class:activefilterbutton={filter == "Tournaments Played"}
						on:click={() => filterLeaderboard("Tournaments Played")}>Tournaments Played</button
					>
				</div>
				<div class="leadersearch">
					<input
						type="text"
						placeholder="Search players..."
						maxlength="20"
						bind:value={search}
						on:input={searchPlayer}
					/>
					<Icon icon="material-symbols:search" />
				</div>
			</div>
		</div>
		{#if players.length > 0}
			<div class="leaderboard">
				<div class="leaderboarditems">
					<div class="leaderboarditemsheader">
						<p>#</p>
						<p>User</p>
						<button
							class:activefilterbuttonheader={filter == "Wins"}
							on:click={() => filterLeaderboard("Wins")}
						>
							Wins
							{#if filter == "Wins"}
								<Icon icon="mingcute:down-line" />
							{:else}
								<Icon icon="mingcute:up-line" />
							{/if}
						</button>
						<button
							class:activefilterbuttonheader={filter == "Prize Won"}
							on:click={() => filterLeaderboard("Prize Won")}
						>
							Prize won
							{#if filter == "Prize Won"}
								<Icon icon="mingcute:down-line" />
							{:else}
								<Icon icon="mingcute:up-line" />
							{/if}
						</button>
						<button
							class:activefilterbuttonheader={filter == "Tournaments Played"}
							on:click={() => filterLeaderboard("Tournaments Played")}
						>
							Tournaments played
							{#if filter == "Tournaments Played"}
								<Icon icon="mingcute:down-line" />
							{:else}
								<Icon icon="mingcute:up-line" />
							{/if}
						</button>
					</div>
					{#each players as { username, profile_picture, badges, wins, tournamentsPlayed, prizeWon }, index}
						<div class="leaderboarditem">
							{#if index + 1 == 1}
								<p class="first"><Icon icon="mdi:medal" /></p>
							{:else if index + 1 == 2}
								<p class="second"><Icon icon="mdi:medal" /></p>
							{:else if index + 1 == 3}
								<p class="third"><Icon icon="mdi:medal" /></p>
							{:else}
								<p>{index + 1}</p>
							{/if}
							<a href="/profile/{username}">
								<img src={profile_picture} alt={username} />
								<p>{username}</p>
								{#if badges.length > 0}
									<div class="badges">
										{#each badges as badge}
											<Icon
												icon={userbadges[badge].icon}
												style="color: {userbadges[badge].color}"
											/>
										{/each}
									</div>
								{/if}
							</a>
							<p class="centerp">{wins}</p>
							<p class="centerp">${prizeWon}</p>
							<p class="centerp">{tournamentsPlayed}</p>
						</div>
					{/each}
				</div>
				{#if players.length < maxPlayers}
					<button on:click={() => loadMore(filter)}>Load more</button>
				{/if}
			</div>
		{:else}
			<Nocontent missing="leaderboard stats" />
		{/if}
	</div>
{/if}
