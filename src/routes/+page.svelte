<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import settingsStore from '$lib/stores/mockSettings';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';

	// Subscribe to settings store
	const settings = settingsStore;

	// Format wedding date
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	};

	// Invitation code
	let inviteCode = $state('');
	let codeError = $state('');

	function submitInviteCode(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		if (!inviteCode.trim()) {
			codeError = m['homepage.invitation_code_error']();
			return;
		}

		goto(`/invite/${inviteCode.toUpperCase()}`);
	}
</script>

<div class="space-y-8">
	<section class="py-8 text-center">
		<h1 class="mb-4 text-4xl font-bold text-blue-600">{m['homepage.sammytommy']()}</h1>
		<p class="mb-2 text-xl">{m['homepage.getting_married_on']()}</p>
		<p class="mb-6 text-2xl font-semibold">{formatDate($settings.wedding.date)}</p>
	</section>

	<Card title={m['homepage.view_invitation']()} class="mx-auto max-w-md">
		<form onsubmit={submitInviteCode} class="space-y-4">
			<div>
				<label for="invite-code" class="mb-1 block text-sm font-medium text-gray-700">
					{m['homepage.invitation_code_label']()}
				</label>
				<input
					id="invite-code"
					type="text"
					placeholder={m['common.code']()}
					bind:value={inviteCode}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
				{#if codeError}
					<p class="mt-1 text-sm text-red-600">{codeError}</p>
				{/if}
			</div>

			<div class="flex justify-end">
				<Button type="submit">{m['common.login']()}</Button>
			</div>
		</form>
	</Card>

	<!-- Additional Information -->
	<section class="mt-12 grid gap-8 md:grid-cols-2">
		<Card title={m['homepage.about_wedding_title']()}>
			<p class="text-gray-700">
				{m['homepage.about_wedding_description']()}
			</p>
		</Card>
		<Card title={m['homepage.questions_title']()}>
			<p class="mb-4 text-gray-700">
				{m['homepage.questions_description']()}
			</p>
			<p class="font-medium">
				Email: <a href="mailto:wedding@cammware.com" class="text-blue-600 hover:underline"
					>wedding@cammware.com</a
				>
			</p>
		</Card>
	</section>
</div>

<div style="display: none;">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
