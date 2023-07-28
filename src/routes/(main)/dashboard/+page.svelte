<script lang="ts">
	import { onMount } from "svelte"
	import Icon from "@iconify/svelte"
	import { badges as userbadges } from "$lib/utils/badges"
	import type { Users, Games, Tournaments, Tags } from "$lib/types/dashboardTypes"

	let displayOption: string = "All"

	let users: Users[]
	let games: Games[]
	let tournaments: Tournaments[]
	let tags: Tags[]
	let searchValue: string = ""
	let searching: boolean = false
	let searchUsers: Users[] = []
	let searchGames: Games[] = []
	let searchTournaments: Tournaments[] = []
	let searchTags: Tags[] = []

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

	$: if (displayOption == "All") {
		while (users?.length > 5) {
			users.pop()
		}

		while (games?.length > 5) {
			games.pop()
		}

		while (tournaments?.length > 5) {
			tournaments.pop()
		}

		while (tags?.length > 5) {
			tags.pop()
		}
	}

	$: if (displayOption == "Users") {
		getUsers()
	}

	$: if (displayOption == "Games") {
		getGames()
	}

	$: if (displayOption == "Tournaments") {
		getTournaments()
	}

	$: if (displayOption == "Tags") {
		getTags()
	}

	async function getUsers() {
		const res = await fetch("/api/getDashboardUsers", {
			method: "POST"
		})

		const data = await res.json()

		users = data.users
	}

	async function getGames() {
		const res = await fetch("/api/getDashboardGames", {
			method: "POST"
		})

		const data = await res.json()

		games = data.games
	}

	async function getTournaments() {
		const res = await fetch("/api/getDashboardTournaments", {
			method: "POST"
		})

		const data = await res.json()

		tournaments = data.tournaments
	}

	async function getTags() {
		const res = await fetch("/api/getDashboardTags", {
			method: "POST"
		})

		const data = await res.json()

		tags = data.tags
	}

	onMount(async () => {
		getDashboard()
	})

	async function search() {
		searching = true

		if (searchValue != "") {
			const res = await fetch("/api/dashboardSearch", {
				method: "POST",
				body: JSON.stringify(searchValue)
			})

			const data = await res.json()

			searchUsers = data.searchUsers
			searchGames = data.searchGames
			searchTournaments = data.searchTournaments
			searchTags = data.searchTags

			searching = false
		}
	}
</script>

<svelte:head>
	<title>TourneyJam - Dashboard</title>
</svelte:head>

<div class="dashboardwrapper">
	<div class="dashboardheader">
		<h1>Dashboard - {displayOption}</h1>
		<p>Manage users, games, tournaments and tags.</p>
	</div>
	<div class="dashboardso">
		<div class="dashboardoptions">
			<button class:currentsort={displayOption == "All"} on:click={() => (displayOption = "All")}
				>All</button
			>
			<button
				class:currentsort={displayOption == "Users"}
				on:click={() => (displayOption = "Users")}>Users</button
			>
			<button
				class:currentsort={displayOption == "Games"}
				on:click={() => (displayOption = "Games")}>Games</button
			>
			<button
				class:currentsort={displayOption == "Tournaments"}
				on:click={() => (displayOption = "Tournaments")}>Tournaments</button
			>
			<button class:currentsort={displayOption == "Tags"} on:click={() => (displayOption = "Tags")}
				>Tags</button
			>
		</div>
		<div class="dashboardsearchwrapper">
			<div class="dashboardsearch">
				{#if displayOption == "Games"}
					<a href="/games/add">Add a game</a>
				{:else if displayOption == "Tournaments"}
					<a href="/tournaments/create">Create a tournament</a>
				{:else if displayOption == "Tags"}
					<a href="/tag/add">Add a tag</a>
				{/if}
				<input
					type="text"
					placeholder="Search..."
					maxlength="15"
					on:keyup={search}
					bind:value={searchValue}
				/>
				<Icon icon="material-symbols:search" />
			</div>
			{#if searchValue != ""}
				{#if searching}
					<div class="searchresult">
						<div class="dashboardsearchloading">
							<Icon icon="eos-icons:bubble-loading" />
						</div>
					</div>
				{:else}
					<div class="searchresult">
						<div class="searchw">
							<h1>Users</h1>
							<hr />
							<div class="searchresults">
								{#if searchUsers.length != 0}
									{#each searchUsers as { username, profile_picture, badges }}
										<a href="/profile/{username}">
											<img src={profile_picture} alt={username} />
											{username}
											<div class="dashbadges">
												{#each badges as badge}
													<Icon
														icon={userbadges[badge].icon}
														style="color: {userbadges[badge].color}"
													/>
												{/each}
											</div>
										</a>
									{/each}
								{:else}
									<h1 class="nofound">No users found.</h1>
								{/if}
							</div>
						</div>
						<div class="searchw">
							<h1>Games</h1>
							<hr />
							<div class="searchresults">
								{#if searchGames.length != 0}
									{#each searchGames as { game_cover, id, game_name }}
										<a href="/games/{id}">
											<img src={game_cover} alt={game_name} />
											{game_name}
										</a>
									{/each}
								{:else}
									<h1 class="nofound">No games found.</h1>
								{/if}
							</div>
						</div>
						<div class="searchw">
							<h1>Tournaments</h1>
							<hr />
							<div class="searchresults">
								{#if searchTournaments.length != 0}
									{#each searchTournaments as { title, id, cover_image }}
										<a href="/tournaments/{id}">
											<img src={cover_image} alt={title} />
											{title}
										</a>
									{/each}
								{:else}
									<h1 class="nofound">No tournaments found.</h1>
								{/if}
							</div>
						</div>
						<div class="searchw">
							<h1>Tags</h1>
							<hr />
							<div class="searchresults">
								{#if searchTags.length != 0}
									{#each searchTags as { tag }}
										<a href="/tag/{tag}">
											{tag}
										</a>
									{/each}
								{:else}
									<h1 class="nofound">No tags found.</h1>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			{/if}
		</div>
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
						{#each users as { username, profile_picture, badges }}
							<a href="/profile/{username}">
								<img src={profile_picture} alt={username} />
								<p>{username}</p>
								<div class="dashbadges">
									{#each badges as badge}
										<Icon icon={userbadges[badge].icon} style="color: {userbadges[badge].color}" />
									{/each}
								</div>
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
						{#each games as { game_name, game_cover, id }}
							<a href="/games/{id}">
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
						{#each tournaments as { title, cover_image, id }}
							<a href="/tournaments/{id}">
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
						{#each tags as { tag }}
							<a href="/tag/{tag}">
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
	{:else if displayOption == "Users"}
		<div class="specificmodule">
			<h1>Users</h1>
			<hr />
			<div class="allusers">
				{#each users as { username, profile_picture, badges }}
					<a href="/profile/{username}">
						<img src={profile_picture} alt={username} />
						<p>{username}</p>
						<div class="dashbadges">
							{#each badges as badge}
								<Icon icon={userbadges[badge].icon} style="color: {userbadges[badge].color}" />
							{/each}
						</div>
					</a>
				{/each}
			</div>
		</div>
	{:else if displayOption == "Games"}
		<div class="specificmodule">
			<h1>Games</h1>
			<hr />
			{#if games.length == 0}
				<div class="dashboardloading">
					<h2>No games found.</h2>
				</div>
			{:else}
				<div class="allusers">
					{#each games as { game_name, game_cover, id }}
						<a href="/games/{id}">
							<img src={game_cover} alt={game_name} />
							<p>{game_name}</p>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{:else if displayOption == "Tournaments"}
		<div class="specificmodule">
			<h1>Tournaments</h1>
			<hr />
			{#if tournaments.length == 0}
				<div class="dashboardloading">
					<h2>No tournaments found.</h2>
				</div>
			{:else}
				<div class="allusers">
					{#each tournaments as { title, cover_image, id }}
						<a href="/tournaments/{id}">
							<img src={cover_image} alt={title} />
							<p>{title}</p>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{:else if displayOption == "Tags"}
		<div class="specificmodule">
			<h1>Tags</h1>
			<hr />
			{#if tags.length == 0}
				<div class="dashboardloading">
					<h2>No tags found.</h2>
				</div>
			{:else}
				<div class="allusers">
					{#each tags as { tag }}
						<a href="/tag/{tag}">
							<p>{tag}</p>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
