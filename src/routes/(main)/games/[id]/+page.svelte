<script lang="ts">
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import Loading from "$lib/components/others/loading.svelte"
	import type { User } from "$lib/types/user"
	import { goto } from "$app/navigation"
	import type { Game } from "$lib/types/game"
	import type { Tournament } from "$lib/types/tournament"
	import Icon from "@iconify/svelte"
	import Nocontent from "$lib/components/others/nocontent.svelte"
	import { tooltip } from "svooltip"

	let user: User
	let loading: boolean = true
	let game: Game
	let buttonClicked: string = "Showcase"
	let tournamentsList: Tournament[] = []
	let oldURL: string = $page.url.pathname

	$: ({ user } = $page.data)

	onMount(async () => {
		const res = await fetch("/api/getGame", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		game = data.game

		if (!game) {
			goto("/")
		}

		if (!game.game_showcase) {
			buttonClicked = "Tournaments"
		}

		loading = false
	})

	$: if ($page.url.pathname != oldURL) {
		window.location.href = $page.url.href
	}

	function showcase() {
		buttonClicked = "Showcase"
	}

	async function tournaments() {
		const res = await fetch("/api/getGameTournaments", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		tournamentsList = data.tournaments
		console.log(tournamentsList)
		buttonClicked = "Tournaments"
	}

	function convertToDate(date: Date) {
		let currentTime: number = Date.now()
		let unixTime = new Date(date).getTime()

		let timeDifference: number = unixTime - currentTime

		const millisecondsPerMinute: number = 60000
		const millisecondsPerHour: number = 3600000
		const millisecondsPerDay: number = 86400000

		const days = Math.floor(timeDifference / millisecondsPerDay)
		const hours = Math.floor((timeDifference % millisecondsPerDay) / millisecondsPerHour)
		const minutes = Math.floor((timeDifference % millisecondsPerHour) / millisecondsPerMinute)

		let returnString: string[] = []

		if (days > 0) {
			returnString.push(days + " days")
		}

		if (hours > 0) {
			returnString.push(hours + " hours")
		}

		if (minutes > 0) {
			returnString.push(minutes + " minutes")
		}

		return returnString.join(", ")
	}
</script>

<svelte:head>
	<title>TourneyJam - {game?.game_name}</title>
</svelte:head>

<div class="gamewrapper">
	{#if loading}
		<Loading />
	{:else}
		<div class="gameheader" style={`background-image: url(${game.game_background})`}>
			<img src={game.game_cover} alt={game.game_name} />
			<div class="gameheaderwrapper">
				<div class="gameheaderinfo">
					<h1>{game.game_name}</h1>
					<p>{game.game_description}</p>
					<div class="gamelinks">
						{#if game.game_website}
							<a href={game.game_website} target="_blank"
								><Icon icon="uil:link" />Official website</a
							>
						{/if}
						{#if game.authUser}
							<a href={"/profile/" + game.authUser.username}><Icon icon="uil:link" />Publisher</a>
						{/if}
					</div>
				</div>
				{#if game.game_tags.length > 0}
					<div class="gameheadertags">
						{#each game.game_tags as tag}
							<a href={`/tag/${tag}`}>{tag}</a>
						{/each}
					</div>
				{/if}
				{#if String(user?.role) == "admin" || user?.userId == game.authUserId}
					<a class="editgame" href={`/games/${game.id}/edit`}>Edit the page</a>
				{/if}
			</div>
		</div>
		<div class="gamecontentwrapper">
			<div class="gameoptions">
				{#if game.game_showcase}
					<button class:clicked={buttonClicked == "Showcase"} on:click={showcase}>Showcase</button>
				{/if}
				<button class:clicked={buttonClicked == "Tournaments"} on:click={tournaments}
					>Tournaments</button
				>
			</div>
			<hr />
			{#if buttonClicked == "Showcase"}
				<div class="showcase">
					<iframe
						src={`https://www.youtube.com/embed/${game.game_showcase.split("?v=")[1]}`}
						frameborder="0"
						title={game.game_name}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					/>
				</div>
			{/if}
			{#if buttonClicked == "Tournaments"}
				{#if tournamentsList.length > 0}
					<div class="tournamentlist">
						<div class="tournamentitemheader">
							<div class="aitem">Title</div>
							<div class="aitem">Hosted by</div>
							<div class="aitem">Prize</div>
							<div class="aitem">Max. participants</div>
							<div class="aitem">Starts in</div>
							<div class="aitem">Tournament type</div>
						</div>
						<hr />
						{#each tournamentsList as { authUser, id, max_slots, prize, startOn, title, type }}
							<a href={`/tournaments/${id}`}>
								<div class="aitem">{title}</div>
								<div class="aitem aitemhost">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<img
										on:click|preventDefault={() => goto(`/profile/${authUser.username}`)}
										src={authUser.profile_picture}
										alt={authUser.username}
										use:tooltip={{
											content: authUser.username,
											placement: "top",
											offset: 15
										}}
									/>
								</div>
								<div class="aitem">${prize}</div>
								<div class="aitem">{max_slots}</div>
								<div class="aitem">{convertToDate(startOn)}</div>
								<div class={`aitem aitemicon aitem${type}`}>
									<span
										use:tooltip={{
											content: type == "open" ? "Open" : "Password protected",
											placement: "top",
											offset: 15
										}}
									>
										{#if type == "open"}
											<Icon icon="material-symbols:lock-open" />
										{:else}
											<Icon icon="material-symbols:lock" />
										{/if}
									</span>
								</div>
							</a>
							<hr />
						{/each}
					</div>
				{:else}
					<Nocontent missing="active tournaments" />
				{/if}
			{/if}
		</div>
	{/if}
</div>
