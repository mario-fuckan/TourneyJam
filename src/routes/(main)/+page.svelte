<script lang="ts">
	import Icon from "@iconify/svelte"
	import { onMount } from "svelte"
	import { goto } from "$app/navigation"
	import Loading from "$lib/components/others/loading.svelte"
	import type { Articles } from "$lib/types/news"
	import type { Tournament } from "$lib/types/tournament"
	import NoContent from "$lib/components/others/nocontent.svelte"
	import { badges as UserBadges } from "$lib/utils/badges"

	let news: string
	let loading: boolean = true
	let articles: Articles[]
	let tournaments: Tournament[] = []
	let tournamentCount: number

	onMount(async () => {
		const res = await fetch("/api/getLandingTournaments", {
			method: "POST"
		})

		const data = await res.json()
		tournaments = data.tournaments

		if (localStorage.getItem("hide")) {
			//@ts-ignore
			news = JSON.parse(localStorage.getItem("hide")).options[0]

			if (!news) {
				const res = await fetch("/api/getHomeNews", {
					method: "POST"
				})

				const data = await res.json()

				articles = data.results
			}

			loading = false
		} else {
			const res = await fetch("/api/getHomeNews", {
				method: "POST"
			})

			const data = await res.json()

			articles = data.results

			loading = false
		}
	})
</script>

<svelte:head>
	<title>TourneyJam - Host your own tournaments</title>
</svelte:head>

{#if !news}
	{#if loading}
		<Loading />
	{:else}
		<div class="section">
			<h1>General Gaming News</h1>
			<hr />
			<div class="news">
				{#each articles as { title, image, id }}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<article
						on:click={() => goto("/news/" + id)}
						style:background-image={"url(" + image.original + ")"}
					>
						<h2>{title}</h2>
					</article>
				{/each}
			</div>
			<button
				class="more"
				on:click={() => {
					goto("/news")
				}}>View More News</button
			>
		</div>
		{#if tournaments.length == 0}
			<div class="section">
				<h1>Tournaments</h1>
				<hr />
				<NoContent missing="tournaments" />
			</div>
		{:else}
			<div class="section">
				<h1>Tournaments</h1>
				<hr />
				<div class="tournaments">
					{#each tournaments as { id, cover_image, title, tags, type, status, authUser, prize, startOn, max_slots, players, game }}
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
									<button on:click={() => goto(`/games/${game.id}`)}>{game.game_name}</button>
								</div>
								<div class="tags">
									{#each tags as tag}
										<button on:click={() => goto(`/tournaments/tag/${tag}`)}>{tag}</button>
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
									<button on:click={() => goto(`/tournaments/${id}`)}>Open tournament</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
				{#if tournaments.length < tournamentCount}
					<button
						class="more"
						on:click={() => {
							goto("/tournaments")
						}}>View More Tournaments</button
					>
				{/if}
			</div>
		{/if}
	{/if}
{/if}
