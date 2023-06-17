<script lang="ts">
	import "$lib/css/app.css"
	import { page } from "$app/stores"

	$: ({ hash } = $page.url)

	import TopNavigation from "$lib/components/topNavigation.svelte"
	import SideNavigation from "$lib/components/sideNavigation.svelte"
	import Footer from "$lib/components/footer.svelte"
	import Popup from "$lib/components/others/popup.svelte"
	import Settings from "$lib/components/others/settings.svelte"
</script>

<TopNavigation />
<SideNavigation />
<main>
	<slot />
</main>
<Footer />

{#if hash == "#add-game"}
	<Popup />
{:else if hash == "#settings"}
	<Settings />
{/if}
