<script lang="ts">
	import Icon from "@iconify/svelte"
	import type { ActionData } from "./$types"
	import { enhance } from "$app/forms"
	import { goto } from "$app/navigation"

	export let form: ActionData
	let loading: boolean = false

	let passwordType: string = "password"
	let errorString: string

	function passwordToggle() {
		if (passwordType == "password") {
			passwordType = "text"
		} else {
			passwordType = "password"
		}
	}

	$: if (form?.missing) {
		errorString = form.missing.join(", ")
	}

	function loginSuccess() {
		loading = true
	}

	$: if (form) {
		loading = false
	}
</script>

<svelte:head>
	<title>TourneyJam - Login</title>
</svelte:head>

<div class="loginc">
	<div class="loginleft">
		<img src="/logo.svg" alt="TourneyJam" draggable="false" />
	</div>
	<div class="loginright">
		<div class="loginwrap">
			<h1>Welcome back!</h1>
			<p>Please enter your login information below.</p>
			<form use:enhance method="POST" on:submit={loginSuccess}>
				<div class="inputwrapper">
					<Icon icon="ph:user" />
					<input type="text" name="username" placeholder="johndoe" minlength="3" maxlength="15" />
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
				<a href="/forgot-password">Forgot password?</a>
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
							Login
						{/if}
					</button>
				</div>
			</form>
			<span>Don't have an account? <a href="/signup">Sign Up</a></span>
		</div>
	</div>
</div>
