<script lang="ts">
	import Icon from "@iconify/svelte"

	let currentyear: number = new Date().getFullYear()
</script>

<footer>
	<div class="footertop">
		<div class="footertopleft">
			<a href="/">
				<img src="logo.png" alt="Website Icon" />
				<h1>TourneyJam</h1>
			</a>
		</div>
		<div class="footertopright">
			<a href="/">Home</a>
			<a href="/tournaments">Tournaments</a>
			<a href="/leaderboard">Leaderboard</a>
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
