<script lang="ts">
	import Icon from "@iconify/svelte"
	import { enhance } from "$app/forms"
	import { goto } from "$app/navigation"
	import { navigating } from "$app/stores"

	let passwordType: string = "password"

	function passwordToggle() {
		if (passwordType == "password") {
			passwordType = "text"
		} else {
			passwordType = "password"
		}
	}

	let pathname: string

	$: if ($navigating) {
		//@ts-ignore
		pathname = $navigating?.from?.url.pathname
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
			<p>Please enter your login infomation below.</p>
			<form use:enhance method="POST">
				<div class="inputwrapper">
					<Icon icon="ph:user" />
					<input
						type="text"
						name="username"
						placeholder="johndoe"
						required
						minlength="3"
						maxlength="15"
					/>
				</div>
				<div class="inputwrapper">
					<Icon icon="material-symbols:lock-outline" />
					<input
						type={passwordType}
						name="password"
						placeholder="At least 5 characters"
						required
						minlength="5"
						maxlength="30"
					/>
					<button on:click|preventDefault={passwordToggle}>
						<Icon icon="ph:eye" />
					</button>
				</div>
				<a href="/forgot-password">Forgot password?</a>
				<div class="buttons">
					{#if pathname}
						<button class="registration" on:click|preventDefault={() => goto(pathname)}>Back</button
						>
					{:else}
						<button class="registration" on:click|preventDefault={() => goto("/")}>Back</button>
					{/if}
					<button class="registration" type="submit">Login</button>
				</div>
			</form>
			<span>Don't have an account? <a href="/signup">Sign Up</a></span>
		</div>
	</div>
</div>
