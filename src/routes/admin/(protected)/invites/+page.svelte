<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import invitesStore, { type Invite } from '$lib/stores/mockInvites';
	
	// Local state
	let searchQuery = '';
	let showLockedInvitations = true;
	let selectedInvite: Invite | null = null;
	let showAddForm = false;
	let showSuccessMessage = false;
	
	// Form data for new invitation
	let newInvite = {
		code: '',
		familyName: '',
		email: '',
		phone: '',
		address: '',
		maxPlusOnes: 1,
		language: 'en' as 'en' | 'it' | 'zh',
		rsvpDeadline: new Date('2026-04-30')
	};
	
	// Derived data
	$: filteredInvites = $invitesStore.filter(invite => {
		// Apply locked filter
		if (!showLockedInvitations && invite.locked) return false;
		
		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				invite.familyName.toLowerCase().includes(query) ||
				invite.code.toLowerCase().includes(query) ||
				invite.email.toLowerCase().includes(query)
			);
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
	
	// Handle form submission
	function handleAddInvite() {
		// Reset success message
		showSuccessMessage = false;
		
		// Add invitation (mock)
		invitesStore.add({
			...newInvite,
			locked: false,
			language: newInvite.language as 'en' | 'it' | 'zh',
			rsvpDeadline: new Date(newInvite.rsvpDeadline)
		});
		
		// Reset form
		newInvite = {
			code: '',
			familyName: '',
			email: '',
			phone: '',
			address: '',
			maxPlusOnes: 1,
			language: 'en',
			rsvpDeadline: new Date('2026-04-30')
		};
		
		// Show success message and hide form
		showSuccessMessage = true;
		showAddForm = false;
		
		// Reset selected invite
		selectedInvite = null;
	}
	
	// Mock delete function
	function handleDeleteInvite(id: string) {
		if (confirm('Are you sure you want to delete this invitation? This will also remove all associated guests.')) {
			invitesStore.remove(id);
			if (selectedInvite?.id === id) {
				selectedInvite = null;
			}
		}
	}
	
	// Mock lock/unlock function
	function toggleLock(invite: Invite) {
		invitesStore.update(invite.id, { locked: !invite.locked });
	}
</script>

<div class="space-y-6">
	{#if showSuccessMessage}
		<NotificationBanner type="success" message="Invitation created successfully!" />
	{/if}
	
	<!-- Actions bar -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div class="w-full md:w-1/3">
			<input
				type="text"
				placeholder="Search invitations..."
				class="w-full px-4 py-2 border rounded-md"
				bind:value={searchQuery}
			/>
		</div>
		
		<div class="flex items-center space-x-4">
			<label class="flex items-center space-x-2">
				<input type="checkbox" bind:checked={showLockedInvitations} />
				<span>Show locked invitations</span>
			</label>
			
			<Button on:click={() => { showAddForm = true; selectedInvite = null; }}>
				Add Invitation
			</Button>
		</div>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Invitations list -->
		<div class="lg:col-span-2">
			<Card title="Invitations">
				{#if filteredInvites.length === 0}
					<p class="text-gray-500 italic py-4">No invitations found matching your criteria.</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each filteredInvites as invite}
									<tr 
										class="hover:bg-gray-50 cursor-pointer"
										class:bg-blue-50={selectedInvite?.id === invite.id}
										on:click={() => selectedInvite = invite}
									>
										<td class="px-4 py-3 whitespace-nowrap">{invite.code}</td>
										<td class="px-4 py-3 whitespace-nowrap">{invite.familyName}</td>
										<td class="px-4 py-3 whitespace-nowrap">{invite.email}</td>
										<td class="px-4 py-3 whitespace-nowrap">{formatDate(invite.createdAt)}</td>
										<td class="px-4 py-3 whitespace-nowrap">
											{#if invite.locked}
												<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Locked</span>
											{:else}
												<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
											{/if}
										</td>
										<td class="px-4 py-3 whitespace-nowrap">
											<div class="flex space-x-2">
												<button 
													class="text-sm text-blue-600 hover:text-blue-800" 
													on:click|stopPropagation={() => toggleLock(invite)}
												>
													{invite.locked ? 'Unlock' : 'Lock'}
												</button>
												<button 
													class="text-sm text-red-600 hover:text-red-800" 
													on:click|stopPropagation={() => handleDeleteInvite(invite.id)}
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</Card>
		</div>
		
		<!-- Detail panel -->
		<div>
			{#if showAddForm}
				<Card title="Add New Invitation">
					<form on:submit|preventDefault={handleAddInvite} class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700">Invitation Code</label>
							<input 
								type="text" 
								required
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newInvite.code}
							/>
							<p class="mt-1 text-xs text-gray-500">This is the code guests will use to access their invitation</p>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Family Name</label>
							<input 
								type="text" 
								required
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newInvite.familyName}
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Email</label>
							<input 
								type="email" 
								required
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newInvite.email}
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Phone (optional)</label>
							<input 
								type="tel"
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newInvite.phone}
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Address (optional)</label>
							<textarea
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								rows="2"
								bind:value={newInvite.address}
							></textarea>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Max Plus Ones</label>
							<select 
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newInvite.maxPlusOnes}
							>
								<option value={0}>0 - No plus ones allowed</option>
								<option value={1}>1 - One plus one allowed</option>
								<option value={2}>2 - Two plus ones allowed</option>
								<option value={3}>3 - Three plus ones allowed</option>
							</select>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Language</label>
							<select 
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newInvite.language}
							>
								<option value="en">English</option>
								<option value="it">Italian</option>
								<option value="zh">Chinese</option>
							</select>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">RSVP Deadline</label>
							<input 
								type="date" 
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newInvite.rsvpDeadline}
							/>
						</div>
						
						<div class="flex justify-end space-x-3 pt-4">
							<Button variant="outline" on:click={() => showAddForm = false}>
								Cancel
							</Button>
							<Button type="submit">
								Create Invitation
							</Button>
						</div>
					</form>
				</Card>
			{:else if selectedInvite}
				<Card title="Invitation Details">
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-semibold">{selectedInvite.familyName}</h3>
							<p class="text-gray-600">Code: {selectedInvite.code}</p>
						</div>
						
						<div class="border-t pt-4">
							<p class="text-sm">
								<span class="font-medium">Email:</span> {selectedInvite.email}
							</p>
							{#if selectedInvite.phone}
								<p class="text-sm">
									<span class="font-medium">Phone:</span> {selectedInvite.phone}
								</p>
							{/if}
							{#if selectedInvite.address}
								<p class="text-sm">
									<span class="font-medium">Address:</span> {selectedInvite.address}
								</p>
							{/if}
						</div>
						
						<div class="border-t pt-4">
							<p class="text-sm">
								<span class="font-medium">Created:</span> {formatDate(selectedInvite.createdAt)}
							</p>
							<p class="text-sm">
								<span class="font-medium">RSVP Deadline:</span> {formatDate(selectedInvite.rsvpDeadline)}
							</p>
							<p class="text-sm">
								<span class="font-medium">Language:</span> 
								{selectedInvite.language === 'en' ? 'English' : 
								 selectedInvite.language === 'it' ? 'Italian' : 'Chinese'}
							</p>
							<p class="text-sm">
								<span class="font-medium">Max Plus Ones:</span> {selectedInvite.maxPlusOnes}
							</p>
							<p class="text-sm">
								<span class="font-medium">Status:</span> 
								{selectedInvite.locked ? 'Locked' : 'Active'}
							</p>
						</div>
						
						{#if selectedInvite.notes}
							<div class="border-t pt-4">
								<p class="text-sm font-medium">Notes:</p>
								<p class="text-sm mt-1">{selectedInvite.notes}</p>
							</div>
						{/if}
						
						<div class="border-t pt-4 flex justify-between">
							<Button 
								variant="outline" 
								size="sm" 
								on:click={() => selectedInvite && toggleLock(selectedInvite)}
							>
								{selectedInvite.locked ? 'Unlock Invitation' : 'Lock Invitation'}
							</Button>
							
							<Button 
								variant="danger" 
								size="sm" 
								on:click={() => selectedInvite && handleDeleteInvite(selectedInvite.id)}
							>
								Delete Invitation
							</Button>
						</div>
						
						<div class="border-t pt-4">
							<a href="/invite/{selectedInvite.code}" target="_blank">
								<Button variant="outline" size="sm">
									View Guest View
								</Button>
							</a>
						</div>
					</div>
				</Card>
			{:else}
				<Card>
					<div class="text-center py-8">
						<p class="text-gray-500">Select an invitation or add a new one to see details</p>
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>
