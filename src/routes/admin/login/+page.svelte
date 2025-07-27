<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { authClient } from '$lib/auth-client';

	let email = '';
	let password = '';
	let rememberMe = false;
</script>

<div class="mx-auto max-w-md">
	<h1 class="mb-6 text-center text-2xl font-bold">Admin Login</h1>

	<Card>
		<form
			class="space-y-4"
			on:submit|preventDefault={async () => {
				console.log('Logging in with:', email, password);
				const results = await authClient.signIn.email({
					email,
					password,
					rememberMe
				});
			}}
		>
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-gray-700"> Email </label>
				<input
					id="email"
					type="text"
					placeholder="pippo"
					bind:value={email}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					id="password"
					type="password"
					placeholder="********"
					bind:value={password}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="flex items-center">
				<input
					id="remember-me"
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					bind:checked={rememberMe}
				/>
				<label for="remember-me" class="ml-2 block text-sm text-gray-700"> Remember me </label>
			</div>

			<div class="w-full">
				<Button type="submit">
					{'Log In'}
				</Button>
			</div>
		</form>
	</Card>

	<div class="mt-4 text-center">
		<a href="/" class="text-sm text-blue-600 hover:underline"> Return to Wedding Site </a>
	</div>
</div>
