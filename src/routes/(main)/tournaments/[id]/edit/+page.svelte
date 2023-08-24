<script lang="ts">
	import { onMount, onDestroy } from "svelte"
	import { page } from "$app/stores"
	import Loading from "$lib/components/others/loading.svelte"
	import type { Tournament } from "$lib/types/tournament"
	import { io } from "socket.io-client"
	import { enhance } from "$app/forms"
	import { goto } from "$app/navigation"
	import DragAndDrop from "$lib/components/others/draganddrop.svelte"

	const socket = io("https://socketserver-yq5m.onrender.com")

	socket.emit("tournamentId", $page.params.id)

	let loading: boolean = true
	let tournament: Tournament

	export let form

	let createState: string = ""
	let date: string
	let time: string
	let tag: string

	let title: string
	let description: string
	let cover_image: string
	let prize: string
	let type: string
	let password: string
	let creatorStream: string
	let startOn: Date | string
	let tags: string[]
	let status: string

	onMount(async () => {
		const res = await fetch("/api/getTournamentByIdEdit", {
			method: "POST",
			body: JSON.stringify($page.params.id)
		})

		const data = await res.json()

		tournament = data.tournament

		if (tournament.status == "ended") {
			goto(`/tournaments/${$page.params.id}`)
		}

		title = tournament.title
		description = tournament.description
		cover_image = tournament.cover_image
		prize = String(tournament.prize)
		type = tournament.type
		password = tournament.password
		creatorStream = tournament.creatorStream
		tags = tournament.tags
		startOn = tournament.startOn
		status = tournament.status

		date = new Date(startOn).toISOString().split("T")[0]
		time = new Date(startOn).toTimeString().split(" ")[0]

		loading = false
	})

	onDestroy(() => {
		socket.disconnect()
	})

	function tournamentCover(e: any) {
		cover_image = e.detail
	}

	$: if (form?.done) {
		createState = "done"
		socket.emit("usersToRefresh", form.usersToRefresh)
		socket.emit("refreshTournamentPage", true)
		setTimeout(() => {
			createState = ""
			setTimeout(() => {
				goto("/tournaments/" + $page.params.id)
			}, 500)
		}, 1000)
	}

	$: if (form?.where) {
		createState = ""
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

		if (Number(prize) > 10000) {
			prize = "10000"
		}
	}
</script>

<svelte:head>
	<title>TourneyJam - {tournament?.title}</title>
</svelte:head>

{#if loading}
	<Loading />
{:else}
	<div class="addpagewrapper">
		<div class="addpageheading">
			<h1>Editing {tournament.title}</h1>
			<p>Start your own tournament in a few clicks.</p>
		</div>
		<hr />
		<div class="addpagemodule">
			<div class="addmoduleleft statusmodule">
				<h4>Tournament status <span class="mandatory">*</span></h4>
				<p>Select the status of your tournament.</p>
				<div class="notes">
					<p><span>Note:</span> Changing this to <span>Active</span> will reset your bracket.</p>
					<p>
						<span>Note:</span> Changing this to <span>Scheduled</span> will hide the bracket and enable
						player signup.
					</p>
					<p>
						<span>Note:</span> Changing this to <span>Ended</span> will close your tournament and you
						will lose access.
					</p>
				</div>
			</div>
			<div class="addmoduleright statusbuttons">
				<button
					class:activeStatus={status == "active"}
					on:click={() => {
						status = "active"
					}}>Active</button
				>
				<button
					class:activeStatus={status == "scheduled"}
					on:click={() => {
						status = "scheduled"
					}}>Scheduled</button
				>
				<button
					class:activeStatus={status == "ended"}
					on:click={() => {
						status = "ended"
					}}>Ended</button
				>
			</div>
		</div>
		<hr />
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
		{#if status != "active"}
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
		{/if}
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
		<div class="pesavebuttons">
			<button on:click={() => goto(`/tournaments/${$page.params.id}`)}>Cancel</button>
			<form
				method="POST"
				use:enhance={() => {
					return async ({ update }) => {
						update({ reset: false })
					}
				}}
			>
				<input type="text" name="title" bind:value={title} hidden />
				<input type="text" name="description" bind:value={description} hidden />
				<input type="text" name="cover_image" bind:value={cover_image} hidden />
				<input type="text" name="prize" bind:value={prize} hidden />
				<input type="text" name="startOn" bind:value={startOn} hidden />
				<input type="text" name="type" bind:value={type} hidden />
				<input type="text" name="password" bind:value={password} hidden />
				<input type="text" name="tags" bind:value={tags} hidden />
				<input type="text" name="creatorString" bind:value={creatorStream} hidden />
				<input type="text" name="status" bind:value={status} hidden />
				<button
					class="savechanges"
					type="submit"
					on:click={() => {
						createState = "editing"
					}}
					>{createState == "done"
						? "Tournament edited!"
						: createState == "editing"
						? "Editing tournament..."
						: "Edit tournament"}</button
				>
			</form>
		</div>
	</div>
{/if}
