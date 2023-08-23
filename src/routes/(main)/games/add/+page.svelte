<script lang="ts">
	import Icon from "@iconify/svelte"
	import { enhance } from "$app/forms"
	import { tooltip } from "svooltip"
	import { goto } from "$app/navigation"
	import DragAndDrop from "$lib/components/others/draganddrop.svelte"
	import type { OwnerList } from "$lib/types/owner"
	import { page } from "$app/stores"
	import { onMount } from "svelte"

	let exists: boolean = false
	let createState: string = ""

	let game_name: string
	let game_description: string
	let game_cover: string
	let game_background: string
	let game_showcase: string
	let game_tags: string[] = []
	let game_website: string
	let owner: string = $page.data.user.role == "admin" ? "" : $page.data.user.userId
	let ownerSearch: string

	let allTags: string[] = []
	let allUsers: OwnerList

	export let form

	async function checkGameName() {
		const res = await fetch("/api/checkGameName", {
			method: "POST",
			body: JSON.stringify(game_name)
		})

		const data = await res.json()

		exists = data.exists
	}

	function gameCover(e: any) {
		game_cover = e.detail
	}

	function gameBackground(e: any) {
		game_background = e.detail
	}

	$: if (form?.done) {
		createState = "done"
		setTimeout(() => {
			createState = ""
			setTimeout(() => {
				goto("/games/" + form?.createdGameId?.id)
			}, 500)
		}, 1000)
	}

	onMount(async () => {
		const res = await fetch("/api/getTags", {
			method: "POST"
		})

		const data = await res.json()

		data.tags.map((e: any) => {
			allTags.push(e.tag)
		})

		allTags = allTags
	})

	$: while (game_tags.length > 3) {
		game_tags.pop()
	}

	async function searchOwner() {
		const res = await fetch("/api/searchOwner", {
			method: "POST",
			body: JSON.stringify(ownerSearch)
		})

		const data = await res.json()

		allUsers = data.allUsers
		allUsers = allUsers
	}

	$: if (form?.where) {
		createState = ""
	}
</script>

<svelte:head>
	<title>TourneyJam - Add a game</title>
</svelte:head>

<div class="addpagewrapper">
	<div class="addpageheading">
		<h1>Add a game</h1>
		<p>Add more games to your database.</p>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Game name <span class="mandatory">*</span></h4>
			<p>Enter your desired game name.</p>
		</div>
		<div class="addmoduleright tagmodule">
			<input
				type="text"
				placeholder="Enter game name..."
				on:keyup={checkGameName}
				bind:value={game_name}
				class:shake={form?.where?.includes("game_name")}
				class:inputmissing={form?.where?.includes("game_name")}
			/>
			<span
				class:usernametaken={exists == true}
				class:usernamefree={exists == false}
				class:shake={form?.where?.includes("game_name")}
				use:tooltip={{
					content: exists == true ? "Game name is taken." : "Game name is available.",
					placement: "right",
					offset: 15
				}}
			>
				<Icon icon={exists == true ? "ph:x" : "carbon:checkmark-filled"} />
			</span>
		</div>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Game description <span class="mandatory">*</span></h4>
			<p>Tell us something about your game.</p>
		</div>
		<div class="addmoduleright descriptionmodule">
			<textarea
				name="game_description"
				placeholder="Tell us something about your awesome game... (Max. 1500 letters)"
				maxlength="1500"
				bind:value={game_description}
				class:shake={form?.where?.includes("game_description")}
				class:inputmissing={form?.where?.includes("game_description")}
			/>
		</div>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Game cover image <span class="mandatory">*</span></h4>
			<p>Upload your cover image. This image will be displayed as a thumbnail.</p>
		</div>
		<div class="addmoduleright gameimagemodule">
			<img
				src={game_cover ? game_cover : "/tournament.png"}
				alt="Game Cover"
				class:shake={form?.where?.includes("game_cover")}
				class:inputmissing={form?.where?.includes("game_cover")}
			/>
			<DragAndDrop mode="game_cover" text="max. 1920x1080px" on:gameCover={gameCover} />
		</div>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Game background image</h4>
			<p>Upload your background image. This image will be displayed on your game page header.</p>
		</div>
		<div class="addmoduleright gameimagemodule">
			<img src={game_background ? game_background : "/tournament.png"} alt="Game background" />
			<DragAndDrop
				mode="game_background"
				text="max. 1920x1080px"
				on:gameBackground={gameBackground}
			/>
		</div>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Game showcase</h4>
			<p>Enter your YouTube video link. This video will be displayed on your game page.</p>
		</div>
		<div class="addmoduleright tagmodule">
			<input type="text" placeholder="YouTube link here..." bind:value={game_showcase} />
		</div>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Game tags</h4>
			<p>Select tags that best describe your game. (Max. 3)</p>
		</div>
		<div class="addmoduleright selectmodule">
			<select name="tags" multiple bind:value={game_tags}>
				{#each allTags as tag}
					<option value={tag}>{tag}</option>
				{/each}
			</select>
		</div>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Game website</h4>
			<p>Put in your website's link. This will be displayed on your game page.</p>
		</div>
		<div class="addmoduleright tagmodule">
			<input type="text" placeholder="Enter your website URL..." bind:value={game_website} />
		</div>
	</div>
	<hr />
	{#if $page.data.user.role == "admin"}
		<div class="addpagemodule">
			<div class="addmoduleleft">
				<h4>Who owns this game?</h4>
				<p>Who owns this game? Leave empty if user does not exist.</p>
			</div>
			<div class="addmoduleright searchmodule">
				<input
					type="text"
					placeholder="Enter owner's username"
					bind:value={ownerSearch}
					on:keyup={searchOwner}
				/>
				<select name="owner" bind:value={owner}>
					<option value="" disabled selected>Select the owner</option>
					{#if allUsers}
						{#each allUsers as { username, id }}
							<option value={id}>{username}</option>
						{/each}
					{/if}
				</select>
			</div>
		</div>
		<hr />
	{/if}
	<div class="pesavebuttons">
		<button on:click={() => goto("/games")}>Cancel</button>
		<form
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false })
				}
			}}
		>
			<input type="text" name="game_name" bind:value={game_name} hidden />
			<input type="text" name="game_description" bind:value={game_description} hidden />
			<input type="text" name="game_cover" bind:value={game_cover} hidden />
			<input type="text" name="game_background" bind:value={game_background} hidden />
			<input type="text" name="game_showcase" bind:value={game_showcase} hidden />
			<input type="text" name="game_tags" bind:value={game_tags} hidden />
			<input type="text" name="game_website" bind:value={game_website} hidden />
			<input type="text" name="owner" bind:value={owner} hidden />
			<button
				class="savechanges"
				type="submit"
				disabled={exists}
				on:click={() => {
					createState = "adding"
				}}
				>{createState == "done"
					? "Game added!"
					: createState == "adding"
					? "Adding game..."
					: "Add a game"}</button
			>
		</form>
	</div>
</div>
