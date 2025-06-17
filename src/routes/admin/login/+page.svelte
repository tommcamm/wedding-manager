<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import authStore from '$lib/stores/authStore';
	
	// Form fields
	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	
	// Auth state
	const auth = authStore;
	
	async function handleSubmit() {
		if (!email || !password) {
			return;
		}
		
		const success = await auth.login(email, password);
		
		if (success) {
			// Redirect to admin dashboard
			goto('/admin');
		}
	}
</script>

<div class="max-w-md mx-auto">
	<h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
	
	{#if $auth.error}
		<NotificationBanner 
			type="error" 
			message={$auth.error} 
			showDismiss={true} 
		/>
	{/if}
	
	<Card>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					placeholder="admin@example.com"
					bind:value={email}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
					Password
				</label>
				<input
					id="password"
					type="password"
					placeholder="********"
					bind:value={password}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				/>
				<p class="text-xs text-gray-500 mt-1">
					Demo credentials: admin@example.com / password
				</p>
			</div>
			
			<div class="flex items-center">
				<input
					id="remember-me"
					type="checkbox"
					bind:checked={rememberMe}
					class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
				/>
				<label for="remember-me" class="ml-2 block text-sm text-gray-700">
					Remember me
				</label>
			</div>
			
			<div class="w-full">
				<Button type="submit" disabled={$auth.isLoading}>
					{$auth.isLoading ? 'Logging in...' : 'Log In'}
				</Button>
			</div>
		</form>
	</Card>
	
	<div class="mt-4 text-center">
		<a href="/" class="text-sm text-blue-600 hover:underline">
			Return to Wedding Site
		</a>
	</div>
</div>
