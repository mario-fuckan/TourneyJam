<script lang="ts">
	import Icon from "@iconify/svelte"
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"

	$: ({ pathname } = $page.url)
</script>

<aside>
	<a href="/" class:currentpage={pathname == "/"}><Icon icon="clarity:home-solid" /></a>
	<a href="/tournaments" class:currentpage={pathname == "/tournaments"}
		><Icon icon="mdi:trophy" /></a
	>
	<a href="/leaderboard" class:currentpage={pathname == "/leaderboard"}
		><Icon icon="material-symbols:leaderboard" /></a
	>
	<a href="/news" class:currentpage={pathname == "/news"}>
		<Icon icon="fluent:news-20-filled" />
	</a>
	<hr />
	<button
		id="add-game"
		class="addgame"
		on:click={() => {
			goto("#add-game")
		}}
	>
		<Icon icon="basil:add-solid" />
	</button>
</aside>
