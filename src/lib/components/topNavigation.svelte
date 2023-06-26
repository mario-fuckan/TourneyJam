<script lang="ts">
	import Icon from "@iconify/svelte"
	import { goto } from "$app/navigation"
	import { page } from "$app/stores"
	import type { User } from "$lib/types/user"

	let user: User

	$: ({ hash } = $page.url)

	$: ({ user } = $page.data)
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
