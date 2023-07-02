<script lang="ts">
	import { page } from "$app/stores"
	import Icon from "@iconify/svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import { tooltip } from "svooltip"
	import { badges } from "$lib/utils/badges"
	import { goto } from "$app/navigation"
	import type { UserFull } from "$lib/types/userfull"
	import { onMount } from "svelte"
	import { enhance } from "$app/forms"
	import DragAndDrop from "$lib/components/others/draganddrop.svelte"
	import type { ActionData } from "./$types"

	let user: string = $page.params.username
	let userProfile: UserFull
	let loading: boolean = true
	let linkstate: string = "Share"
	let social: string[] = []
	let newUsername: string
	let exists: boolean
	export let form: ActionData

	function capitalize(badge: any): string {
		return badge.charAt(0).toUpperCase() + badge.slice(1)
	}

	function copyLink() {
		navigator.clipboard.writeText(copypaste)
		linkstate = "Link copied to clipboard!"
	}

	function resetLinkState() {
		setTimeout(() => {
			linkstate = "Share"
		}, 100)
	}

	$: copypaste = $page.url.origin + "/profile/" + user
	$: url = $page.url.hostname + "/profile/" + user

	onMount(async () => {
		getProfile(user)
	})

	async function getProfile(user: string) {
		const res = await fetch("/api/getProfile", {
			method: "POST",
			body: JSON.stringify(user)
		})

		const data = await res.json()

		userProfile = data.user

		if (userProfile.socials) {
			for (let i = 0; i < userProfile.socials.length; i++) {
				social[i] = userProfile.socials[i].url
			}
		}

		newUsername = userProfile.username

		loading = false
	}

	function profilePicture(e: any) {
		userProfile.profile_picture = e.detail
	}

	async function verifyUsername() {
		if (newUsername.length < 3 || newUsername.length > 15) {
			newUsername = userProfile.username
		} else {
			const res = await fetch("/api/checkUsername", {
				method: "POST",
				body: JSON.stringify(newUsername)
			})

			const data = await res.json()

			exists = data.exists
		}
	}

	$: if (form?.error) {
		setTimeout(() => {
			form = null
		}, 400)
	}

	$: if (form?.updateFinished) {
		getProfile(newUsername)
		user = userProfile.username
		goto("/profile/" + newUsername + "/edit")
		setTimeout(() => {
			form = null
		}, 1000)
	}
</script>

<svelte:head>
	<title>TourneyJam - Editing {user}'s profile</title>
</svelte:head>

{#if loading}
	<Loading />
{:else}
	<div class="profilewrapper">
		<div class="profileheader">
			<div class="p1">
				<div class="ppicture">
					<img src={userProfile.profile_picture} alt={userProfile.username} draggable="false" />
				</div>
				<div class="pnameandlink">
					<div class="pnameandbadges">
						<div class="pname">{userProfile?.username}</div>
						<div class="pbadges">
							{#each userProfile.badges as badge}
								<div
									class="badge"
									use:tooltip={{
										content: capitalize(badge),
										placement: "top",
										offset: 15
									}}
								>
									<Icon icon={badges[badge].icon} style="color: {badges[badge].color}" />
								</div>
							{/each}
						</div>
					</div>
					<div class="plink">
						<button
							use:tooltip={{
								content: linkstate,
								placement: "right",
								offset: 15
							}}
							on:mouseleave={resetLinkState}
							on:click={copyLink}>{url} <Icon icon="ph:share-bold" /></button
						>
					</div>
				</div>
			</div>
			<div class="pview">
				<button on:click={() => goto("/profile/" + userProfile.username)}>View profile</button>
			</div>
		</div>
		<div class="profileupdateheader">
			<div class="puh1">
				<h1>User profile</h1>
				<p>Update your picture and details here.</p>
			</div>
			<div class="puh2">
				<button on:click={() => goto("/profile/" + userProfile.username)}>Cancel</button>
				<form
					use:enhance={() => {
						return async ({ update }) => {
							await update({ reset: false })
						}
					}}
					method="POST"
				>
					<input type="text" name="username" bind:value={newUsername} hidden />
					<input
						type="text"
						name="profilepicture"
						bind:value={userProfile.profile_picture}
						hidden
					/>
					<input type="text" name="socialmedia" bind:value={social} hidden />
					<button class="savechanges" type="submit"
						>{!form?.updateFinished ? "Save changes" : "Changes saved!"}</button
					>
				</form>
			</div>
		</div>
		<hr />
		<div class="profilemodule">
			<div class="pmoduleleft">
				<h4>Public profile</h4>
				<p>This will be displayed on your profile.</p>
			</div>
			<div class="pmoduleright pmodule1">
				<input
					on:submit={verifyUsername}
					on:mouseleave={verifyUsername}
					type="text"
					minlength="3"
					bind:value={newUsername}
				/>
				<span
					class:usernametaken={exists == true && newUsername != userProfile.username}
					class:usernamefree={exists == false || newUsername == userProfile.username}
					use:tooltip={{
						content: exists == true ? "Username is taken." : "Username is available.",
						placement: "right",
						offset: 15
					}}
				>
					<Icon
						class={form?.error ? "shake" : ""}
						icon={exists == true && newUsername != userProfile.username
							? "ph:x"
							: "carbon:checkmark-filled"}
					/>
				</span>
			</div>
		</div>
		<hr />
		<div class="profilemodule">
			<div class="pmoduleleft">
				<h4>Profile picture</h4>
				<p>Update your profile picture.</p>
			</div>
			<div class="pmoduleright pmodule2">
				<img src={userProfile.profile_picture} alt={userProfile.username} />
				<DragAndDrop on:profilePicture={profilePicture} />
			</div>
		</div>
		<hr />
		<div class="profilemodule">
			<div class="pmoduleleft">
				<h4>Social profiles</h4>
				<p>Link up to 6 social media platforms.</p>
			</div>
			<div class="pmoduleright pmodule3">
				{#each { length: 6 } as placeholder, i}
					<input type="text" placeholder="Paste URL here..." bind:value={social[i]} />
				{/each}
			</div>
		</div>
		<hr />
		<div class="pesavebuttons">
			<button on:click={() => goto("/profile/" + userProfile.username)}>Cancel</button>
			<form
				use:enhance={() => {
					return async ({ update }) => {
						await update({ reset: false })
					}
				}}
				method="POST"
			>
				<input type="text" name="username" bind:value={newUsername} hidden />
				<input type="text" name="profilepicture" bind:value={userProfile.profile_picture} hidden />
				<input type="text" name="socialmedia" bind:value={social} hidden />
				<button class="savechanges" type="submit"
					>{!form?.updateFinished ? "Save changes" : "Changes saved!"}</button
				>
			</form>
		</div>
	</div>
{/if}
