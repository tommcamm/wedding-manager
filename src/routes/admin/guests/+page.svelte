<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import guestsStore, { type Guest, type DietaryRestriction } from '$lib/stores/mockGuests';
	import invitesStore from '$lib/stores/mockInvites';
	
	// Local state
	let searchQuery = '';
	let selectedStatus: 'all' | 'attending' | 'declined' | 'pending' = 'all';
	let selectedDietaryFilter: DietaryRestriction | 'all' = 'all';
	let selectedGuest: Guest | null = null;
	let showAddForm = false;
	let showSuccessMessage = false;
	
	// Form data for new guest
	let newGuest = {
		name: '',
		email: '',
		phone: '',
		inviteId: '',
		attending: null as boolean | null,
		isPlusOne: false,
		dietaryRestrictions: [] as DietaryRestriction[],
		otherDietaryNotes: ''
	};
	
	// Derived data - all invite options for select dropdown
	$: inviteOptions = $invitesStore
		.filter(invite => !invite.locked)
		.map(invite => ({
			id: invite.id,
			label: `${invite.familyName} (${invite.code})`
		}));
	
	// Filtered guests based on search and filters
	$: filteredGuests = $guestsStore.filter(guest => {
		// Apply status filter
		if (selectedStatus === 'attending' && guest.attending !== true) return false;
		if (selectedStatus === 'declined' && guest.attending !== false) return false;
		if (selectedStatus === 'pending' && guest.attending !== null) return false;
		
		// Apply dietary filter
		if (
			selectedDietaryFilter !== 'all' && 
			!guest.dietaryRestrictions.includes(selectedDietaryFilter)
		) {
			return false;
		}
		
		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const inviteFamilyName = getInviteFamilyName(guest.inviteId).toLowerCase();
			
			return (
				guest.name.toLowerCase().includes(query) ||
				(guest.email?.toLowerCase().includes(query) || false) ||
				inviteFamilyName.includes(query)
			);
		}
		
		return true;
	});
	
	// Get invite details
	function getInviteFamilyName(inviteId: string): string {
		const invite = $invitesStore.find(inv => inv.id === inviteId);
		return invite ? invite.familyName : 'Unknown';
	}
	
	// Get invite code
	function getInviteCode(inviteId: string): string {
		const invite = $invitesStore.find(inv => inv.id === inviteId);
		return invite ? invite.code : '';
	}
	
	// Format date for display
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}
	
	// Handle dietary restriction change in form
	function toggleDietaryRestriction(restriction: DietaryRestriction) {
		if (newGuest.dietaryRestrictions.includes(restriction)) {
			newGuest.dietaryRestrictions = newGuest.dietaryRestrictions.filter(r => r !== restriction);
		} else {
			newGuest.dietaryRestrictions = [...newGuest.dietaryRestrictions, restriction];
		}
	}
	
	// Handle form submission
	function handleAddGuest() {
		// Reset success message
		showSuccessMessage = false;
		
		// Validate form
		if (!newGuest.inviteId) {
			alert('Please select an invitation');
			return;
		}
		
		// Add guest (mock)
		guestsStore.add({
			...newGuest,
			attending: newGuest.attending,
			dietaryRestrictions: [...newGuest.dietaryRestrictions]
		});
		
		// Reset form
		newGuest = {
			name: '',
			email: '',
			phone: '',
			inviteId: '',
			attending: null,
			isPlusOne: false,
			dietaryRestrictions: [],
			otherDietaryNotes: ''
		};
		
		// Show success message and hide form
		showSuccessMessage = true;
		showAddForm = false;
		
		// Reset selected guest
		selectedGuest = null;
	}
	
	// Mock delete function
	function handleDeleteGuest(id: string) {
		if (confirm('Are you sure you want to delete this guest?')) {
			guestsStore.remove(id);
			if (selectedGuest?.id === id) {
				selectedGuest = null;
			}
		}
	}
	
	// Update attendance status
	function updateAttendance(guest: Guest, status: boolean | null) {
		guestsStore.update(guest.id, { attending: status });
	}
	
	// Get text for status badges
	function getStatusBadgeClass(status: boolean | null): string {
		if (status === true) return 'bg-green-100 text-green-800';
		if (status === false) return 'bg-red-100 text-red-800';
		return 'bg-gray-100 text-gray-800';
	}
	
	function getStatusText(status: boolean | null): string {
		if (status === true) return 'Attending';
		if (status === false) return 'Declined';
		return 'Pending';
	}
</script>

<div class="space-y-6">
	{#if showSuccessMessage}
		<NotificationBanner type="success" message="Guest added successfully!" />
	{/if}
	
	<!-- Actions bar -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div class="w-full md:w-1/3">
			<input
				type="text"
				placeholder="Search guests..."
				class="w-full px-4 py-2 border rounded-md"
				bind:value={searchQuery}
			/>
		</div>
		
		<div class="flex flex-wrap items-center gap-4">
			<select 
				class="px-4 py-2 border rounded-md" 
				bind:value={selectedStatus}
			>
				<option value="all">All Statuses</option>
				<option value="attending">Attending</option>
				<option value="declined">Declined</option>
				<option value="pending">Pending</option>
			</select>
			
			<select 
				class="px-4 py-2 border rounded-md" 
				bind:value={selectedDietaryFilter}
			>
				<option value="all">All Dietary Needs</option>
				<option value="vegetarian">Vegetarian</option>
				<option value="vegan">Vegan</option>
				<option value="gluten-free">Gluten-Free</option>
				<option value="dairy-free">Dairy-Free</option>
				<option value="nut-allergy">Nut Allergy</option>
				<option value="shellfish-allergy">Shellfish Allergy</option>
				<option value="other">Other</option>
			</select>
			
			<Button on:click={() => { showAddForm = true; selectedGuest = null; }}>
				Add Guest
			</Button>
		</div>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Guests list -->
		<div class="lg:col-span-2">
			<Card title="Guest List">
				{#if filteredGuests.length === 0}
					<p class="text-gray-500 italic py-4">No guests found matching your criteria.</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invitation</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dietary</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each filteredGuests as guest}
									<tr 
										class="hover:bg-gray-50 cursor-pointer"
										class:bg-blue-50={selectedGuest?.id === guest.id}
										on:click={() => selectedGuest = guest}
									>
										<td class="px-4 py-3 whitespace-nowrap">
											<div>
												{guest.name}
												{#if guest.isPlusOne}
													<span class="text-xs text-gray-500 ml-1">(Plus One)</span>
												{/if}
											</div>
											{#if guest.email}
												<div class="text-xs text-gray-500">{guest.email}</div>
											{/if}
										</td>
										<td class="px-4 py-3 whitespace-nowrap">
											{getInviteFamilyName(guest.inviteId)}
											<div class="text-xs text-gray-500">Code: {getInviteCode(guest.inviteId)}</div>
										</td>
										<td class="px-4 py-3 whitespace-nowrap">
											<span class={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(guest.attending)}`}>
												{getStatusText(guest.attending)}
											</span>
										</td>
										<td class="px-4 py-3 whitespace-nowrap">
											{#if guest.dietaryRestrictions.length > 0}
												<div class="flex flex-wrap gap-1">
													{#each guest.dietaryRestrictions as restriction}
														<span class="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
															{restriction}
														</span>
													{/each}
												</div>
											{:else}
												<span class="text-xs text-gray-500">None</span>
											{/if}
										</td>
										<td class="px-4 py-3 whitespace-nowrap">
											<div class="flex space-x-2">
												<button 
													class="text-sm text-red-600 hover:text-red-800" 
													on:click|stopPropagation={() => handleDeleteGuest(guest.id)}
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
				<Card title="Add New Guest">
					<form on:submit|preventDefault={handleAddGuest} class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700">Full Name</label>
							<input 
								type="text" 
								required
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newGuest.name}
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Email (optional)</label>
							<input 
								type="email" 
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newGuest.email}
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Phone (optional)</label>
							<input 
								type="tel"
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newGuest.phone}
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Invitation</label>
							<select 
								required
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								bind:value={newGuest.inviteId}
							>
								<option value="">Select an invitation</option>
								{#each inviteOptions as invite}
									<option value={invite.id}>{invite.label}</option>
								{/each}
							</select>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">RSVP Status</label>
							<div class="mt-2 space-x-4">
								<label class="inline-flex items-center">
									<input 
										type="radio" 
										name="attending" 
										value="attending"
										checked={newGuest.attending === true}
										on:change={() => newGuest.attending = true}
										class="form-radio"
									/>
									<span class="ml-2">Attending</span>
								</label>
								<label class="inline-flex items-center">
									<input 
										type="radio" 
										name="attending" 
										value="declined"
										checked={newGuest.attending === false}
										on:change={() => newGuest.attending = false}
										class="form-radio"
									/>
									<span class="ml-2">Declined</span>
								</label>
								<label class="inline-flex items-center">
									<input 
										type="radio" 
										name="attending" 
										value="pending"
										checked={newGuest.attending === null}
										on:change={() => newGuest.attending = null}
										class="form-radio"
									/>
									<span class="ml-2">Pending</span>
								</label>
							</div>
						</div>
						
						<div>
							<label class="flex items-center">
								<input 
									type="checkbox" 
									class="form-checkbox"
									bind:checked={newGuest.isPlusOne}
								/>
								<span class="ml-2 text-sm">This is a plus one</span>
							</label>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
							<div class="mt-2 space-y-2">
								<label class="inline-flex items-center mr-4">
									<input 
										type="checkbox" 
										checked={newGuest.dietaryRestrictions.includes('vegetarian')}
										on:change={() => toggleDietaryRestriction('vegetarian')}
										class="form-checkbox"
									/>
									<span class="ml-2">Vegetarian</span>
								</label>
								<label class="inline-flex items-center mr-4">
									<input 
										type="checkbox" 
										checked={newGuest.dietaryRestrictions.includes('vegan')}
										on:change={() => toggleDietaryRestriction('vegan')}
										class="form-checkbox"
									/>
									<span class="ml-2">Vegan</span>
								</label>
								<label class="inline-flex items-center mr-4">
									<input 
										type="checkbox" 
										checked={newGuest.dietaryRestrictions.includes('gluten-free')}
										on:change={() => toggleDietaryRestriction('gluten-free')}
										class="form-checkbox"
									/>
									<span class="ml-2">Gluten-Free</span>
								</label>
								<label class="inline-flex items-center mr-4">
									<input 
										type="checkbox" 
										checked={newGuest.dietaryRestrictions.includes('dairy-free')}
										on:change={() => toggleDietaryRestriction('dairy-free')}
										class="form-checkbox"
									/>
									<span class="ml-2">Dairy-Free</span>
								</label>
								<label class="inline-flex items-center mr-4">
									<input 
										type="checkbox" 
										checked={newGuest.dietaryRestrictions.includes('nut-allergy')}
										on:change={() => toggleDietaryRestriction('nut-allergy')}
										class="form-checkbox"
									/>
									<span class="ml-2">Nut Allergy</span>
								</label>
								<label class="inline-flex items-center mr-4">
									<input 
										type="checkbox" 
										checked={newGuest.dietaryRestrictions.includes('shellfish-allergy')}
										on:change={() => toggleDietaryRestriction('shellfish-allergy')}
										class="form-checkbox"
									/>
									<span class="ml-2">Shellfish Allergy</span>
								</label>
								<label class="inline-flex items-center">
									<input 
										type="checkbox" 
										checked={newGuest.dietaryRestrictions.includes('other')}
										on:change={() => toggleDietaryRestriction('other')}
										class="form-checkbox"
									/>
									<span class="ml-2">Other</span>
								</label>
							</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Other Dietary Notes</label>
							<textarea
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								rows="2"
								bind:value={newGuest.otherDietaryNotes}
							></textarea>
						</div>
						
						<div class="flex justify-end space-x-3 pt-4">
							<Button variant="outline" on:click={() => showAddForm = false}>
								Cancel
							</Button>
							<Button type="submit">
								Add Guest
							</Button>
						</div>
					</form>
				</Card>
			{:else if selectedGuest}
				<Card title="Guest Details">
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-semibold">{selectedGuest.name}</h3>
							{#if selectedGuest.isPlusOne}
								<p class="text-gray-500 text-sm">Plus One</p>
							{/if}
						</div>
						
						<div class="border-t pt-4">
							<p class="text-sm">
								<span class="font-medium">Invitation:</span> {getInviteFamilyName(selectedGuest.inviteId)}
							</p>
							<p class="text-sm">
								<span class="font-medium">Code:</span> {getInviteCode(selectedGuest.inviteId)}
							</p>
							{#if selectedGuest.email}
								<p class="text-sm">
									<span class="font-medium">Email:</span> {selectedGuest.email}
								</p>
							{/if}
							{#if selectedGuest.phone}
								<p class="text-sm">
									<span class="font-medium">Phone:</span> {selectedGuest.phone}
								</p>
							{/if}
						</div>
						
						<div class="border-t pt-4">
							<p class="text-sm">
								<span class="font-medium">RSVP Status:</span> 
								<span class={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedGuest.attending)}`}>
									{getStatusText(selectedGuest.attending)}
								</span>
							</p>
							<p class="text-sm mt-2">
								<span class="font-medium">Created:</span> {formatDate(selectedGuest.createdAt)}
							</p>
						</div>
						
						<div class="border-t pt-4">
							<p class="text-sm font-medium">Dietary Restrictions:</p>
							{#if selectedGuest.dietaryRestrictions.length > 0}
								<div class="flex flex-wrap gap-1 mt-1">
									{#each selectedGuest.dietaryRestrictions as restriction}
										<span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
											{restriction}
										</span>
									{/each}
								</div>
							{:else}
								<p class="text-sm text-gray-500 mt-1">None specified</p>
							{/if}
							
							{#if selectedGuest.otherDietaryNotes}
								<p class="text-sm font-medium mt-3">Additional Notes:</p>
								<p class="text-sm mt-1">{selectedGuest.otherDietaryNotes}</p>
							{/if}
						</div>
						
						<div class="border-t pt-4">
							<p class="text-sm font-medium">Update RSVP Status:</p>
							<div class="flex gap-2 mt-2">
								<Button 
									variant={selectedGuest.attending === true ? 'primary' : 'outline'} 
									size="sm" 
									on:click={() => selectedGuest && updateAttendance(selectedGuest, true)}
								>
									Attending
								</Button>
								<Button 
									variant={selectedGuest.attending === false ? 'primary' : 'outline'} 
									size="sm" 
									on:click={() => selectedGuest && updateAttendance(selectedGuest, false)}
								>
									Declined
								</Button>
								<Button 
									variant={selectedGuest.attending === null ? 'primary' : 'outline'} 
									size="sm" 
									on:click={() => selectedGuest && updateAttendance(selectedGuest, null)}
								>
									Pending
								</Button>
							</div>
						</div>
						
						<div class="border-t pt-4">
							<Button 
								variant="danger" 
								size="sm" 
								on:click={() => selectedGuest && handleDeleteGuest(selectedGuest.id)}
							>
								Delete Guest
							</Button>
						</div>
					</div>
				</Card>
			{:else}
				<Card>
					<div class="text-center py-8">
						<p class="text-gray-500">Select a guest or add a new one to see details</p>
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>
