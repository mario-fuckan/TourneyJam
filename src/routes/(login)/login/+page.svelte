<script lang="ts">
	import { enhance } from "$app/forms"
	import { goto } from "$app/navigation"
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
				<input type="text" name="username" placeholder="johndoe" required />
				<input type="password" name="password" placeholder="At least 8 characters" required />
				<a href="/forgot-password">Forgot password?</a>
				<button type="submit">Login</button>
			</form>
			<span>Don't have an account? <a href="/signup">Sign Up</a></span>
		</div>
	</div>
</div>
