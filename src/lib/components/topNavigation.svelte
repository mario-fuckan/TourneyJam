<script lang="ts">
	import Icon from "@iconify/svelte"
	import { goto } from "$app/navigation"
	import { page } from "$app/stores"

	$: ({ hash } = $page.url)

	let logged: boolean = false
</script>

<svelte:head>
	<title>TourneyJam - Host your own tournaments</title>
</svelte:head>

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
		{#if !logged}
			<a href="/login" class="login">Login</a>
		{:else}
			<div class="profile">
				<a href="/profile/myusername">
					<img class="profilepicture" src="profile_pictures/picture_9.png" alt="My Profile" />
				</a>
				<img src="logo.svg" alt="Rank" class="rank" />
				<div class="xpbar">
					<div class="xp" />
				</div>
			</div>
		{/if}
		<hr />
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
