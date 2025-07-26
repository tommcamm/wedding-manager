<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, setLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import Button from './Button.svelte';

	const { showAdminLink = true } = $props<{
		showAdminLink?: boolean;
	}>();

	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));
	const isInvite = $derived(page.url.pathname.startsWith('/invite'));

	// Get current locale
	const currentLocale = $derived(getLocale());

	// Handle language change
	function handleLanguageChange(event: Event) {
		event.preventDefault();
		const select = event.target as HTMLSelectElement;
		const newLocale = select.value;

		// Use Paraglide's setLocale function which handles URL navigation
		setLocale(newLocale as any);
	}
</script>

<header class="bg-white shadow">
	<div class="container mx-auto flex items-center justify-between px-4 py-4">
		<div>
			<a href="/" class="text-2xl font-bold text-blue-600">
				{m['homepage.sammytommy']()}
				<span class="ml-2 text-sm text-gray-500">June 2026</span>
			</a>
		</div>

		<nav>
			<ul class="flex items-center space-x-4">
				{#if isAdmin}
					<li>
						<a
							href="/admin"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname === '/admin'}
						>
							Dashboard
						</a>
					</li>
					<li>
						<a
							href="/admin/invites"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname.includes('/admin/invites')}
						>
							Invites
						</a>
					</li>
					<li>
						<a
							href="/admin/guests"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname.includes('/admin/guests')}
						>
							Guests
						</a>
					</li>
					<li>
						<a
							href="/admin/settings"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname.includes('/admin/settings')}
						>
							Settings
						</a>
					</li>
				{:else if isInvite}
					<li>
						<a
							href={page.url.pathname}
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={!page.url.pathname.includes('/rsvp') &&
								!page.url.pathname.includes('/dietary') &&
								!page.url.pathname.includes('/gifts') &&
								!page.url.pathname.includes('/notes')}
						>
							Invitation
						</a>
					</li>
					<li>
						<a
							href={`${page.url.pathname}/rsvp`}
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname.includes('/rsvp')}
						>
							RSVP
						</a>
					</li>
					<li>
						<a
							href={`${page.url.pathname}/dietary`}
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname.includes('/dietary')}
						>
							Dietary
						</a>
					</li>
					<li>
						<a
							href={`${page.url.pathname}/gifts`}
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname.includes('/gifts')}
						>
							Gifts
						</a>
					</li>
					<li>
						<a
							href={`${page.url.pathname}/notes`}
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
							class:text-blue-600={page.url.pathname.includes('/notes')}
						>
							Notes
						</a>
					</li>
				{:else if showAdminLink}
					<li>
						<a href="/admin/login" class="ml-4">
							<Button variant="outline" size="sm">Admin</Button>
						</a>
					</li>
				{/if}

				<li class="ml-4">
					<select
						class="rounded border border-gray-300 bg-gray-100 px-2 py-1 pr-8 text-xs text-gray-700"
						value={currentLocale}
						onchange={handleLanguageChange}
					>
						<option value="en">{m['common.english']()}</option>
						<option value="it">{m['common.italian']()}</option>
						<option value="zh">{m['common.chinese']()}</option>
					</select>
				</li>
			</ul>
		</nav>
	</div>
</header>
