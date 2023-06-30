<script lang="ts">
	import { onMount } from "svelte"
	import Icon from "@iconify/svelte"
	import type { Users, Games, Tournaments, Tags } from "$lib/types/dashboardTypes"

	let displayOption: string = "All"

	let users: Users[]
	let games: Games[]
	let tournaments: Tournaments[]
	let tags: Tags[]

	async function getDashboard() {
		const res = await fetch("/api/getDashboard", {
			method: "POST",
			body: JSON.stringify(displayOption)
		})

		const data = await res.json()

		users = data.users
		games = data.games
		tournaments = data.tournaments
		tags = data.tags
	}

	onMount(async () => {
		getDashboard()
	})
</script>

<svelte:head>
	<title>TourneyJam - Dashboard</title>
</svelte:head>

<div class="dashboardwrapper">
	<div class="dashboardheader">
		<h1>Dashboard - {displayOption}</h1>
		<p>Manage users, games, tournaments and tags.</p>
	</div>
	<div class="dashboardoptions">
		<button class:currentsort={displayOption == "All"} on:click={() => (displayOption = "All")}
			>All</button
		>
		<button class:currentsort={displayOption == "Users"} on:click={() => (displayOption = "Users")}
			>Users</button
		>
		<button class:currentsort={displayOption == "Games"} on:click={() => (displayOption = "Games")}
			>Games</button
		>
		<button
			class:currentsort={displayOption == "Tournaments"}
			on:click={() => (displayOption = "Tournaments")}>Tournaments</button
		>
		<button class:currentsort={displayOption == "Tags"} on:click={() => (displayOption = "Tags")}
			>Tags</button
		>
	</div>
	<hr />
	{#if displayOption == "All"}
		<div class="dashboardpanels">
			<div class="dashboardpanel">
				<h1>Users</h1>
				<hr />
				<div class="dashboardpaneldata">
					{#if !users}
						<div class="dashboardloading">
							<Icon icon="eos-icons:bubble-loading" />
						</div>
					{:else if users.length == 0}
						<div class="dashboardloading">
							<h2>No users found.</h2>
						</div>
					{:else}
						{#each users as { username, profile_picture }}
							<a href="/dashboard/profile/{username}">
								<img src={profile_picture} alt={username} />
								<p>{username}</p>
							</a>
						{/each}
						<div class="viewmoredashboard">
							<button on:click={() => (displayOption = "Users")}>View More</button>
						</div>
					{/if}
				</div>
			</div>
			<div class="dashboardpanel">
				<h1>Games</h1>
				<hr />
				<div class="dashboardpaneldata">
					{#if !games}
						<div class="dashboardloading">
							<Icon icon="eos-icons:bubble-loading" />
						</div>
					{:else if games.length == 0}
						<div class="dashboardloading">
							<h2>No games found.</h2>
						</div>
					{:else}
						{#each games as { game_name, game_cover }}
							<a href="/dashboard/game/{game_name}">
								<img src={game_cover} alt={game_name} />
								<p>{game_name}</p>
							</a>
						{/each}
						<div class="viewmoredashboard">
							<button on:click={() => (displayOption = "Games")}>View More</button>
						</div>
					{/if}
				</div>
			</div>
			<div class="dashboardpanel">
				<h1>Tournaments</h1>
				<hr />
				<div class="dashboardpaneldata">
					{#if !tournaments}
						<div class="dashboardloading">
							<Icon icon="eos-icons:bubble-loading" />
						</div>
					{:else if tournaments.length == 0}
						<div class="dashboardloading">
							<h2>No tournaments found.</h2>
						</div>
					{:else}
						{#each tournaments as { title, cover_image }}
							<a href="/dashboard/tournament/{title}">
								<img src={cover_image} alt={title} />
								<p>{title}</p>
							</a>
						{/each}
						<div class="viewmoredashboard">
							<button on:click={() => (displayOption = "Tournaments")}>View More</button>
						</div>
					{/if}
				</div>
			</div>
			<div class="dashboardpanel">
				<h1>Tags</h1>
				<hr />
				<div class="dashboardpaneldata">
					{#if !tags}
						<div class="dashboardloading">
							<Icon icon="eos-icons:bubble-loading" />
						</div>
					{:else if tags.length == 0}
						<div class="dashboardloading">
							<h2>No tags found.</h2>
						</div>
					{:else}
						{#each tags as { tag, slug }}
							<a href="/dashboard/tag/{slug}">
								<p>{tag}</p>
							</a>
						{/each}
						<div class="viewmoredashboard">
							<button on:click={() => (displayOption = "Tags")}>View More</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
