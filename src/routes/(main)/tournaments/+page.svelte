<script lang="ts">
	import Icon from "@iconify/svelte"
	import type { Tournament } from "$lib/types/tournament"
	import { goto } from "$app/navigation"
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import Loading from "$lib/components/others/loading.svelte"
	import { badges as UserBadges } from "$lib/utils/badges"
	import NoContent from "$lib/components/others/nocontent.svelte"
	import type { User } from "$lib/types/user"

	let search: string = ""
	let tournaments: Tournament[] = []
	let tournamentCount: number
	let loading: boolean = true
	let user: User
	let myTournamentCount: number
	let myTournamentSwitch: boolean = false
	let myTournaments: Tournament[] = []

	$: ({ user } = $page.data)

	onMount(async () => {
		if (user) {
			const res = await fetch("/api/getAllTournaments", {
				method: "POST",
				body: JSON.stringify(user.userId)
			})

			const data = await res.json()

			tournaments = data.tournaments
			tournamentCount = data.tournamentCount
			myTournamentCount = data.myTournamentCount

			loading = false
		} else {
			const res = await fetch("/api/getAllTournaments", {
				method: "POST",
				body: JSON.stringify("")
			})

			const data = await res.json()

			tournaments = data.tournaments
			tournamentCount = data.tournamentCount
			myTournamentCount = data.myTournamentCount

			loading = false
		}
	})

	async function loadMoreTournaments() {
		const res = await fetch("/api/loadMoreTournaments", {
			method: "POST",
			body: JSON.stringify(tournaments.length)
		})

		const { moreTournaments } = await res.json()

		tournaments = [...tournaments, ...moreTournaments]
	}

	async function searchAllTournaments() {
		if (search != "") {
			const res = await fetch("/api/tournamentsSearch", {
				method: "POST",
				body: JSON.stringify(search)
			})

			const data = await res.json()

			tournaments = data.tournaments
		} else {
			loading = true

			if (user) {
				const res = await fetch("/api/getAllTournaments", {
					method: "POST",
					body: JSON.stringify(user.userId)
				})

				const data = await res.json()

				tournaments = data.tournaments
				tournamentCount = data.tournamentCount
				myTournamentCount = data.myTournamentCount

				loading = false
			} else {
				const res = await fetch("/api/getAllTournaments", {
					method: "POST",
					body: JSON.stringify("")
				})

				const data = await res.json()

				tournaments = data.tournaments
				tournamentCount = data.tournamentCount
				myTournamentCount = data.myTournamentCount

				loading = false
			}
		}
	}

	function checkIfJoined(players: any) {
		let exists: boolean = false

		for (let i = 0; i < players.length; i++) {
			if (user?.userId == players[i].id) {
				exists = true
				break
			}
		}

		return exists
	}

	async function getMyTournaments() {
		myTournamentSwitch = !myTournamentSwitch

		if (myTournamentSwitch) {
			loading = true

			const res = await fetch("/api/getMyTournaments", {
				method: "POST",
				body: JSON.stringify(user.userId)
			})

			const data = await res.json()

			myTournaments = data.myTournaments

			loading = false
		} else {
			myTournamentSwitch = false
			myTournaments = []
		}
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
				{#if user}
					{#if myTournamentCount > 0}
						<button class:switchbutton={myTournamentSwitch} on:click={getMyTournaments}
							>My tournaments</button
						>
					{/if}
					<a href="/tournaments/create">Create a tournament</a>
				{/if}
				<input
					class="tournamentsearch"
					type="text"
					placeholder="Search by name, game or tag..."
					maxlength="15"
					on:keyup={searchAllTournaments}
					bind:value={search}
				/>
				<Icon icon="material-symbols:search" />
			</div>
		</div>
	</div>
	<hr />
	{#if loading}
		<Loading />
	{:else if tournaments.length == 0 && myTournaments.length == 0}
		<NoContent missing="tournaments" />
	{:else if myTournaments.length > 0}
		<div class="games">
			{#each myTournaments as { id, cover_image, title, tags, type, status, authUser, prize, startOn, max_slots, players, game, authUserId }}
				{@const firstDate = new Date(startOn).toLocaleDateString("en-US", {
					month: "long",
					day: "numeric"
				})}
				{@const startHours = new Date(startOn).getHours()}
				{@const startMinutes = new Date(startOn).getMinutes()}

				<div class="twrapper">
					<div class="tournament">
						{#if authUserId == user?.userId}
							<div class="tournamenttag">Created</div>
						{:else if checkIfJoined(players)}
							<div class="tournamenttag">Joined</div>
						{/if}
						<img
							class="tournamentimg"
							src={cover_image == "tournament.png" ? `/${cover_image}` : cover_image}
							alt={title}
							draggable="false"
							loading="lazy"
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
							<button on:click={() => goto(`/games/${game.id}`)}>{game.game_name}</button>
						</div>
						<div class="tags">
							{#if tags.length != 0}
								{#each tags as tag}
									<button class="nocursor">{tag}</button>
								{/each}
							{:else}
								<button class="hiddenb">PLACEHOLDER</button>
							{/if}
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
									{#if type == "open"}
										<Icon icon="material-symbols:lock-open" style="color: green;" />
										Open
									{:else}
										<Icon icon="material-symbols:lock" style="color: red;" />
										Private
									{/if}
								</div>
							</div>
							<div class="gameinfo">
								<h3>Patricipants</h3>
								<div class="gameinfo2">
									<Icon icon="mdi:stopwatch" />
									{players.length}/{max_slots}
								</div>
							</div>
						</div>
					</div>
					<div class="tournamentactions">
						<div class="organizer">
							<div class="orgimage">
								<a href="/profile/{authUser.username}">
									<img src={authUser.profile_picture} alt={authUser.username} />
								</a>
							</div>
							<div class="orgname">
								<p>Organized by</p>
								<a href="/profile/{authUser.username}">
									{authUser.username}
									{#if authUser.badges.length != 0}
										{#each authUser.badges as badge}
											<Icon
												icon={UserBadges[badge].icon}
												style={`color: ${UserBadges[badge].color};`}
											/>
										{/each}
									{/if}
								</a>
							</div>
						</div>
						<div class="tbutton">
							<button on:click={() => goto(`/tournaments/${id}`)}
								>{authUserId == user?.userId ? "Manage tournament" : "Open tournament"}</button
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="games">
			{#each tournaments as { id, cover_image, title, tags, type, status, authUser, prize, startOn, max_slots, players, game, authUserId }}
				{@const firstDate = new Date(startOn).toLocaleDateString("en-US", {
					month: "long",
					day: "numeric"
				})}
				{@const startHours = new Date(startOn).getHours()}
				{@const startMinutes = new Date(startOn).getMinutes()}

				<div class="twrapper">
					<div class="tournament">
						{#if authUserId == user?.userId}
							<div class="tournamenttag">Created</div>
						{:else if checkIfJoined(players)}
							<div class="tournamenttag">Joined</div>
						{/if}
						<img
							class="tournamentimg"
							src={cover_image == "tournament.png" ? `/${cover_image}` : cover_image}
							alt={title}
							draggable="false"
							loading="lazy"
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
							<button on:click={() => goto(`/games/${game.id}`)}>{game.game_name}</button>
						</div>
						<div class="tags">
							{#if tags.length != 0}
								{#each tags as tag}
									<button class="nocursor">{tag}</button>
								{/each}
							{:else}
								<button class="hiddenb">PLACEHOLDER</button>
							{/if}
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
									{#if type == "open"}
										<Icon icon="material-symbols:lock-open" style="color: green;" />
										Open
									{:else}
										<Icon icon="material-symbols:lock" style="color: red;" />
										Private
									{/if}
								</div>
							</div>
							<div class="gameinfo">
								<h3>Patricipants</h3>
								<div class="gameinfo2">
									<Icon icon="mdi:stopwatch" />
									{players.length}/{max_slots}
								</div>
							</div>
						</div>
					</div>
					<div class="tournamentactions">
						<div class="organizer">
							<div class="orgimage">
								<a href="/profile/{authUser.username}">
									<img src={authUser.profile_picture} alt={authUser.username} />
								</a>
							</div>
							<div class="orgname">
								<p>Organized by</p>
								<a href="/profile/{authUser.username}">
									{authUser.username}
									{#if authUser.badges.length != 0}
										{#each authUser.badges as badge}
											<Icon
												icon={UserBadges[badge].icon}
												style={`color: ${UserBadges[badge].color};`}
											/>
										{/each}
									{/if}
								</a>
							</div>
						</div>
						<div class="tbutton">
							<button on:click={() => goto(`/tournaments/${id}`)}
								>{authUserId == user?.userId ? "Manage tournament" : "Open tournament"}</button
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
		{#if tournaments.length < tournamentCount && search == ""}
			<button class="more" on:click={loadMoreTournaments}>Load More Tournaments</button>
		{/if}
	{/if}
</div>
