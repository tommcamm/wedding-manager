<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import invitesStore from '$lib/stores/mockInvites';
	import guestsStore from '$lib/stores/mockGuests';
	import settingsStore from '$lib/stores/mockSettings';
	
	// Summary stats
	const totalInvites = $derived($invitesStore.length);
	const lockedInvites = $derived($invitesStore.filter(invite => invite.locked).length);
	
	const totalGuests = $derived($guestsStore.length);
	const acceptedGuests = $derived($guestsStore.filter(guest => guest.attending === true).length);
	const declinedGuests = $derived($guestsStore.filter(guest => guest.attending === false).length);
	const pendingGuests = $derived($guestsStore.filter(guest => guest.attending === null).length);
	
	// Helper functions
	function percentOf(value: number, total: number): string {
		if (total === 0) return '0%';
		return `${Math.round((value / total) * 100)}%`;
	}
	
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		}).format(date);
	}
	
	// Calculate days remaining
	const weddingDate = $derived($settingsStore.wedding.date);
	const today = new Date();
	const daysToWedding = $derived(
		Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
	);
	
	const rsvpDeadline = $derived($settingsStore.rsvp.deadline);
	const daysToRsvpDeadline = $derived(
		Math.ceil((rsvpDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
	);
</script>

<div class="space-y-8">
	<!-- Key Metrics -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<Card>
			<div class="text-center">
				<h3 class="text-lg font-medium text-gray-500">Days Until Wedding</h3>
				<p class="mt-2 text-3xl font-bold text-blue-600">{daysToWedding}</p>
				<p class="mt-1 text-sm text-gray-500">{formatDate(weddingDate)}</p>
			</div>
		</Card>
		
		<Card>
			<div class="text-center">
				<h3 class="text-lg font-medium text-gray-500">RSVP Deadline</h3>
				<p class="mt-2 text-3xl font-bold text-blue-600">{daysToRsvpDeadline}</p>
				<p class="mt-1 text-sm text-gray-500">days remaining</p>
			</div>
		</Card>
		
		<Card>
			<div class="text-center">
				<h3 class="text-lg font-medium text-gray-500">Total Invitations</h3>
				<p class="mt-2 text-3xl font-bold text-blue-600">{totalInvites}</p>
				<p class="mt-1 text-sm text-gray-500">
					{lockedInvites} locked / {totalInvites - lockedInvites} active
				</p>
			</div>
		</Card>
		
		<Card>
			<div class="text-center">
				<h3 class="text-lg font-medium text-gray-500">Guest Count</h3>
				<p class="mt-2 text-3xl font-bold text-blue-600">{totalGuests}</p>
				<p class="mt-1 text-sm text-gray-500">
					{acceptedGuests} confirmed / {declinedGuests} declined
				</p>
			</div>
		</Card>
	</div>
	
	<!-- RSVP Status -->
	<Card title="RSVP Status">
		<div class="space-y-4">
			<div class="flex items-center">
				<div class="w-full bg-gray-200 rounded-full h-4">
					<div
						class="bg-green-500 h-4 rounded-full"
						style="width: {percentOf(acceptedGuests, totalGuests)}"
					></div>
				</div>
				<span class="ml-2 text-sm font-medium text-gray-700">
					{acceptedGuests} ({percentOf(acceptedGuests, totalGuests)})
				</span>
			</div>
			
			<div class="flex items-center">
				<div class="w-full bg-gray-200 rounded-full h-4">
					<div
						class="bg-red-500 h-4 rounded-full"
						style="width: {percentOf(declinedGuests, totalGuests)}"
					></div>
				</div>
				<span class="ml-2 text-sm font-medium text-gray-700">
					{declinedGuests} ({percentOf(declinedGuests, totalGuests)})
				</span>
			</div>
			
			<div class="flex items-center">
				<div class="w-full bg-gray-200 rounded-full h-4">
					<div
						class="bg-gray-400 h-4 rounded-full"
						style="width: {percentOf(pendingGuests, totalGuests)}"
					></div>
				</div>
				<span class="ml-2 text-sm font-medium text-gray-700">
					{pendingGuests} ({percentOf(pendingGuests, totalGuests)})
				</span>
			</div>
			
			<div class="flex justify-between text-sm text-gray-600 mt-2">
				<span>Accepted</span>
				<span>Declined</span>
				<span>Pending</span>
			</div>
		</div>
	</Card>
	
	<!-- Quick Actions -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<Card title="Quick Actions">
			<div class="space-y-3">
				<div>
					<a href="/admin/invites">
						<Button>Manage Invitations</Button>
					</a>
				</div>
				<div>
					<a href="/admin/guests">
						<Button>View Guest List</Button>
					</a>
				</div>
				<div>
					<a href="/admin/communications">
						<Button>Send Emails</Button>
					</a>
				</div>
			</div>
		</Card>
		
		<Card title="Recent Activity">
			<div class="space-y-3">
				<p class="text-gray-700 text-sm italic">
					This would show recent RSVPs and system activity in a production version.
				</p>
				
				<ul class="space-y-2">
					<li class="text-sm text-gray-700 border-l-2 border-blue-500 pl-2">
						<span class="font-medium">John Smith</span> confirmed attendance
						<span class="text-gray-500">2 hours ago</span>
					</li>
					<li class="text-sm text-gray-700 border-l-2 border-red-500 pl-2">
						<span class="font-medium">Giulia Rossi</span> declined invitation
						<span class="text-gray-500">yesterday</span>
					</li>
					<li class="text-sm text-gray-700 border-l-2 border-green-500 pl-2">
						<span class="font-medium">Admin</span> updated RSVP deadline
						<span class="text-gray-500">2 days ago</span>
					</li>
				</ul>
			</div>
		</Card>
	</div>
</div>
