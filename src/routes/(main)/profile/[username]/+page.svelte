<script lang="ts">
	import { page } from "$app/stores"
	import { onMount } from "svelte"
	import Icon from "@iconify/svelte"
	import Loading from "$lib/components/others/loading.svelte"
	import { badges } from "$lib/utils/badges"
	import type { UserFull } from "$lib/types/userfull"
	import type { User } from "$lib/types/user"
	import type { Game } from "$lib/types/gamesGame"
	import { socials } from "$lib/utils/socials"
	import { tooltip } from "svooltip"
	import { goto, afterNavigate } from "$app/navigation"
	import { enhance } from "$app/forms"

	let userProfile: UserFull
	let userGames: Game[]
	let user: User
	let loading: boolean = true
	let linkstate: string = "Share"

	$: ({ username } = $page.params)
	$: ({ user } = $page.data)
	$: copypaste = $page.url.origin + $page.url.pathname
	$: url = $page.url.hostname + $page.url.pathname

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

	function getSocialIcon(social: string) {
		if (socials[social]) {
			return socials[social].icon
		} else {
			return socials["globe"].icon
		}
	}

	function dateFormat(date: Date) {
		let dateNew: Date = new Date(date)

		let day = dateNew.getDate()
		let month = dateNew.getMonth() + 1
		let year = dateNew.getFullYear()

		return day + "." + month + "." + year
	}

	onMount(async () => {
		getUser()
	})

	afterNavigate(async () => {
		getUser()
	})

	async function getUser() {
		const res = await fetch("/api/getProfile", {
			method: "POST",
			body: JSON.stringify(username)
		})

		const data = await res.json()

		userProfile = data.user

		if (String(userProfile.role) == "company") {
			userGames = data.userGames
			console.log(userGames)
		}

		loading = false
	}
</script>

<svelte:head>
	<title>TourneyJam - {username}'s profile</title>
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
						<div class="pname">{userProfile.username}</div>
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
			{#if user?.username == userProfile.username || String(user?.role) == "admin"}
				<div class="pview">
					{#if (String(user?.role) == "company" || String(user?.role) == "admin") && user?.username == userProfile.username}
						<button on:click={() => goto("/games/add")}>Add a game</button>
					{/if}
					<button on:click={() => goto("/profile/" + userProfile.username + "/edit")}
						>Edit profile</button
					>
					{#if user?.username == userProfile.username}
						<form use:enhance method="POST">
							<button type="submit">Logout</button>
						</form>
					{/if}
				</div>
			{/if}
		</div>
		<div class="profilepanels">
			{#if String(userProfile.role) != "company"}
				<div class="profilepanel">
					<h2>
						<Icon icon="mdi:tournament" />
						Tournaments Played
					</h2>
					<h1>{userProfile.tournamentsPlayed}</h1>
				</div>
				<div class="profilepanel">
					<h2>
						<Icon icon="mdi:prize" />
						Total Prize Won
					</h2>
					<h1>{userProfile.prizeWon}$</h1>
				</div>
				{#if userProfile.socials?.length > 0}
					<div class="profilepanel socialprofilepanel">
						<h2>
							<Icon icon="material-symbols:star" />
							Socials
						</h2>
						<h1>
							{#each userProfile.socials as { social, url }}
								<a
									href={url}
									target="_blank"
									use:tooltip={{
										content: capitalize(social),
										placement: "top",
										offset: 15
									}}
								>
									<Icon icon={getSocialIcon(social)} />
								</a>
							{/each}
						</h1>
					</div>
				{/if}
				<div class="profilepanel">
					<h2>
						<Icon icon="material-symbols:card-membership" />
						Joined On
					</h2>
					<h1>{dateFormat(userProfile.join_date)}</h1>
				</div>
				<div class="profilepanel">
					<h2>
						<Icon icon="mdi:arrow-up-bold" />
						Total XP
					</h2>
					<h1>{userProfile.xp}</h1>
				</div>
				<div class="profilepanel">
					<h2>
						<Icon icon="icon-park-solid:level" />
						Level
					</h2>
					<h1>{userProfile.level}</h1>
				</div>
			{:else}
				<div class="profilepanel">
					<h2>
						<Icon icon="material-symbols:card-membership" />
						Joined On
					</h2>
					<h1>{dateFormat(userProfile.join_date)}</h1>
				</div>
				{#if userProfile.socials?.length > 0}
					<div class="profilepanel socialprofilepanel">
						<h2>
							<Icon icon="material-symbols:star" />
							Socials
						</h2>
						<h1>
							{#each userProfile.socials as { social, url }}
								<a
									href={url}
									target="_blank"
									use:tooltip={{
										content: capitalize(social),
										placement: "top",
										offset: 15
									}}
								>
									<Icon icon={getSocialIcon(social)} />
								</a>
							{/each}
						</h1>
					</div>
				{/if}
				{#if userGames.length > 0}
					<div class="profilepanel gamespanel">
						<h2>
							<Icon icon="fluent:games-16-filled" />
							Games
						</h2>
						<div class="panelgames">
							{#each userGames as { id, game_name, game_cover }}
								<a href="/games/{id}">
									<img src="/{game_cover}" alt={game_name} />
									<p>{game_name}</p>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}
