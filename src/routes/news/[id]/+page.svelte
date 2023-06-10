<script lang="ts">
	import type { PageData } from "./$types"

	export let data: PageData

	$: article = data.article.results[0]

	$: console.log(article)
</script>
