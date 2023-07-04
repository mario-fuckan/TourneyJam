<script lang="ts">
	import Icon from "@iconify/svelte"
	import { page } from "$app/stores"
	import type { User } from "$lib/types/user"

	let user: User

	$: ({ user } = $page.data)

	let currentyear: number = new Date().getFullYear()
</script>

<footer>
	<div class="footertop">
		<div class="footertopleft">
			<a href="/">
				<img src="/logo.png" alt="Website Icon" />
				<h1>TourneyJam</h1>
			</a>
		</div>
		<div class="footertopright">
			<a href="/">Home</a>
			<hr />
			<a href="/games">Games</a>
			<hr />
			<a href="/tournaments">Tournaments</a>
			<hr />
			<a href="/leaderboard">Leaderboard</a>
			<hr />
			<a href="/news">News</a>
			<hr />
			{#if String(user?.role) == "admin"}
				<a href="/dashboard">Dashboard</a>
			{/if}
		</div>
	</div>
	<hr />
	<div class="footerbottom">
		<div class="footerbottomleft">
			&copy; {currentyear} Made by
			<a href="https://github.com/ChampagneChugger" target="_blank">Mario Fučkan</a>
		</div>
		<div class="footerbottomright">
			<a href="/"><Icon icon="ri:facebook-fill" /></a>
			<a href="/"><Icon icon="mdi:twitter" /></a>
			<a href="/"><Icon icon="mdi:instagram" /></a>
			<a href="/"><Icon icon="mdi:youtube" /></a>
			<a href="/"><Icon icon="ri:linkedin-fill" /></a>
			<a href="/"><Icon icon="ic:baseline-discord" /></a>
			<a href="/"><Icon icon="ic:baseline-tiktok" /></a>
			<a href="/"><Icon icon="basil:telegram-solid" /></a>
		</div>
	</div>
</footer>
