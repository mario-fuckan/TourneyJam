<script lang="ts">
	import Icon from "@iconify/svelte"
	import { fly } from "svelte/transition"
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"
	import Loading from "$lib/components/others/loading.svelte"
	import { onMount } from "svelte"
	import type { Game } from "$lib/types/game"
	import type { Favorite } from "$lib/types/favorite"
	import fetchLocalStorage from "$lib/stores/getLocalStorage"

	let loading: boolean = true
	let games: Game[]
	let gamesCount: number
	let buttonStates: buttonState[] = []
	let search: string = ""
	let popupWindow: HTMLDivElement
	let scrollLoading: boolean = false

	interface buttonState {
		id: number
		status: string
	}

	onMount(async () => {
		const res = await fetch("/api/listAllGames", {
			method: "POST"
		})

		const data = await res.json()

		games = data.games
		gamesCount = data.gamesCount

		games.map((e: Game) => {
			buttonStates.push({
				id: e.id,
				status: !checkFavorites(e.id) ? "Add to favorites" : "Remove from favorites"
			})
		})

		loading = false
	})

	$: ({ pathname } = $page.url)

	function toggleFavorite(gameID: number, name: string) {
		if (localStorage.getItem("favorites")) {
			//@ts-ignore
			let favorites: Favorite[] = JSON.parse(localStorage.getItem("favorites"))
			let existsIndex: number = -1

			for (let i = 0; i < favorites.length; i++) {
				if (favorites[i].id == gameID) {
					existsIndex = i
					break
				}
			}

			if (existsIndex == -1) {
				let firstLetters: string[] = []

				name.split(" ").map((e: string) => {
					firstLetters.push(e[0])
				})

				favorites.push({
					id: gameID,
					name,
					initials: firstLetters.join("")
				})

				const gameObject = buttonStates.find((e) => e.id == gameID)

				if (gameObject) {
					gameObject.status = "Remove from favorites"
					buttonStates = buttonStates
				}

				localStorage.setItem("favorites", JSON.stringify(favorites))
			} else {
				favorites.splice(existsIndex, 1)

				const gameObject = buttonStates.find((e) => e.id == gameID)

				if (gameObject) {
					gameObject.status = "Add to favorites"
					buttonStates = buttonStates
				}

				localStorage.setItem("favorites", JSON.stringify(favorites))
			}
		} else {
			let favorites: Favorite[] = []
			let firstLetters: string[] = []

			name.split(" ").map((e: string) => {
				firstLetters.push(e[0])
			})

			favorites.push({
				id: gameID,
				name,
				initials: firstLetters.join("")
			})

			const gameObject = buttonStates.find((e) => e.id == gameID)

			if (gameObject) {
				gameObject.status = "Remove from favorites"
				buttonStates = buttonStates
			}

			localStorage.setItem("favorites", JSON.stringify(favorites))
		}

		$fetchLocalStorage = true
	}

	function checkFavorites(gameID: number) {
		if (localStorage.getItem("favorites")) {
			//@ts-ignore
			let favorites: Favorite[] = JSON.parse(localStorage.getItem("favorites"))
			let existsIndex: number = -1

			for (let i = 0; i < favorites.length; i++) {
				if (favorites[i].id == gameID) {
					existsIndex = i
					break
				}
			}

			if (existsIndex == -1) {
				return false
			} else {
				return true
			}
		}
	}

	async function searchGames() {
		const res = await fetch("/api/popupSearch", {
			method: "POST",
			body: JSON.stringify(search)
		})

		const data = await res.json()

		games = data.games

		games.map((e: Game) => {
			const gameObject = buttonStates.find((ex) => ex.id == e.id)

			if (!gameObject) {
				buttonStates.push({
					id: e.id,
					status: !checkFavorites(e.id) ? "Add to favorites" : "Remove from favorites"
				})
			}
		})
	}

	async function scrollLoad() {
		const currentScrollHeight: number = popupWindow.scrollTop + popupWindow.offsetHeight
		const maxScrollHeight: number = popupWindow.scrollHeight

		if (currentScrollHeight == maxScrollHeight && search == "" && gamesCount != games.length) {
			scrollLoading = true
			const res = await fetch("/api/popupScrollLoad", {
				method: "POST",
				body: JSON.stringify(games.length)
			})

			const data = await res.json()

			games = [...games, ...data.games]

			games.map((e: Game) => {
				const gameObject = buttonStates.find((ex) => ex.id == e.id)

				if (!gameObject) {
					buttonStates.push({
						id: e.id,
						status: !checkFavorites(e.id) ? "Add to favorites" : "Remove from favorites"
					})
				}
			})

			scrollLoading = false
		}
	}
</script>

<div class="popup">
	<div in:fly={{ x: -300 }} out:fly={{ x: -300, duration: 250 }} class="popupwindow">
		<button class="closepopup" on:click={() => goto(pathname)}
			><Icon icon="material-symbols:close" /></button
		>
		{#if loading}
			<div class="popuploading">
				<Loading />
			</div>
		{:else}
			<div class="popupcontent" on:scroll={scrollLoad} bind:this={popupWindow}>
				<div class="popheader">
					<h1>Mark a game as your favorite</h1>
					<div class="headersearch">
						<input
							type="text"
							bind:value={search}
							placeholder="Search games..."
							on:input={searchGames}
						/>
						<Icon icon="material-symbols:search" />
					</div>
				</div>
				<hr />
				<div class="popupgames">
					{#each games as { id, game_name, game_cover }}
						{@const status = buttonStates.find((e) => e.id == id)?.status}
						<div class="pgame">
							<img src={game_cover} alt={game_name} loading="lazy" />
							<h2>{game_name}</h2>
							<button
								on:click={() => {
									toggleFavorite(id, game_name)
								}}
								class:favorite={status == "Add to favorites"}
								class:notfavorite={status == "Remove from favorites"}
							>
								{status}
							</button>
						</div>
					{/each}
				</div>
				{#if scrollLoading}
					<div class="poupscrollloading">
						<Loading />
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
