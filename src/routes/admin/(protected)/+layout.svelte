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
	
	let { children } = $props();
</script>

{#if isLoginPage || !$auth.isAuthenticated}
	<!-- Login page has its own layout -->
	{@render children()}
{:else}
	<!-- Admin dashboard layout -->
	<div class="flex">
		<!-- Sidebar -->
		<aside class="w-64 min-h-screen bg-gray-800 text-white">
			<div class="p-4 border-b border-gray-700">
				<h2 class="text-xl font-bold">Wedding Admin</h2>
				{#if $auth.user}
					<p class="text-sm text-gray-400 mt-1">{$auth.user.name}</p>
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
			
			<div class="absolute bottom-0 w-64 p-4 border-t border-gray-700">
				<Button variant="outline" size="sm" on:click={() => auth.logout()}>
					Logout
				</Button>
				<a href="/" class="block text-sm text-gray-400 mt-2 hover:text-white">
					View Wedding Site
				</a>
			</div>
		</aside>
		
		<!-- Main content -->
		<div class="flex-1 min-h-screen bg-gray-100">
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
