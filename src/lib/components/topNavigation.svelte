<script lang="ts">
	import Icon from "@iconify/svelte"
	import { goto } from "$app/navigation"
	import { page } from "$app/stores"
	import type { User } from "$lib/types/user"
	import { calculate } from "$lib/actions/calculateLevel"
	import { onMount } from "svelte"
	import { slide } from "svelte/transition"
	import { badges as userbadges } from "$lib/utils/badges"
	import dataToPass from "$lib/stores/navigationRefresh"
	import Loading from "$lib/components/others/loading.svelte"
	import type { User as NavigationUser, Game, Tournament, Tag } from "$lib/types/navigationTypes"

	let user: User
	let userRank: string
	let levelPercentage: string | number = ""
	let update: boolean = false
	let updatebar: boolean = false
	let search: string = ""
	let loading: boolean = false

	let users: NavigationUser[] = []
	let games: Game[] = []
	let tournaments: Tournament[] = []
	let tags: Tag[] = []

	$: ({ hash } = $page.url)

	$: ({ user } = $page.data)

	onMount(() => {
		if (user) {
			if (user.level != 60) {
				;({ userRank, levelPercentage } = calculate(user.level, user.xp))
			} else {
				levelPercentage = "MAX"
				userRank = "rainbow"
			}
		}
	})

	$: if ($dataToPass.refresh) {
		user.level = $dataToPass.level
		user.xp = $dataToPass.xp

		update = true
		updatebar = true

		if (user.level != 60) {
			;({ userRank, levelPercentage } = calculate(user.level, user.xp))
		} else {
			levelPercentage = "MAX"
			userRank = "rainbow"
		}

		$dataToPass.refresh = false

		setTimeout(() => {
			update = false
			updatebar = false
		}, 600)
	}

	async function navigationSearch() {
		loading = true

		const res = await fetch("/api/navigationSearch", {
			method: "POST",
			body: JSON.stringify({
				query: search
			})
		})

		const data = await res.json()

		;({ users, games, tournaments, tags } = data)

		loading = false
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
</script>

<nav>
	<div class="navleft">
		<a href="/"><img src="/logo.svg" alt="Logo" draggable="false" /></a>
		<a href="/">Home</a>
		<a href="/games">Games</a>
		<a href="/tournaments">Tournaments</a>
		<a href="/leaderboard">Leaderboard</a>
		<a href="/news">News</a>
	</div>
	<div class="navcenter">
		<form>
			<input
				type="text"
				name="search"
				placeholder="Search"
				maxlength="40"
				bind:value={search}
				on:input={navigationSearch}
			/>
			<Icon icon="material-symbols:search" />
		</form>
		{#if search != ""}
			{#if loading}
				<div class="navsearchcontent" transition:slide>
					<Loading />
				</div>
			{:else}
				<div class="navsearchcontent" transition:slide>
					<div class="navsearchboxes">
						<div class="navbox">
							<h1>Users</h1>
							<hr />
							<div class="navboxcontent">
								{#each users as { username, profile_picture, badges }}
									<a href="/profile/{username}">
										<img src={profile_picture} alt={username} />
										{username}
										<div class="navbadges">
											{#if badges.length > 0}
												{#each badges as badge}
													<Icon
														icon={userbadges[badge].icon}
														style="color: {userbadges[badge].color}"
													/>
												{/each}
											{/if}
										</div>
									</a>
								{/each}
							</div>
						</div>
						<div class="navbox">
							<h1>Games</h1>
							<hr />
							<div class="navboxcontent">
								{#each games as { id, game_name, game_cover }}
									<a href="/games/{id}">
										<img src={game_cover} alt={game_name} />
										{game_name}
									</a>
								{/each}
							</div>
						</div>
						<div class="navbox">
							<h1>Tournaments</h1>
							<hr />
							<div class="navboxcontent">
								{#each tournaments as { id, title, cover_image, authUserId, players }}
									<a href="/tournaments/{id}">
										<img src={cover_image} alt={title} />
										{title}
										{#if authUserId == user?.userId}
											<div class="tournamenttag">Created</div>
										{:else if checkIfJoined(players)}
											<div class="tournamenttag">Joined</div>
										{/if}
									</a>
								{/each}
							</div>
						</div>
						<div class="navbox">
							<h1>Tags</h1>
							<hr />
							<div class="navboxcontent">
								{#each tags as { tag }}
									<a href="/tag/{tag}">
										{tag}
									</a>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
	<div class="navright">
		{#if !user}
			<a href="/login" class="login">Login</a>
		{:else}
			<div class="profile">
				<a href={"/profile/" + user.username}>
					<img class="profilepicture" src={user.profile_picture} alt={user.username} />
				</a>
				<div class="pil" class:update>
					<Icon icon="material-symbols:hexagon" class={"rank " + userRank} />
					<span>{user.level}</span>
				</div>
				<div class="xpbar" class:updatebar>
					<span class="xppercentage">
						{levelPercentage}{levelPercentage != "MAX" ? "%" : ""}
					</span>
					<div
						class={"xp " + userRank + "background"}
						style:width={levelPercentage == "MAX" ? "100%" : levelPercentage + "%"}
					/>
				</div>
			</div>
		{/if}
		<hr />
		{#if String(user?.role) == "admin"}
			<button on:click={() => goto("/dashboard")} class="adminaccess"
				><Icon icon="dashicons:admin-tools" /></button
			>
		{/if}
		<button
			id="settings"
			class="settings"
			on:click={() => {
				hash == "#settings" ? goto($page.url.pathname) : goto("#settings")
			}}
		>
			<Icon icon="material-symbols:settings" />
		</button>
	</div>
</nav>
