<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import guestsStore from '$lib/stores/mockGuests';
	import invitesStore from '$lib/stores/mockInvites';
	import settingsStore from '$lib/stores/mockSettings';
	
	// Local state
	let showSuccessMessage = false;
	let successMessage = '';
	let selectedTab: 'send' | 'history' | 'templates' = 'send';
	
	// New email form
	let emailType: 'invitation' | 'reminder' | 'custom' = 'reminder';
	let emailSubject = 'Wedding RSVP Reminder';
	let emailContent = '';
	let selectedInviteIds: string[] = [];
	let filterStatus: 'all' | 'pending' | 'attending' | 'declined' = 'pending';
	
	// History data (mock)
	const emailHistory = [
		{
			id: '1',
			type: 'invitation',
			subject: 'Wedding Invitation',
			sentDate: new Date('2025-01-20'),
			recipients: 4,
			sender: 'Admin'
		},
		{
			id: '2',
			type: 'reminder',
			subject: 'RSVP Reminder',
			sentDate: new Date('2025-02-15'),
			recipients: 2,
			sender: 'Admin'
		},
		{
			id: '3',
			type: 'custom',
			subject: 'Wedding Details Update',
			sentDate: new Date('2025-03-01'),
			recipients: 4,
			sender: 'Admin'
		}
	];
	
	// Load template based on type
	$: {
		if (emailType === 'invitation') {
			emailContent = $settingsStore?.email?.templates?.invitation || '';
			emailSubject = 'Your Wedding Invitation';
		} else if (emailType === 'reminder') {
			emailContent = $settingsStore?.email?.templates?.reminder || '';
			emailSubject = 'Wedding RSVP Reminder';
		} else {
			// For custom emails, keep existing content
		}
	}
	
	// Filtered invitations based on RSVP status
	$: filteredInvites = $invitesStore.filter(invite => {
		if (filterStatus === 'all') return true;
		
		// Get all guests for this invite
		const guests = $guestsStore.filter(g => g.inviteId === invite.id);
		
		if (filterStatus === 'pending') {
			// At least one guest is pending
			return guests.some(g => g.attending === null);
		} else if (filterStatus === 'attending') {
			// At least one guest is attending
			return guests.some(g => g.attending === true);
		} else if (filterStatus === 'declined') {
			// All guests have declined
			return guests.length > 0 && guests.every(g => g.attending === false);
		}
		
		return true;
	});
	
	// Format date for display
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}
	
	// Toggle selection of an invite
	function toggleInviteSelection(id: string) {
		if (selectedInviteIds.includes(id)) {
			selectedInviteIds = selectedInviteIds.filter(i => i !== id);
		} else {
			selectedInviteIds = [...selectedInviteIds, id];
		}
	}
	
	// Select all filtered invites
	function selectAllInvites() {
		selectedInviteIds = filteredInvites.map(invite => invite.id);
	}
	
	// Clear all selections
	function clearSelection() {
		selectedInviteIds = [];
	}
	
	// Send email (mock functionality)
	function sendEmail() {
		if (selectedInviteIds.length === 0) {
			alert('Please select at least one recipient');
			return;
		}
		
		if (!emailSubject || !emailContent) {
			alert('Please provide a subject and content for your email');
			return;
		}
		
		// Mock sending email
		successMessage = `Email sent to ${selectedInviteIds.length} invitations`;
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
		
		// Reset form
		selectedInviteIds = [];
	}
	
	// Save template (mock functionality)
	function saveTemplate() {
		if (!emailContent) {
			alert('Please provide content for the template');
			return;
		}
		
		// Mock saving template
		if (emailType === 'invitation') {
			settingsStore.updateSection('email', {
				templates: {
					...$settingsStore?.email?.templates || {},
					invitation: emailContent
				}
			});
		} else if (emailType === 'reminder') {
			settingsStore.updateSection('email', {
				templates: {
					...$settingsStore?.email?.templates || {},
					reminder: emailContent
				}
			});
		}
		
		successMessage = `${emailType.charAt(0).toUpperCase() + emailType.slice(1)} template saved`;
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
	}
	
	// Get recipient count
	function getRecipientCount(): number {
		const uniqueEmails = new Set();
		
		selectedInviteIds.forEach(id => {
			const invite = $invitesStore.find(i => i.id === id);
			if (invite) {
				uniqueEmails.add(invite.email);
			}
		});
		
		return uniqueEmails.size;
	}
</script>

<div class="space-y-6">
	{#if showSuccessMessage}
		<NotificationBanner type="success" message={successMessage} />
	{/if}
	
	<!-- Tabs -->
	<div class="border-b border-gray-200">
		<nav class="flex -mb-px">
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {selectedTab === 'send' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => selectedTab = 'send'}
			>
				Send Email
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {selectedTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => selectedTab = 'history'}
			>
				Email History
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {selectedTab === 'templates' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => selectedTab = 'templates'}
			>
				Email Templates
			</button>
		</nav>
	</div>
	
	<!-- Send Email Tab -->
	{#if selectedTab === 'send'}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Recipients selection -->
			<div class="lg:col-span-1">
				<Card title="Select Recipients">
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700">Filter by Status</label>
							<select
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={filterStatus}
							>
								<option value="all">All Invitations</option>
								<option value="pending">Pending RSVPs</option>
								<option value="attending">Confirmed Attending</option>
								<option value="declined">Declined</option>
							</select>
						</div>
						
						<div class="flex justify-between">
							<Button size="sm" on:click={selectAllInvites}>Select All</Button>
							<Button size="sm" variant="outline" on:click={clearSelection}>Clear</Button>
						</div>
						
						<div class="border rounded-md max-h-96 overflow-y-auto">
							{#if filteredInvites.length === 0}
								<p class="text-gray-500 italic p-4">No invitations match the selected filter.</p>
							{:else}
								<ul class="divide-y">
									{#each filteredInvites as invite}
										<li class="p-3">
											<label class="flex items-start">
												<input 
													type="checkbox" 
													class="mt-0.5"
													checked={selectedInviteIds.includes(invite.id)}
													on:change={() => toggleInviteSelection(invite.id)}
												/>
												<span class="ml-2">
													<span class="block font-medium">{invite.familyName}</span>
													<span class="block text-sm text-gray-500">{invite.email}</span>
													<span class="block text-xs text-gray-400">Code: {invite.code}</span>
												</span>
											</label>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						
						<div class="text-sm text-gray-600">
							{#if selectedInviteIds.length > 0}
								Selected {selectedInviteIds.length} invitation(s) with {getRecipientCount()} unique email(s)
							{:else}
								No recipients selected
							{/if}
						</div>
					</div>
				</Card>
			</div>
			
			<!-- Email composition -->
			<div class="lg:col-span-2">
				<Card title="Compose Email">
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700">Email Type</label>
							<select
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={emailType}
							>
								<option value="invitation">Invitation</option>
								<option value="reminder">RSVP Reminder</option>
								<option value="custom">Custom Email</option>
							</select>
							<p class="mt-1 text-xs text-gray-500">
								Select a template or create a custom email
							</p>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Subject</label>
							<input 
								type="text" 
								required
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={emailSubject}
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Content</label>
							<textarea
								required
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								rows="10"
								bind:value={emailContent}
							></textarea>
							<p class="mt-1 text-xs text-gray-500">
								You can use placeholders like {'{name}'}, {'{code}'}, and {'{rsvp_link}'} which will be replaced with actual values
							</p>
						</div>
						
						<div class="flex justify-end">
							<Button on:click={sendEmail}>
								Send Email
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</div>
	{/if}
	
	<!-- Email History Tab -->
	{#if selectedTab === 'history'}
		<Card title="Email History">
			{#if emailHistory.length === 0}
				<p class="text-gray-500 italic py-4">No emails have been sent yet.</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead>
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent By</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each emailHistory as email}
								<tr class="hover:bg-gray-50">
									<td class="px-4 py-3 whitespace-nowrap">{formatDate(email.sentDate)}</td>
									<td class="px-4 py-3 whitespace-nowrap">
										<span class="capitalize">{email.type}</span>
									</td>
									<td class="px-4 py-3">{email.subject}</td>
									<td class="px-4 py-3 whitespace-nowrap">{email.recipients}</td>
									<td class="px-4 py-3 whitespace-nowrap">{email.sender}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				
				<div class="mt-4 text-sm text-gray-500 italic">
					<p>In a production version, this would show a complete history of all sent emails with additional details and filtering options.</p>
				</div>
			{/if}
		</Card>
	{/if}
	
	<!-- Email Templates Tab -->
	{#if selectedTab === 'templates'}
		<Card title="Email Templates">
			<div class="space-y-6">
				<div>
					<label class="block text-sm font-medium text-gray-700">Template Type</label>
					<select
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						bind:value={emailType}
					>
						<option value="invitation">Invitation</option>
						<option value="reminder">RSVP Reminder</option>
					</select>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700">Template Content</label>
					<textarea
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						rows="10"
						bind:value={emailContent}
					></textarea>
					<p class="mt-1 text-xs text-gray-500">
						Available placeholders:
						<br />
						{'{name}'} - Recipient's name
						<br />
						{'{code}'} - Invitation code
						<br />
						{'{rsvp_link}'} - Link to RSVP page
						<br />
						{'{wedding_date}'} - Wedding date
						<br />
						{'{wedding_venue}'} - Wedding venue
						<br />
						{'{rsvp_deadline}'} - RSVP deadline
					</p>
				</div>
				
				<div class="flex justify-end">
					<Button on:click={saveTemplate}>
						Save Template
					</Button>
				</div>
				
				<div class="border-t pt-4 mt-4">
					<h3 class="text-base font-medium text-gray-700 mb-2">Email Preview</h3>
					<Card>
						<div class="prose max-w-none">
							<p class="whitespace-pre-line">{emailContent}</p>
						</div>
					</Card>
					<p class="mt-2 text-xs text-gray-500">
						This is a simplified preview. In a production version, placeholders would be replaced with sample values.
					</p>
				</div>
			</div>
		</Card>
	{/if}
</div>
