<script lang="ts">
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import Loading from "$lib/components/others/loading.svelte"
	import type { User } from "$lib/types/user"
	import { goto } from "$app/navigation"
	import type { Game } from "$lib/types/game"
	import Icon from "@iconify/svelte"

	let user: User
	let loading: boolean = true
	let game: Game
	let buttonClicked: string = "Showcase"

	$: ({ user } = $page.data)

	onMount(async () => {
		const res = await fetch("/api/getGame", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		game = data.game

		if (!game) {
			goto("/error")
		}

		loading = false
	})

	function showcase() {
		buttonClicked = "Showcase"
	}

	function tournaments() {
		buttonClicked = "Tournaments"
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
						<a href={game.game_website} target="_blank"><Icon icon="uil:link" />Official website</a>
						{#if game.authUser}
							<a href={"/profile/" + game.authUser.username}><Icon icon="uil:link" />Publisher</a>
						{/if}
					</div>
				</div>
				<div class="gameheadertags">
					{#each game.game_tags as tag}
						<a href={`/tag/${tag}`}>{tag}</a>
					{/each}
				</div>
			</div>
		</div>
		<div class="gamecontentwrapper">
			<div class="gameoptions">
				<button class:clicked={buttonClicked == "Showcase"} on:click={showcase}>Showcase</button>
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
				<div class="gametournaments">Tournaments</div>
			{/if}
		</div>
	{/if}
</div>
