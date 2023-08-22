<script lang="ts">
	import Icon from "@iconify/svelte"
	import { onDestroy, onMount, tick } from "svelte"
	import { page } from "$app/stores"
	import type { Tournament } from "$lib/types/tournament"
	import Loading from "$lib/components/others/loading.svelte"
	import { badges as userbadges } from "$lib/utils/badges"
	import type { Player } from "$lib/types/player"
	import { io } from "socket.io-client"
	import NoContent from "$lib/components/others/nocontent.svelte"
	import type { User } from "$lib/types/user"
	import { goto } from "$app/navigation"
	import { fly } from "svelte/transition"

	let tournament: Tournament
	let loading: boolean = true
	let activeButton: string = "Bracket"
	let players: Player[] = []
	let user: User
	let passwordWindow: boolean = false
	let password: string = ""
	let error: string = ""
	let bracket: any = []

	const socket = io("https://socketserver-yq5m.onrender.com")

	socket.emit("tournamentId", $page.params.id)

	socket.on("updatePlayers", (message) => {
		players = message
		players = players
	})

	socket.on("updateBracket", (message) => {
		bracket = message
		bracket = bracket
	})

	$: ({ user } = $page.data)

	onMount(async () => {
		const res = await fetch("/api/getTournamentById", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		tournament = data.tournament
		players = data.players

		if (tournament.bracket) {
			bracket = tournament.bracket
		} else {
			if (players.length > 0) {
				createBracket(players)
			}
		}

		loading = false
	})

	onDestroy(() => {
		socket.disconnect()
	})

	function dateFormat(notFormatDate: Date) {
		const date = new Date(notFormatDate)

		return date.toLocaleDateString("en-gb", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		})
	}

	async function getParticipants() {
		const res = await fetch("/api/getMembersByTournamentId", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		players = data.players
	}

	function checkForPlayer(id: string) {
		for (let i = 0; i < players.length; i++) {
			if (players[i].id == id) {
				return true
			}
		}

		return false
	}

	async function leave(userId: string, tournamentId: number) {
		const res = await fetch("/api/leaveTournament", {
			method: "POST",
			body: JSON.stringify({
				userId,
				tournamentId
			})
		})

		const { success } = await res.json()

		if (success) {
			getParticipants().then(async () => {
				socket.emit("updatePlayers", players)
				createBracket(players)
			})
		}
	}

	async function join(userId: string, tournamentId: number) {
		const res = await fetch("/api/joinTournament", {
			method: "POST",
			body: JSON.stringify({
				userId,
				tournamentId
			})
		})

		const { success } = await res.json()

		if (success) {
			getParticipants().then(async () => {
				socket.emit("updatePlayers", players)
				createBracket(players)
			})
		} else {
			error = "Tournament is full."
		}
	}

	function checkPassword() {
		if (password == tournament.password) {
			passwordWindow = false
			password = ""
			join(user.userId, tournament.id)
		} else {
			error = "Password incorrect"
		}
	}

	async function createBracket(players: any) {
		bracket = []
		let playerLength: number = players.length
		let column: any = []
		let round: any = []

		if (playerLength == 1) {
			bracket.push([players])
		} else {
			for (let i = 0; i < Math.ceil(playerLength / 2); i++) {
				for (let j = i * 2; j < i + 2; j++) {
					round.push(players[j])
				}

				column.push(round)
				round = []
			}

			bracket.push(column)
			column = []

			let index: number = 0

			playerLength = bracket[index].length

			while (playerLength != 1) {
				for (let i = 0; i < Math.ceil(playerLength / 2); i++) {
					for (let j = 0; j < 2; j++) {
						round.push({
							id: "",
							username: "",
							profile_picture: "",
							badges: []
						})
					}
					column.push(round)
					round = []
				}

				bracket.push(column)
				column = []

				index++
				playerLength = bracket[index].length
			}
		}

		bracket.push([
			[
				{
					id: "",
					username: "",
					profile_picture: "",
					badges: []
				}
			]
		])

		bracket = bracket

		await fetch("/api/updateBracket", {
			method: "POST",
			body: JSON.stringify({
				tournamentId: tournament.id,
				newBracket: bracket
			})
		})

		socket.emit("updateBracket", bracket)
	}
</script>

<svelte:head>
	<title>TourneyJam - {tournament?.title}</title>
</svelte:head>

{#if loading || !tournament}
	<Loading />
{:else}
	<div class="tournamentwrapper">
		<header style="background-image: url({tournament.cover_image})">
			{#key players}
				{#if tournament.authUserId == user?.userId || String(user?.role) == "admin"}
					<div class="buttondiv">
						<button on:click={() => goto(`/tournaments/${$page.params.id}/edit`)}
							>Edit tournament</button
						>
					</div>
				{:else if tournament.status == "active"}
					<div class="buttondiv">
						<button disabled>Active</button>
					</div>
				{:else if checkForPlayer(user?.userId)}
					<div class="buttondiv">
						<button class="leavebutton" on:click={() => leave(user.userId, tournament.id)}
							>Leave</button
						>
					</div>
				{:else if !user}
					<div class="buttondiv">
						<button>Login to join the tournament</button>
					</div>
				{:else if tournament.max_slots == players.length}
					<div class="buttondiv">
						<button>Full</button>
					</div>
				{:else if tournament.type == "passwordProtected"}
					<div class="buttondiv">
						<button
							on:click={() => {
								passwordWindow = !passwordWindow
							}}>Enter password to join</button
						>
						{#if passwordWindow}
							<div class="passwordWindow" transition:fly={{ x: 20 }}>
								<div class="passwordWindowtop">
									<input type="password" placeholder="Type password..." bind:value={password} />
									<button on:click={checkPassword}>Enter</button>
								</div>
								<p>{error}</p>
							</div>
						{/if}
					</div>
				{:else}
					<div class="buttondiv">
						<button on:click={() => join(user.userId, tournament.id)}>Join</button>
					</div>
				{/if}
			{/key}
		</header>
		<div class="tournamentselector">
			<button
				class:tournamentselected={activeButton == "About"}
				on:click={() => (activeButton = "About")}><Icon icon="mdi:about" /> About</button
			>
			<button
				class:tournamentselected={activeButton == "Bracket"}
				on:click={() => (activeButton = "Bracket")}><Icon icon="mdi:tournament" /> Bracket</button
			>
			{#if tournament.creatorStream}
				<button
					class:tournamentselected={activeButton == "Stream"}
					on:click={() => (activeButton = "Stream")}
					><Icon icon="mdi:twitch" /> Twitch Stream</button
				>
			{/if}
			<button
				class:tournamentselected={activeButton == "Participants"}
				on:click={() => {
					activeButton = "Participants"
					getParticipants()
				}}><Icon icon="ic:baseline-people" /> Participants ({players.length})</button
			>
		</div>
		{#if activeButton == "About"}
			<div class="tournamentcontent">
				<h1>{tournament.title}</h1>
				<p>
					<Icon icon="mdi:calendar" />
					{dateFormat(tournament.startOn)} -
					<span class={tournament.status}
						>{tournament.status == "active" ? "Active" : "Scheduled"}</span
					>
				</p>
				<a href="/profile/{tournament.authUser.username}">
					<img src={tournament.authUser.profile_picture} alt={tournament.authUser.username} />
					{tournament.authUser.username}
					{#if tournament.authUser.badges.length > 0}
						<div class="badges">
							{#each tournament.authUser.badges as badge}
								<Icon icon={userbadges[badge].icon} style="color: {userbadges[badge].color}" />
							{/each}
						</div>
					{/if}
				</a>
				<div class="tournamentdetails">
					<div class="tdetailitem descriptionitem">
						<h3><Icon icon="material-symbols:description" /> Description</h3>
						<p>{tournament.description}</p>
						<hr />
					</div>
					<div class="tdetailitem">
						<h3><Icon icon="bxs:joystick" /> Game</h3>
						<a href="/games/{tournament.game.id}">{tournament.game.game_name}</a>
					</div>
					<div class="tdetailitem">
						<h3><Icon icon="material-symbols:trophy" /> Prize</h3>
						<p>${tournament.prize}</p>
					</div>
					<div class="tdetailitem">
						<h3><Icon icon="mdi:stopwatch" /> Participants</h3>
						<p>{players.length}/{tournament.max_slots}</p>
					</div>
					{#if tournament.tags.length > 0}
						<div class="tdetailitem">
							<h3><Icon icon="mdi:hashtag" /> Tags</h3>
							<div class="tdetailtags">
								{#each tournament.tags as tag}
									<button>{tag}</button>
								{/each}
							</div>
						</div>
					{/if}
					<div class="tdetailitem">
						<h3>Tournament type</h3>
						<p>
							<Icon
								icon={tournament.type == "open"
									? "material-symbols:lock-open"
									: "material-symbols:lock"}
								style="color: {tournament.type == 'open' ? 'green' : 'red'}"
							/>{tournament.type == "open" ? "Open" : "Private"}
						</p>
					</div>
				</div>
			</div>
		{/if}
		{#if activeButton == "Stream"}
			<div class="tournamentcontent">
				<div class="tournamentiframes">
					<iframe
						src="https://player.twitch.tv/?channel={tournament.creatorStream}&parent=localhost"
						title="Twitch Stream"
						frameborder="0"
						allowfullscreen={true}
						scrolling="no"
					/>
					<iframe
						title="Twitch chat"
						id="chat_embed"
						src="https://www.twitch.tv/embed/{tournament.creatorStream}/chat?darkpopout&parent=localhost"
					/>
				</div>
			</div>
		{/if}
		{#if activeButton == "Participants"}
			<div class="tournamentcontent">
				{#if players.length > 0}
					<div class="tournamentplayers">
						{#each players as { username, profile_picture, badges }}
							<a href="/profile/{username}">
								<img src={profile_picture} alt={username} />
								{username}
								{#if badges.length > 0}
									{#each badges as badge}
										<Icon icon={userbadges[badge].icon} style="color: {userbadges[badge].color}" />
									{/each}
								{/if}
							</a>
						{/each}
					</div>
				{:else}
					<NoContent missing="players" />
				{/if}
			</div>
		{/if}
		{#if activeButton == "Bracket"}
			{#if players.length > 0}
				<div class="tournamentcontent tournamentbracketwrapper">
					<div class="tournamentbracket">
						{#key bracket}
							{#each bracket as column}
								<div class="column">
									{#each column as group}
										<div class="group">
											<h1>Round x</h1>
											<div class="players">
												{#each group as player}
													<div class="player" draggable="true">
														<img src={player.profile_picture} alt={player.username} />
														<p>{player.username}</p>
													</div>
												{/each}
											</div>
										</div>
									{/each}
								</div>
							{/each}
						{/key}
					</div>
				</div>
			{:else}
				<NoContent missing="bracket" />
			{/if}
		{/if}
	</div>
{/if}
