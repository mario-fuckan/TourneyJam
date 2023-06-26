<script lang="ts">
	import Icon from "@iconify/svelte"
	import { enhance } from "$app/forms"
	import { goto } from "$app/navigation"
	import type { ActionData } from "./$types"

	export let form: ActionData

	let passwordType: string = "password"
	let loading: boolean = false

	function passwordToggle() {
		if (passwordType == "password") {
			passwordType = "text"
		} else {
			passwordType = "password"
		}
	}

	let errorString: string

	$: if (form?.missing) {
		errorString = form.missing.join(", ")
	}

	let selectedImage: string = "picture_0"

	function registerSuccess() {
		loading = true
	}

	$: if (form) {
		loading = false
	}
</script>

<svelte:head>
	<title>TourneyJam - Sign Up</title>

	{#each { length: 8 } as placeholder, i}
		<link rel="preload" as="image" href={"/profile_pictures/picture_" + i + ".png"} />
	{/each}
</svelte:head>

<div class="loginc">
	<div class="loginleft">
		<img src="/logo.svg" alt="TourneyJam" draggable="false" />
	</div>
	<div class="loginright">
		<div class="loginwrap">
			<h1>Create your account</h1>
			<p>Please enter your information below.</p>
			<form use:enhance method="POST" on:submit={registerSuccess}>
				<div class="inputwrapper">
					<Icon icon="ph:user" />
					<input type="text" name="username" placeholder="johndoe" minlength="3" maxlength="15" />
				</div>
				<div class="inputwrapper">
					<Icon icon="ic:outline-email" />
					<input
						type="email"
						name="email"
						placeholder="johndoe@email.com"
						minlength="3"
						maxlength="50"
					/>
				</div>
				<div class="inputwrapper">
					<Icon icon="material-symbols:lock-outline" />
					<input
						type={passwordType}
						name="password"
						placeholder="At least 5 characters"
						minlength="5"
						maxlength="30"
					/>
					<button on:click|preventDefault={passwordToggle}>
						<Icon icon="ph:eye" />
					</button>
				</div>
				<div class="choosepicture">
					<h1>Choose your profile picture</h1>
					<p>You can always change your profile picture or upload your own later.</p>
					<div class="pictures">
						{#each { length: 8 } as placeholder, i}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<img
								class:selectedimage={selectedImage == "picture_" + i}
								src={"/profile_pictures/picture_" + i + ".png"}
								alt="Profile Icon"
								on:click={() => (selectedImage = "picture_" + i)}
								draggable="false"
							/>
						{/each}
					</div>
				</div>
				<input name="profile_picture" type="text" value={selectedImage} hidden />
				{#if form?.missing}
					<div class="formerrors">
						<p>Missing fields: {errorString}</p>
					</div>
				{:else if form?.message}
					<div class="formerrors">
						<p>Error: {form.message}</p>
					</div>
				{/if}
				<div class="buttons">
					<button class="registration" on:click|preventDefault={() => goto("/")}>Back</button>
					<button class="registration" type="submit">
						{#if loading}
							<div class="loadingbutton">
								<div class="sk-chase">
									<div class="sk-chase-dot" />
									<div class="sk-chase-dot" />
									<div class="sk-chase-dot" />
									<div class="sk-chase-dot" />
									<div class="sk-chase-dot" />
									<div class="sk-chase-dot" />
								</div>
							</div>
						{:else}
							Sign Up
						{/if}
					</button>
				</div>
			</form>
			<span>Already have an account? <a href="/login">Login</a></span>
		</div>
	</div>
</div>
