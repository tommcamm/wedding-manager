<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);
	let email = $state(form?.email ?? '');
	let password = $state('');
	let rememberMe = $state(false);

	// Client-side validation state
	let emailError = $state('');
	let passwordError = $state('');

	// Validate email on blur
	function validateEmail() {
		if (!email) {
			emailError = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			emailError = 'Please enter a valid email address';
		} else {
			emailError = '';
		}
	}

	// Validate password on blur
	function validatePassword() {
		if (!password) {
			passwordError = 'Password is required';
		} else {
			passwordError = '';
		}
	}

	// Clear server errors when user starts typing
	function clearServerErrors() {
		// Note: form is readonly, so we can't modify it directly
		// The errors will be cleared on next form submission
	}
</script>

<svelte:head>
	<title>Admin Login - Wedding Manager</title>
</svelte:head>

<div class="mx-auto max-w-md">
	<h1 class="mb-6 text-center text-2xl font-bold">Admin Login</h1>

	<Card>
		<form
			method="POST"
			class="space-y-4"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<!-- Server-side error message -->
			{#if form?.message}
				<div class="rounded-md border border-red-200 bg-red-50 p-3">
					<p class="text-sm text-red-700">{form.message}</p>
				</div>
			{/if}

			<!-- Email field -->
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
					Email <span class="text-red-500">*</span>
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					bind:value={email}
					on:blur={validateEmail}
					on:input={clearServerErrors}
					class="w-full rounded-md border px-3 py-2 shadow-sm transition-colors focus:outline-none
						{emailError
						? 'border-red-300 focus:border-red-500 focus:ring-red-500'
						: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}"
					class:border-red-300={emailError}
					class:focus:border-red-500={emailError}
					class:focus:ring-red-500={emailError}
					disabled={isSubmitting}
				/>
				{#if emailError}
					<p class="mt-1 text-sm text-red-600">{emailError}</p>
				{:else if form?.errors?.email}
					<p class="mt-1 text-sm text-red-600">{form.errors.email[0]}</p>
				{/if}
			</div>

			<!-- Password field -->
			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-gray-700">
					Password <span class="text-red-500">*</span>
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					bind:value={password}
					on:blur={validatePassword}
					on:input={clearServerErrors}
					class="w-full rounded-md border px-3 py-2 shadow-sm transition-colors focus:outline-none
						{passwordError || form?.errors?.password
						? 'border-red-300 focus:border-red-500 focus:ring-red-500'
						: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}"
					disabled={isSubmitting}
				/>
				{#if passwordError}
					<p class="mt-1 text-sm text-red-600">{passwordError}</p>
				{:else if form?.errors?.password}
					<p class="mt-1 text-sm text-red-600">{form.errors.password[0]}</p>
				{/if}
			</div>

			<!-- Remember me checkbox -->
			<div class="flex items-center">
				<input
					id="rememberMe"
					name="rememberMe"
					type="checkbox"
					bind:checked={rememberMe}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					disabled={isSubmitting}
				/>
				<label for="rememberMe" class="ml-2 block text-sm text-gray-700">
					Remember me for 30 days
				</label>
			</div>

			<!-- Submit button -->
			<div class="w-full">
				<Button
					type="submit"
					disabled={isSubmitting || !!emailError || !!passwordError}
					class="w-full"
				>
					{#if isSubmitting}
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Signing in...
					{:else}
						Sign In
					{/if}
				</Button>
			</div>
		</form>
	</Card>

	<div class="mt-4 text-center">
		<a href="/" class="text-sm text-blue-600 hover:underline"> Return to Wedding Site </a>
	</div>
</div>

<style>
	/* Custom focus styles for better accessibility */
	input:focus {
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	input.border-red-300:focus {
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}
</style>
