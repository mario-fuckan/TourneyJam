<script lang="ts">
	import Icon from "@iconify/svelte"
	import { enhance } from "$app/forms"
	import { tooltip } from "svooltip"
	import { goto } from "$app/navigation"

	let exists: boolean = false
	let tag: string
	let createState: string = ""

	export let form

	async function checkTag() {
		const res = await fetch("/api/checkTag", {
			method: "POST",
			body: JSON.stringify(tag)
		})

		const data = await res.json()

		exists = data.exists
	}

	$: if (form?.done) {
		createState = "done"
		setTimeout(() => {
			createState = ""
		}, 1000)
	}
</script>

<svelte:head>
	<title>TourneyJam - Add a tag</title>
</svelte:head>

<div class="addpagewrapper">
	<div class="addpageheading">
		<h1>Add a tag</h1>
		<p>Add more tags for games.</p>
	</div>
	<hr />
	<div class="addpagemodule">
		<div class="addmoduleleft">
			<h4>Tag</h4>
			<p>Enter your desired tag name.</p>
		</div>
		<div class="addmoduleright tagmodule">
			<input type="text" placeholder="Enter tag name..." on:keyup={checkTag} bind:value={tag} />
			<span
				class:usernametaken={exists == true}
				class:usernamefree={exists == false}
				use:tooltip={{
					content: exists == true ? "Tag already exists." : "Tag is available.",
					placement: "right",
					offset: 15
				}}
			>
				<Icon icon={exists == true ? "ph:x" : "carbon:checkmark-filled"} />
			</span>
		</div>
	</div>
	<hr />
	<div class="pesavebuttons">
		<button on:click={() => goto("/dashboard")}>Cancel</button>
		<form
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					await update()
					tag = ""
				}
			}}
		>
			<input type="text" name="tag" hidden bind:value={tag} />
			<button
				class="savechanges"
				type="submit"
				disabled={exists}
				on:click={() => {
					createState = "adding"
				}}
				>{createState == "done"
					? "Tag added!"
					: createState == "adding"
					? "Creating tag..."
					: "Save changes"}</button
			>
		</form>
	</div>
</div>
