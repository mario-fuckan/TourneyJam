<script lang="ts">
	import type { PageData } from "./$types"

	export let data: PageData

	$: article = data.article.results[0]
</script>

<div class="newsarticle">
	<img src={article.image.original} alt={article.title} draggable="false" />
	<h1>{article.title}</h1>
	<h2>Author: {article.authors}</h2>
	<div class="newscontent">
		{@html article.body}
	</div>
</div>
