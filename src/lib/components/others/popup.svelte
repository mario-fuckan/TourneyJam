<script lang="ts">
	import Icon from "@iconify/svelte"
	import { fly } from "svelte/transition"
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"

	$: ({ pathname } = $page.url)
</script>

<div class="popup">
	<div in:fly={{ x: -300 }} out:fly={{ x: -300, duration: 250 }} class="popupcontent">
		<button on:click={() => goto(pathname)}><Icon icon="material-symbols:close" /></button>
	</div>
</div>
