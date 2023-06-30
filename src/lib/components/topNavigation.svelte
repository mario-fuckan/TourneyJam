<script lang="ts">
	import Icon from "@iconify/svelte"
	import { goto } from "$app/navigation"
	import { page } from "$app/stores"
	import type { User } from "$lib/types/user"
	import { calculate } from "$lib/actions/calculateLevel"
	import { onMount } from "svelte"

	let user: User
	let userRank: string
	let levelPercentage: string | number = ""

	$: ({ hash } = $page.url)

	$: ({ user } = $page.data)

	onMount(() => {
		if (user?.level != 50) {
			;({ userRank, levelPercentage } = calculate(user.level, user.xp))
		} else {
			levelPercentage = "MAX"
		}
	})
</script>

<nav>
	<div class="navleft">
		<a href="/"><img src="/logo.svg" alt="Logo" draggable="false" /></a>
		<a href="/">Home</a>
		<a href="/tournaments">Tournaments</a>
		<a href="/leaderboard">Leaderboard</a>
		<a href="/news">News</a>
	</div>
	<div class="navcenter">
		<form>
			<input type="text" name="search" placeholder="Search" maxlength="40" />
			<Icon icon="material-symbols:search" />
		</form>
	</div>
	<div class="navright">
		{#if !user}
			<a href="/login" class="login">Login</a>
		{:else}
			<div class="profile">
				<a href={"/profile/" + user.username}>
					<img class="profilepicture" src={user.profile_picture} alt={user.username} />
				</a>
				<div class="pil">
					<Icon icon="material-symbols:hexagon" class={"rank " + userRank} />
					<span>{user.level}</span>
				</div>
				<div class="xpbar">
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
