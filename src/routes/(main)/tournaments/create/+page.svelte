<script lang="ts">
	import { enhance } from "$app/forms"
	import { goto } from "$app/navigation"
	import DragAndDrop from "$lib/components/others/draganddrop.svelte"
	import { page } from "$app/stores"
	import type { Game } from "$lib/types/tournamentGame"

	let exists: boolean = false
	let createState: string = ""
	let game_query: string
	let allGames: Game[] = []
	let date: string
	let time: string
	let tags: string[] = []
	let tag: string = ""

	let title: string
	let description: string
	let cover_image: string
	let prize: string
	let max_slots: string
	let gameId: string = ""
	let startOn: string
	let type: string
	let password: string = ""
	let creatorStream: string = ""

	let owner: string = $page.data.user.userId

	export let form

	function tournamentCover(e: any) {
		cover_image = e.detail
	}

	$: if (form?.done) {
		createState = "done"
		setTimeout(() => {
			createState = ""
			setTimeout(() => {
				goto("/tournaments/" + form?.createdTournamentId?.id)
			}, 500)
		}, 1000)
	}

	$: if (form?.where) {
		createState = ""
	}

	async function searchGame() {
		if (game_query != "") {
			const res = await fetch("/api/tournamentSearchGame", {
				method: "POST",
				body: JSON.stringify(game_query)
			})

			const data = await res.json()

			allGames = data.games
		} else {
			allGames = []
		}
	}

	$: if (date && time) {
		startOn = date + " " + time
	}

	function addTag() {
		if (tag != "" && tags.length < 3) {
			tags.push(tag)
			tags = tags
			tag = ""
		}
	}

	function removeTag(tag: string) {
		tags.splice(
			tags.findIndex((tagItem) => tagItem == tag),
			1
		)
		tags = tags
	}

	function onlyNumbers() {
		if (prize) {
			prize = prize.replace(/[^0-9]/g, "")
		}

		if (max_slots) {
			max_slots = max_slots.replace(/[^0-9]/g, "")
		}

		if (Number(prize) > 10000) {
			prize = "10000"
		}

		if (Number(max_slots) > 50) {
			max_slots = "50"
		}
	}
</script>

<svelte:head>
	<title>TourneyJam - Create a tournament</title>
</svelte:head>

<div class="addpagewrapper">
	<div class="addpageheading">
		<h1>Creating a tournament</h1>
		<p>Start your own tournament in a few clicks.</p>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>On which game is the tournament based on? <span class="mandatory">*</span></h4>
			<p>Select the game to continue the creation process.</p>
		</div>
		<div class="addmoduleright searchmodule">
			<input
				type="text"
				placeholder="Enter game name..."
				bind:value={game_query}
				on:keyup={searchGame}
			/>
			<select name="gameId" bind:value={gameId}>
				<option value="" disabled selected>Select the game</option>
				{#if allGames.length > 0}
					{#each allGames as { game_name, id }}
						<option value={id}>{game_name}</option>
					{/each}
				{/if}
			</select>
		</div>
	</div>
	<hr />
	{#if gameId != ""}
		<div class="addpagemodule">
			<div class="addmoduleleft">
				<h4>Tournament cover image <span class="mandatory">*</span></h4>
				<p>Upload your cover image. This image will be displayed as a thumbnail.</p>
			</div>
			<div class="addmoduleright gameimagemodule">
				<img
					src={cover_image ? cover_image : "/tournament.png"}
					alt="Tournament Cover"
					class:shake={form?.where?.includes("cover_image")}
					class:inputmissing={form?.where?.includes("cover_image")}
				/>
				<DragAndDrop
					mode="tournament_cover"
					text="max. 1920x1080px"
					on:tournamentCover={tournamentCover}
				/>
			</div>
		</div>
		<hr />
		<div class="addpagemodule">
			<div class="addmoduleleft">
				<h4>Tournament title <span class="mandatory">*</span></h4>
				<p>Enter your desired tournament title.</p>
			</div>
			<div class="addmoduleright tagmodule">
				<input
					type="text"
					placeholder="Enter tournament title..."
					bind:value={title}
					class:shake={form?.where?.includes("title")}
					class:inputmissing={form?.where?.includes("title")}
				/>
			</div>
		</div>
		<hr />
		<div class="addpagemodule">
			<div class="addmoduleleft">
				<h4>Tournament description <span class="mandatory">*</span></h4>
				<p>Tell us something about your tournament.</p>
			</div>
			<div class="addmoduleright descriptionmodule">
				<textarea
					name="game_description"
					placeholder="Tell us something about your tournament... (Max. 1500 letters)"
					maxlength="1500"
					bind:value={description}
					class:shake={form?.where?.includes("description")}
					class:inputmissing={form?.where?.includes("description")}
				/>
			</div>
		</div>
		<hr />
		<div class="addpagemodule prizemodule">
			<div class="addmoduleleft">
				<h4>Prize <span class="mandatory">*</span></h4>
				<p>Enter the prize for the tournament.</p>
				<p><span>Note:</span> Only the winner gets the prize.</p>
			</div>
			<div class="addmoduleright tagmodule">
				<input
					type="text"
					placeholder="Prize amount..."
					bind:value={prize}
					on:input={onlyNumbers}
					class:shake={form?.where?.includes("prize")}
					class:inputmissing={form?.where?.includes("prize")}
				/>
			</div>
		</div>
		<hr />
		<div class="addpagemodule prizemodule">
			<div class="addmoduleleft">
				<h4>Maximum number of participants <span class="mandatory">*</span></h4>
				<p>Enter the max number of participants in your tournament.</p>
			</div>
			<div class="addmoduleright tagmodule">
				<input
					type="text"
					placeholder="Max number of participants..."
					bind:value={max_slots}
					on:input={onlyNumbers}
					class:shake={form?.where?.includes("max_slots")}
					class:inputmissing={form?.where?.includes("max_slots")}
				/>
			</div>
		</div>
		<hr />
		<div class="addpagemodule">
			<div class="addmoduleleft">
				<h4>Starting date and time <span class="mandatory">*</span></h4>
				<p>Pick a starting date and time for your tournament.</p>
			</div>
			<div class="addmoduleright datemodule">
				<input
					type="date"
					bind:value={date}
					class:shake={form?.where?.includes("startOn")}
					class:inputmissing={form?.where?.includes("startOn")}
				/>
				<input
					type="time"
					bind:value={time}
					class:shake={form?.where?.includes("startOn")}
					class:inputmissing={form?.where?.includes("startOn")}
				/>
			</div>
		</div>
		<hr />
		<div class="addpagemodule">
			<div class="addmoduleleft">
				<h4>Tournament type <span class="mandatory">*</span></h4>
				<p>Pick your tournament type.</p>
			</div>
			<div class="addmoduleright typemodule">
				<select
					name="type"
					bind:value={type}
					class:shake={form?.where?.includes("type")}
					class:inputmissing={form?.where?.includes("type")}
				>
					<option value="" selected disabled>Select tournament type</option>
					<option value="open">Open</option>
					<option value="passwordProtected">Password protected</option>
				</select>
				{#if type == "passwordProtected"}
					<input
						type="text"
						placeholder="Enter password..."
						bind:value={password}
						class:shake={form?.where?.includes("password")}
						class:inputmissing={form?.where?.includes("password")}
					/>
				{/if}
			</div>
		</div>
		<hr />
		<div class="addpagemodule">
			<div class="addmoduleleft addtags">
				<h4>Tournament tags</h4>
				<p>Put up to 3 tags for your tournament.</p>
				<p><span>Note: </span>Click on the tag to remove it.</p>
			</div>
			<div class="addmoduleright">
				<div class="addtagsmodule">
					<input type="text" placeholder="Write your tag..." bind:value={tag} />
					<button on:click={addTag}>Add</button>
				</div>
				<div class="moduletags">
					{#each tags as tag}
						<button on:click={() => removeTag(tag)}>{tag}</button>
					{/each}
				</div>
			</div>
		</div>
		<hr />
		<div class="addpagemodule prizemodule">
			<div class="addmoduleleft">
				<h4>Your Twitch.tv username</h4>
				<p>Enter your username to display your stream on the tournament page.</p>
			</div>
			<div class="addmoduleright tagmodule">
				<input type="text" placeholder="myusername" bind:value={creatorStream} />
			</div>
		</div>
		<hr />
	{/if}
	<div class="pesavebuttons">
		<button on:click={() => goto("/tournaments")}>Cancel</button>
		{#if gameId != ""}
			<form
				method="POST"
				use:enhance={() => {
					return async ({ update }) => {
						await update()
						title = ""
						description = ""
						cover_image = ""
						prize = ""
						max_slots = ""
						date = ""
						time = ""
						startOn = ""
						type = ""
						tags = []
						password = ""
						creatorStream = ""
					}
				}}
			>
				<input type="text" name="title" bind:value={title} hidden />
				<input type="text" name="description" bind:value={description} hidden />
				<input type="text" name="cover_image" bind:value={cover_image} hidden />
				<input type="text" name="prize" bind:value={prize} hidden />
				<input type="text" name="max_slots" bind:value={max_slots} hidden />
				<input type="text" name="owner" bind:value={owner} hidden />
				<input type="text" name="gameId" bind:value={gameId} hidden />
				<input type="text" name="startOn" bind:value={startOn} hidden />
				<input type="text" name="type" bind:value={type} hidden />
				<input type="text" name="password" bind:value={password} hidden />
				<input type="text" name="tags" bind:value={tags} hidden />
				<input type="text" name="creatorString" bind:value={creatorStream} hidden />
				<button
					class="savechanges"
					type="submit"
					disabled={exists}
					on:click={() => {
						createState = "creating"
					}}
					>{createState == "done"
						? "Tournament created!"
						: createState == "creating"
						? "Creating tournament..."
						: "Create tournament"}</button
				>
			</form>
		{/if}
	</div>
</div>
