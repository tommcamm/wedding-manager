<script lang="ts">
	import { page } from '$app/stores';
	import Button from './Button.svelte';
	
	const { showAdminLink = true } = $props<{
		showAdminLink?: boolean;
	}>();
	
	const isAdmin = $derived($page.url.pathname.startsWith('/admin'));
	const isInvite = $derived($page.url.pathname.startsWith('/invite'));
</script>

<header class="bg-white shadow">
	<div class="container mx-auto px-4 py-4 flex items-center justify-between">
		<div>
			<a href="/" class="text-2xl font-bold text-blue-600">
				Tommy & Sammy
				<span class="text-sm text-gray-500 ml-2">June 2026</span>
			</a>
		</div>
		
		<nav>
			<ul class="flex space-x-4 items-center">
				{#if isAdmin}
					<li>
						<a 
							href="/admin" 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname === '/admin'}
						>
							Dashboard
						</a>
					</li>
					<li>
						<a 
							href="/admin/invites" 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname.includes('/admin/invites')}
						>
							Invites
						</a>
					</li>
					<li>
						<a 
							href="/admin/guests" 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname.includes('/admin/guests')}
						>
							Guests
						</a>
					</li>
					<li>
						<a 
							href="/admin/settings" 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname.includes('/admin/settings')}
						>
							Settings
						</a>
					</li>
				{:else if isInvite}
					<li>
						<a 
							href={$page.url.pathname} 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={!$page.url.pathname.includes('/rsvp') && 
													!$page.url.pathname.includes('/dietary') && 
													!$page.url.pathname.includes('/gifts') && 
													!$page.url.pathname.includes('/notes')}
						>
							Invitation
						</a>
					</li>
					<li>
						<a 
							href={`${$page.url.pathname}/rsvp`} 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname.includes('/rsvp')}
						>
							RSVP
						</a>
					</li>
					<li>
						<a 
							href={`${$page.url.pathname}/dietary`} 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname.includes('/dietary')}
						>
							Dietary
						</a>
					</li>
					<li>
						<a 
							href={`${$page.url.pathname}/gifts`} 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname.includes('/gifts')}
						>
							Gifts
						</a>
					</li>
					<li>
						<a 
							href={`${$page.url.pathname}/notes`} 
							class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname.includes('/notes')}
						>
							Notes
						</a>
					</li>
				{:else}
					{#if showAdminLink}
						<li>
							<a href="/admin/login" class="ml-4">
								<Button variant="outline" size="sm">Admin Login</Button>
							</a>
						</li>
					{/if}
				{/if}
				
				<!-- Language Selector Placeholder -->
				<li class="ml-4">
					<select class="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded text-xs">
						<option value="en">English</option>
						<option value="it">Italiano</option>
						<option value="zh">中文</option>
					</select>
				</li>
			</ul>
		</nav>
	</div>
</header>
