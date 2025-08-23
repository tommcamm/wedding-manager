<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import authStore from '$lib/stores/authStore';

	// Auth state
	const auth = authStore;

	// Check if we're on the login page
	const isLoginPage = $derived($page.url.pathname === '/admin/login');

	let { children, data } = $props();
</script>

{#if isLoginPage || !$auth.isAuthenticated}
	<!-- Login page has its own layout -->
	{@render children()}
{:else}
	<!-- Admin dashboard layout -->
	<div class="flex">
		<!-- Sidebar -->
		<aside class="min-h-screen w-64 bg-gray-800 text-white">
			<div class="border-b border-gray-700 p-4">
				<h2 class="text-xl font-bold">Wedding Admin</h2>
				{#if $auth.user}
					<p class="mt-1 text-sm text-gray-400">{$auth.user.name}</p>
				{/if}
			</div>

			<nav class="mt-4">
				<ul class="space-y-1">
					<li>
						<a
							href="/admin"
							class="block px-4 py-2 hover:bg-gray-700"
							class:bg-gray-700={$page.url.pathname === '/admin'}
						>
							Dashboard
						</a>
					</li>
					<li>
						<a
							href="/admin/invites"
							class="block px-4 py-2 hover:bg-gray-700"
							class:bg-gray-700={$page.url.pathname.includes('/admin/invites')}
						>
							Invitations
						</a>
					</li>
					<li>
						<a
							href="/admin/guests"
							class="block px-4 py-2 hover:bg-gray-700"
							class:bg-gray-700={$page.url.pathname.includes('/admin/guests')}
						>
							Guest List
						</a>
					</li>
					<li>
						<a
							href="/admin/communications"
							class="block px-4 py-2 hover:bg-gray-700"
							class:bg-gray-700={$page.url.pathname.includes('/admin/communications')}
						>
							Communications
						</a>
					</li>
					<li>
						<a
							href="/admin/reports"
							class="block px-4 py-2 hover:bg-gray-700"
							class:bg-gray-700={$page.url.pathname.includes('/admin/reports')}
						>
							Reports
						</a>
					</li>
					<li>
						<a
							href="/admin/settings"
							class="block px-4 py-2 hover:bg-gray-700"
							class:bg-gray-700={$page.url.pathname.includes('/admin/settings')}
						>
							Settings
						</a>
					</li>
				</ul>
			</nav>

			<div class="absolute bottom-0 w-64 border-t border-gray-700 p-4">
				<Button variant="outline" size="sm" on:click={() => auth.logout()}>Logout</Button>
				<a href="/" class="mt-2 block text-sm text-gray-400 hover:text-white">
					View Wedding Site
				</a>
			</div>
		</aside>

		<!-- Main content -->
		<div class="min-h-screen flex-1 bg-gray-100">
			{#if data?.previewMode}
				<!-- Preview mode notification -->
				<div class="bg-orange-500 px-6 py-2 text-white">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="font-medium">Preview Mode Active</span>
						</div>
						<span class="text-sm">Public users see "Work in Progress" page</span>
					</div>
				</div>
			{/if}

			<header class="bg-white shadow">
				<div class="px-6 py-4">
					<h1 class="text-2xl font-bold text-gray-800">
						{#if $page.url.pathname === '/admin'}
							Dashboard
						{:else if $page.url.pathname.includes('/admin/invites')}
							Invitation Management
						{:else if $page.url.pathname.includes('/admin/guests')}
							Guest List
						{:else if $page.url.pathname.includes('/admin/communications')}
							Communications
						{:else if $page.url.pathname.includes('/admin/reports')}
							Reports & Exports
						{:else if $page.url.pathname.includes('/admin/settings')}
							System Settings
						{:else}
							Admin Panel
						{/if}
					</h1>
				</div>
			</header>

			<main class="container mx-auto px-6 py-8">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
