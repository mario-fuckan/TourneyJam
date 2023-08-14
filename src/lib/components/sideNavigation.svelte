<script lang="ts">
	import Icon from "@iconify/svelte"
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"
	import { tooltip } from "svooltip"
	import type { User } from "$lib/types/user"
	import { onMount } from "svelte"
	import type { Favorite } from "$lib/types/favorite"
	import fetchLocalStorage from "$lib/stores/getLocalStorage"

	let user: User
	let favoriteGames: Favorite[] = []

	$: ({ pathname } = $page.url)

	$: ({ user } = $page.data)

	onMount(() => {
		if (localStorage.getItem("favorites")) {
			//@ts-ignore
			favoriteGames = JSON.parse(localStorage.getItem("favorites"))
		}
	})

	$: if ($fetchLocalStorage) {
		//@ts-ignore
		favoriteGames = JSON.parse(localStorage.getItem("favorites"))
		$fetchLocalStorage = false
	}
</script>

<aside>
	<a
		href="/"
		class:currentpage={pathname == "/"}
		use:tooltip={{
			content: "Home",
			placement: "right",
			offset: 15
		}}><Icon icon="clarity:home-solid" /></a
	>
	<a
		href="/games"
		class:currentpage={pathname == "/games"}
		use:tooltip={{
			content: "Games",
			placement: "right",
			offset: 15
		}}><Icon icon="fluent:games-16-filled" /></a
	>
	<a
		href="/tournaments"
		class:currentpage={pathname == "/tournaments"}
		use:tooltip={{
			content: "Tournaments",
			placement: "right",
			offset: 15
		}}><Icon icon="mdi:trophy" /></a
	>
	<a
		href="/leaderboard"
		class:currentpage={pathname == "/leaderboard"}
		use:tooltip={{
			content: "Leaderboard",
			placement: "right",
			offset: 15
		}}><Icon icon="material-symbols:leaderboard" /></a
	>
	<a
		href="/news"
		class:currentpage={pathname == "/news"}
		use:tooltip={{
			content: "News",
			placement: "right",
			offset: 15
		}}
	>
		<Icon icon="fluent:news-20-filled" />
	</a>
	{#if String(user?.role) == "admin"}
		<a
			href="/dashboard"
			class:currentpage={pathname == "/dashboard"}
			use:tooltip={{
				content: "Dashboard",
				placement: "right",
				offset: 15
			}}
		>
			<Icon icon="dashicons:admin-tools" />
		</a>
	{/if}
	<hr />
	<button
		id="add-game"
		class="addgame"
		on:click={() => {
			goto("#add-game")
		}}
		use:tooltip={{
			content: "Add a Game",
			placement: "right",
			offset: 15
		}}
	>
		<Icon icon="basil:add-solid" />
	</button>
	{#if favoriteGames.length > 0}
		<div class="favoritegames">
			{#each favoriteGames as { id, name, initials }}
				<button
					class="addgame"
					on:click={() => {
						goto(`/games/${id}`)
					}}
					use:tooltip={{
						content: name,
						placement: "right",
						offset: 15
					}}
				>
					{initials}
				</button>
			{/each}
		</div>
	{/if}
</aside>
