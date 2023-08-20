<script lang="ts">
	import Icon from "@iconify/svelte"
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import type { Tournament } from "$lib/types/tournament"
	import Loading from "$lib/components/others/loading.svelte"
	import { badges as userbadges } from "$lib/utils/badges"
	import type { Player } from "$lib/types/player"

	let tournament: Tournament
	let loading: boolean = true
	let activeButton: string = "Stream"
	let players: Player[] = []

	onMount(async () => {
		const res = await fetch("/api/getTournamentById", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		tournament = data.tournament
		players = data.players

		loading = false

		console.log(players)
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
</script>

<svelte:head>
	<title>TourneyJam - {tournament?.title}</title>
</svelte:head>

{#if loading || !tournament}
	<Loading />
{:else}
	<div class="tournamentwrapper">
		<header style="background-image: url({tournament.cover_image})" />
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
				class:tournamentselected={activeButton == "Members"}
				on:click={() => (activeButton = "Members")}
				><Icon icon="ic:baseline-people" /> Members</button
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
	</div>
{/if}
