<script lang="ts">
	import Icon from "@iconify/svelte"
	import { onMount } from "svelte"
	import { goto } from "$app/navigation"
	import Loading from "$lib/components/others/loading.svelte"
	import type { Articles } from "$lib/types/news"

	let news: string
	let loading: boolean = true
	let articles: Articles[]

	onMount(async () => {
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
	{/if}
{/if}
<div class="section">
	<h1>Tournaments</h1>
	<hr />
	<div class="tournaments">
		{#each { length: 4 } as item}
			<div class="twrapper">
				<div class="tournament">
					<img
						class="tournamentimg"
						src="tournament.png"
						alt="Tournament Thumbnail"
						draggable="false"
					/>
					<p class="startdate">SEP 02 <Icon icon="mdi:dot" /> Starting / Ending at 6:00 AM</p>
					<h2>Game Title</h2>
					<div class="tags">
						<button>PC</button>
						<button>Battle Royale</button>
						<button>FPS</button>
					</div>
					<hr />
					<div class="gamestats">
						<div class="gameinfo">
							<h3>Prize Pool</h3>
							<div class="gameinfo2"><Icon icon="mdi:trophy" /> $0</div>
						</div>
						<div class="gameinfo">
							<h3>Team Size</h3>
							<div class="gameinfo2"><Icon icon="material-symbols:person" /> 3v3</div>
						</div>
						<div class="gameinfo">
							<h3>Patricipants</h3>
							<div class="gameinfo2"><Icon icon="mdi:stopwatch" /> 3/25</div>
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
	<button
		class="more"
		on:click={() => {
			goto("/tournaments")
		}}>View More Tournaments</button
	>
</div>
