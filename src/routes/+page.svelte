<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import settingsStore from '$lib/stores/mockSettings';
	
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
	
	function submitInviteCode() {
		if (!inviteCode.trim()) {
			codeError = 'Please enter your invitation code';
			return;
		}
		
		// In a real app, we would validate this against the database
		// For now, navigate to the invite page with the code
		goto(`/invite/${inviteCode.toUpperCase()}`);
	}
</script>

<div class="space-y-8">
	<!-- Wedding Countdown Banner -->
	<NotificationBanner
		type="info"
		message="We can't wait to celebrate with you on our special day!"
		showDismiss={false}
	/>
	
	<!-- Wedding Information -->
	<section class="text-center py-8">
		<h1 class="text-4xl font-bold mb-4 text-blue-600">Tommy & Sammy</h1>
		<p class="text-xl mb-2">are getting married on</p>
		<p class="text-2xl font-semibold mb-6">{formatDate($settings.wedding.date)}</p>
		<p class="text-lg mb-8">
			{$settings.wedding.timeStart} - {$settings.wedding.timeEnd}<br>
			{$settings.wedding.venue}<br>
			{$settings.wedding.address}
		</p>
	</section>
	
	<!-- Invitation Code Form -->
	<Card title="Enter Your Invitation Code" class="max-w-md mx-auto">
		<form on:submit|preventDefault={submitInviteCode} class="space-y-4">
			<div>
				<label for="invite-code" class="block text-sm font-medium text-gray-700 mb-1">
					Invitation Code
				</label>
				<input
					id="invite-code"
					type="text"
					placeholder="Enter the 5-character code from your invitation"
					bind:value={inviteCode}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				/>
				{#if codeError}
					<p class="mt-1 text-sm text-red-600">{codeError}</p>
				{/if}
			</div>
			
			<div class="flex justify-end">
				<Button type="submit">View Invitation</Button>
			</div>
		</form>
	</Card>
	
	<!-- Additional Information -->
	<section class="grid md:grid-cols-2 gap-8 mt-12">
		<Card title="About Our Wedding">
			<p class="text-gray-700">
				Join us for an unforgettable celebration of love and commitment. Our wedding will feature a beautiful ceremony, 
				followed by dinner, dancing, and memories to last a lifetime.
			</p>
		</Card>
		
		<Card title="Questions?">
			<p class="text-gray-700 mb-4">
				If you have any questions or need assistance with your RSVP, please don't hesitate to contact us.
			</p>
			<p class="font-medium">
				Email: <a href="mailto:wedding@example.com" class="text-blue-600 hover:underline">wedding@example.com</a>
			</p>
		</Card>
	</section>
</div>
