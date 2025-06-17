<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import guestsStore from '$lib/stores/mockGuests';
	import invitesStore from '$lib/stores/mockInvites';
	import settingsStore from '$lib/stores/mockSettings';
	
	// Local state
	let activeTab: 'overview' | 'attendance' | 'dietary' | 'gifts' = 'overview';
	
	// Computed statistics
	$: totalInvites = $invitesStore.length;
	$: totalGuests = $guestsStore.length;
	$: respondedInvites = $invitesStore.filter(invite => {
		const inviteGuests = $guestsStore.filter(g => g.inviteId === invite.id);
		return inviteGuests.some(g => g.attending !== null);
	}).length;
	
	$: pendingInvites = totalInvites - respondedInvites;
	
	// Attendance stats
	$: attendingGuests = $guestsStore.filter(g => g.attending === true).length;
	$: declinedGuests = $guestsStore.filter(g => g.attending === false).length;
	$: pendingGuests = $guestsStore.filter(g => g.attending === null).length;
	$: attendanceRate = totalGuests > 0 ? Math.round((attendingGuests / totalGuests) * 100) : 0;
	$: responseRate = totalGuests > 0 ? Math.round(((attendingGuests + declinedGuests) / totalGuests) * 100) : 0;
	
	// Dietary stats
	$: dietaryRestrictions = {
		vegetarian: $guestsStore.filter(g => g.dietaryRestrictions.includes('vegetarian')).length,
		vegan: $guestsStore.filter(g => g.dietaryRestrictions.includes('vegan')).length,
		glutenFree: $guestsStore.filter(g => g.dietaryRestrictions.includes('gluten-free')).length,
		dairyFree: $guestsStore.filter(g => g.dietaryRestrictions.includes('dairy-free')).length,
		nutAllergy: $guestsStore.filter(g => g.dietaryRestrictions.includes('nut-allergy')).length,
		shellfishAllergy: $guestsStore.filter(g => g.dietaryRestrictions.includes('shellfish-allergy')).length,
		other: $guestsStore.filter(g => g.dietaryRestrictions.includes('other')).length
	};
	
	// Gift stats
	$: totalGiftItems = $settingsStore.giftRegistry.items.length;
	$: reservedGiftItems = $settingsStore.giftRegistry.items.filter(item => item.isReserved).length;
	$: giftTotalValue = $settingsStore.giftRegistry.items.reduce((sum, item) => sum + item.price, 0);
	$: giftReservedValue = $settingsStore.giftRegistry.items
		.filter(item => item.isReserved)
		.reduce((sum, item) => sum + item.price, 0);
	
	// Format date for display
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}
	
	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	}
	
	// Generate a table of recent RSVPs
	function getRecentRSVPs(limit = 5) {
		// Sort guests by their RSVP date (most recent first)
		// In a real app, you would have an updatedAt field to sort by
		return $guestsStore
			.filter(g => g.attending !== null)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, limit);
	}
	
	// Get days until the wedding
	function getDaysUntilWedding(): number {
		const today = new Date();
		const weddingDate = $settingsStore.wedding.date;
		const diffTime = weddingDate.getTime() - today.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}
	
	// Get days until RSVP deadline
	function getDaysUntilRSVP(): number {
		const today = new Date();
		const rsvpDeadline = $settingsStore.rsvp.deadline;
		const diffTime = rsvpDeadline.getTime() - today.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}
	
	// Get guests with dietary restrictions
	function getGuestsWithDietaryRestrictions() {
		return $guestsStore.filter(g => g.dietaryRestrictions.length > 0);
	}
</script>

<div class="space-y-6">
	<!-- Tabs -->
	<div class="border-b border-gray-200">
		<nav class="flex -mb-px">
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'overview'}
			>
				Overview
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'attendance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'attendance'}
			>
				Attendance
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'dietary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'dietary'}
			>
				Dietary Needs
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'gifts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'gifts'}
			>
				Gift Registry
			</button>
		</nav>
	</div>
	
	<!-- Overview Tab -->
	{#if activeTab === 'overview'}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Quick stats -->
			<div>
				<Card title="Wedding Details">
					<div class="space-y-4">
						<div>
							<span class="block text-sm text-gray-500">Wedding Date</span>
							<span class="block text-xl font-semibold">{formatDate($settingsStore.wedding.date)}</span>
							<span class="block text-sm font-medium text-blue-600">
								{getDaysUntilWedding()} days from today
							</span>
						</div>
						
						<div>
							<span class="block text-sm text-gray-500">Venue</span>
							<span class="block font-medium">{$settingsStore.wedding.venue}</span>
							<span class="block text-sm text-gray-500">{$settingsStore.wedding.address}</span>
						</div>
						
						<div>
							<span class="block text-sm text-gray-500">RSVP Deadline</span>
							<span class="block font-medium">{formatDate($settingsStore.rsvp.deadline)}</span>
							<span class="block text-sm font-medium text-blue-600">
								{getDaysUntilRSVP()} days from today
							</span>
						</div>
					</div>
				</Card>
			</div>
			
			<div>
				<Card title="Invitation Statistics">
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<span class="block text-sm text-gray-500">Total Invitations</span>
								<span class="block text-3xl font-bold">{totalInvites}</span>
							</div>
							
							<div>
								<span class="block text-sm text-gray-500">Total Guests</span>
								<span class="block text-3xl font-bold">{totalGuests}</span>
							</div>
						</div>
						
						<div class="grid grid-cols-2 gap-4">
							<div>
								<span class="block text-sm text-gray-500">Responded</span>
								<span class="block text-3xl font-bold text-green-600">{respondedInvites}</span>
							</div>
							
							<div>
								<span class="block text-sm text-gray-500">Pending</span>
								<span class="block text-3xl font-bold text-yellow-600">{pendingInvites}</span>
							</div>
						</div>
						
						<div>
							<div class="w-full bg-gray-200 rounded-full h-2.5">
								<div class="bg-green-600 h-2.5 rounded-full" style="width: {responseRate}%"></div>
							</div>
							<p class="text-sm text-gray-600 mt-1">
								{responseRate}% response rate
							</p>
						</div>
					</div>
				</Card>
			</div>
			
			<div>
				<Card title="Attendance Summary">
					<div class="space-y-4">
						<div class="grid grid-cols-3 gap-2">
							<div>
								<span class="block text-sm text-gray-500">Attending</span>
								<span class="block text-2xl font-bold text-green-600">{attendingGuests}</span>
							</div>
							
							<div>
								<span class="block text-sm text-gray-500">Declined</span>
								<span class="block text-2xl font-bold text-red-600">{declinedGuests}</span>
							</div>
							
							<div>
								<span class="block text-sm text-gray-500">Pending</span>
								<span class="block text-2xl font-bold text-yellow-600">{pendingGuests}</span>
							</div>
						</div>
						
						<div>
							<div class="flex items-center space-x-2">
								<div class="w-full bg-gray-200 rounded-full h-2.5">
									<div class="bg-green-600 h-2.5 rounded-full" style="width: {attendanceRate}%"></div>
								</div>
								<span class="text-sm font-medium">{attendanceRate}%</span>
							</div>
							<p class="text-sm text-gray-600 mt-1">
								Attendance rate of responses
							</p>
						</div>
					</div>
				</Card>
			</div>
			
			<!-- Recent RSVPs -->
			<div class="md:col-span-2">
				<Card title="Recent RSVPs">
					{#if getRecentRSVPs().length === 0}
						<p class="text-gray-500 italic py-4">No RSVPs received yet.</p>
					{:else}
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invitation</th>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each getRecentRSVPs() as guest}
										{@const invite = $invitesStore.find(i => i.id === guest.inviteId)}
										<tr class="hover:bg-gray-50">
											<td class="px-4 py-3 whitespace-nowrap">
												<div>
													{guest.name}
													{#if guest.isPlusOne}
														<span class="text-xs text-gray-500 ml-1">(Plus One)</span>
													{/if}
												</div>
											</td>
											<td class="px-4 py-3 whitespace-nowrap">
												{invite?.familyName || 'Unknown'}
											</td>
											<td class="px-4 py-3 whitespace-nowrap">
												{formatDate(guest.createdAt)}
											</td>
											<td class="px-4 py-3 whitespace-nowrap">
												{#if guest.attending === true}
													<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
														Attending
													</span>
												{:else if guest.attending === false}
													<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
														Declined
													</span>
												{:else}
													<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
														Pending
													</span>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</Card>
			</div>
			
			<!-- Additional action cards -->
			<div>
				<Card>
					<div class="space-y-4">
						<div>
							<span class="block text-sm font-medium">Quick Actions</span>
						</div>
						
						<ul class="space-y-2">
							<li>
								<a 
									href="/admin/communications" 
									class="flex items-center p-3 hover:bg-gray-50 rounded-md"
								>
									<div>
										<span class="block font-medium">Send Reminder</span>
										<span class="block text-sm text-gray-500">Send reminders to guests who haven't responded</span>
									</div>
								</a>
							</li>
							
							<li>
								<a 
									href="/admin/guests" 
									class="flex items-center p-3 hover:bg-gray-50 rounded-md"
								>
									<div>
										<span class="block font-medium">Manage Guest List</span>
										<span class="block text-sm text-gray-500">Add or remove guests, update details</span>
									</div>
								</a>
							</li>
							
							<li>
								<a 
									href="/admin/settings" 
									class="flex items-center p-3 hover:bg-gray-50 rounded-md"
								>
									<div>
										<span class="block font-medium">Update Settings</span>
										<span class="block text-sm text-gray-500">Change wedding details, RSVP deadline</span>
									</div>
								</a>
							</li>
						</ul>
					</div>
				</Card>
			</div>
		</div>
	{/if}
	
	<!-- Attendance Tab -->
	{#if activeTab === 'attendance'}
		<div class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<Card title="Response Summary">
						<div class="space-y-6">
							<div class="text-center">
								<div class="inline-flex items-center justify-center p-1 rounded-full bg-blue-100">
									<div class="w-32 h-32 rounded-full flex items-center justify-center border-8" style="border-color: #3b82f6 #ef4444 #eab308; border-right-color: transparent;">
										<div class="text-center">
											<div class="text-2xl font-bold">{responseRate}%</div>
											<div class="text-xs text-gray-500">Response Rate</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="grid grid-cols-3 gap-2">
								<div class="text-center">
									<div class="text-lg font-bold text-green-600">{attendingGuests}</div>
									<div class="text-xs text-gray-500">Attending</div>
								</div>
								<div class="text-center">
									<div class="text-lg font-bold text-red-600">{declinedGuests}</div>
									<div class="text-xs text-gray-500">Declined</div>
								</div>
								<div class="text-center">
									<div class="text-lg font-bold text-yellow-600">{pendingGuests}</div>
									<div class="text-xs text-gray-500">Pending</div>
								</div>
							</div>
							
							<div>
								<div class="flex items-center mb-1">
									<div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
									<span class="text-sm">Attending ({attendingGuests})</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
									<div class="bg-green-500 h-2.5 rounded-full" style="width: {(attendingGuests / totalGuests) * 100}%"></div>
								</div>
								
								<div class="flex items-center mb-1">
									<div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
									<span class="text-sm">Declined ({declinedGuests})</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
									<div class="bg-red-500 h-2.5 rounded-full" style="width: {(declinedGuests / totalGuests) * 100}%"></div>
								</div>
								
								<div class="flex items-center mb-1">
									<div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
									<span class="text-sm">Pending ({pendingGuests})</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2.5">
									<div class="bg-yellow-500 h-2.5 rounded-full" style="width: {(pendingGuests / totalGuests) * 100}%"></div>
								</div>
							</div>
						</div>
					</Card>
				</div>
				
				<div class="md:col-span-2">
					<Card title="Invitation Response Status">
						{#if totalInvites === 0}
							<p class="text-gray-500 italic py-4">No invitations have been created yet.</p>
						{:else}
							<div class="overflow-x-auto">
								<table class="min-w-full divide-y divide-gray-200">
									<thead>
										<tr>
											<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
											<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
											<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
											<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										{#each $invitesStore as invite}
											{@const inviteGuests = $guestsStore.filter(g => g.inviteId === invite.id)}
											{@const attending = inviteGuests.filter(g => g.attending === true).length}
											{@const declined = inviteGuests.filter(g => g.attending === false).length}
											{@const pending = inviteGuests.filter(g => g.attending === null).length}
											{@const hasResponded = inviteGuests.some(g => g.attending !== null)}
											<tr class="hover:bg-gray-50">
												<td class="px-4 py-3 whitespace-nowrap">
													<div>
														<span class="font-medium">{invite.familyName}</span>
														<span class="block text-xs text-gray-500">Code: {invite.code}</span>
													</div>
												</td>
												<td class="px-4 py-3 whitespace-nowrap">
													{inviteGuests.length}
												</td>
												<td class="px-4 py-3 whitespace-nowrap">
													{#if hasResponded}
														<div>
															{#if attending > 0}
																<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
																	{attending} Attending
																</span>
															{/if}
															{#if declined > 0}
																<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 ml-1">
																	{declined} Declined
																</span>
															{/if}
															{#if pending > 0}
																<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 ml-1">
																	{pending} Pending
																</span>
															{/if}
														</div>
													{:else}
														<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
															No Response
														</span>
													{/if}
												</td>
												<td class="px-4 py-3 whitespace-nowrap">
													{formatDate(invite.createdAt)}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}
					</Card>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Dietary Tab -->
	{#if activeTab === 'dietary'}
		<div class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card title="Dietary Restrictions Summary">
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<span class="block text-sm text-gray-500">Vegetarian</span>
								<div class="flex items-center">
									<span class="text-xl font-bold">{dietaryRestrictions.vegetarian}</span>
									<span class="text-sm text-gray-500 ml-2">
										({totalGuests > 0 ? Math.round((dietaryRestrictions.vegetarian / totalGuests) * 100) : 0}%)
									</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
									<div class="bg-green-500 h-1.5 rounded-full" style="width: {totalGuests > 0 ? (dietaryRestrictions.vegetarian / totalGuests) * 100 : 0}%"></div>
								</div>
							</div>
							
							<div>
								<span class="block text-sm text-gray-500">Vegan</span>
								<div class="flex items-center">
									<span class="text-xl font-bold">{dietaryRestrictions.vegan}</span>
									<span class="text-sm text-gray-500 ml-2">
										({totalGuests > 0 ? Math.round((dietaryRestrictions.vegan / totalGuests) * 100) : 0}%)
									</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
									<div class="bg-green-700 h-1.5 rounded-full" style="width: {totalGuests > 0 ? (dietaryRestrictions.vegan / totalGuests) * 100 : 0}%"></div>
								</div>
							</div>
						</div>
						
						<div class="grid grid-cols-2 gap-4">
							<div>
								<span class="block text-sm text-gray-500">Gluten-Free</span>
								<div class="flex items-center">
									<span class="text-xl font-bold">{dietaryRestrictions.glutenFree}</span>
									<span class="text-sm text-gray-500 ml-2">
										({totalGuests > 0 ? Math.round((dietaryRestrictions.glutenFree / totalGuests) * 100) : 0}%)
									</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
									<div class="bg-yellow-500 h-1.5 rounded-full" style="width: {totalGuests > 0 ? (dietaryRestrictions.glutenFree / totalGuests) * 100 : 0}%"></div>
								</div>
							</div>
							
							<div>
								<span class="block text-sm text-gray-500">Dairy-Free</span>
								<div class="flex items-center">
									<span class="text-xl font-bold">{dietaryRestrictions.dairyFree}</span>
									<span class="text-sm text-gray-500 ml-2">
										({totalGuests > 0 ? Math.round((dietaryRestrictions.dairyFree / totalGuests) * 100) : 0}%)
									</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
									<div class="bg-blue-500 h-1.5 rounded-full" style="width: {totalGuests > 0 ? (dietaryRestrictions.dairyFree / totalGuests) * 100 : 0}%"></div>
								</div>
							</div>
						</div>
						
						<div class="grid grid-cols-2 gap-4">
							<div>
								<span class="block text-sm text-gray-500">Nut Allergy</span>
								<div class="flex items-center">
									<span class="text-xl font-bold">{dietaryRestrictions.nutAllergy}</span>
									<span class="text-sm text-gray-500 ml-2">
										({totalGuests > 0 ? Math.round((dietaryRestrictions.nutAllergy / totalGuests) * 100) : 0}%)
									</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
									<div class="bg-red-500 h-1.5 rounded-full" style="width: {totalGuests > 0 ? (dietaryRestrictions.nutAllergy / totalGuests) * 100 : 0}%"></div>
								</div>
							</div>
							
							<div>
								<span class="block text-sm text-gray-500">Shellfish Allergy</span>
								<div class="flex items-center">
									<span class="text-xl font-bold">{dietaryRestrictions.shellfishAllergy}</span>
									<span class="text-sm text-gray-500 ml-2">
										({totalGuests > 0 ? Math.round((dietaryRestrictions.shellfishAllergy / totalGuests) * 100) : 0}%)
									</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
									<div class="bg-orange-500 h-1.5 rounded-full" style="width: {totalGuests > 0 ? (dietaryRestrictions.shellfishAllergy / totalGuests) * 100 : 0}%"></div>
								</div>
							</div>
						</div>
						
						<div>
							<span class="block text-sm text-gray-500">Other</span>
							<div class="flex items-center">
								<span class="text-xl font-bold">{dietaryRestrictions.other}</span>
								<span class="text-sm text-gray-500 ml-2">
									({totalGuests > 0 ? Math.round((dietaryRestrictions.other / totalGuests) * 100) : 0}%)
								</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
								<div class="bg-purple-500 h-1.5 rounded-full" style="width: {totalGuests > 0 ? (dietaryRestrictions.other / totalGuests) * 100 : 0}%"></div>
							</div>
						</div>
					</div>
				</Card>
				
				<Card title="Guests with Dietary Restrictions">
					{#if Object.values(dietaryRestrictions).every(val => val === 0)}
						<p class="text-gray-500 italic py-4">No dietary restrictions reported yet.</p>
					{:else}
						<div class="overflow-y-auto max-h-96">
							<table class="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dietary Needs</th>
										<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each getGuestsWithDietaryRestrictions() as guest}
										{@const invite = $invitesStore.find(i => i.id === guest.inviteId)}
										<tr class="hover:bg-gray-50">
											<td class="px-4 py-3 whitespace-nowrap">
												<div>
													{guest.name}
													{#if guest.isPlusOne}
														<span class="text-xs text-gray-500 ml-1">(Plus One)</span>
													{/if}
												</div>
											</td>
											<td class="px-4 py-3 whitespace-nowrap">
												{invite?.familyName || 'Unknown'}
											</td>
											<td class="px-4 py-3">
												<div class="space-y-1">
													{#each guest.dietaryRestrictions as restriction}
														<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
															{restriction === 'vegetarian' ? 'bg-green-100 text-green-800' : 
															restriction === 'vegan' ? 'bg-green-200 text-green-900' : 
															restriction === 'gluten-free' ? 'bg-yellow-100 text-yellow-800' : 
															restriction === 'dairy-free' ? 'bg-blue-100 text-blue-800' : 
															restriction === 'nut-allergy' ? 'bg-red-100 text-red-800' : 
															restriction === 'shellfish-allergy' ? 'bg-orange-100 text-orange-800' : 
															'bg-purple-100 text-purple-800'}"
														>
															{restriction}
														</span>
													{/each}
												</div>
											</td>
											<td class="px-4 py-3">
												{#if guest.otherDietaryNotes}
													<p class="text-sm text-gray-600">{guest.otherDietaryNotes}</p>
												{:else}
													<p class="text-sm text-gray-400 italic">No notes</p>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</Card>
			</div>
		</div>
	{/if}
	
	<!-- Gift Registry Tab -->
	{#if activeTab === 'gifts'}
		<div class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<Card title="Gift Registry Summary">
						<div class="space-y-4">
							<div>
								<span class="block text-sm text-gray-500">Total Items</span>
								<span class="block text-3xl font-bold">{totalGiftItems}</span>
							</div>
							
							<div class="mt-4">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium">Reserved</span>
									<span class="text-sm font-medium">{reservedGiftItems} of {totalGiftItems}</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
									<div class="bg-blue-600 h-2.5 rounded-full" style="width: {totalGiftItems > 0 ? (reservedGiftItems / totalGiftItems) * 100 : 0}%"></div>
								</div>
								<p class="text-xs text-gray-500 mt-1">
									{totalGiftItems > 0 ? Math.round((reservedGiftItems / totalGiftItems) * 100) : 0}% of items reserved
								</p>
							</div>
							
							<div class="pt-4 border-t">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<span class="block text-sm text-gray-500">Total Value</span>
										<span class="block text-2xl font-bold">{formatCurrency(giftTotalValue)}</span>
									</div>
									
									<div>
										<span class="block text-sm text-gray-500">Reserved Value</span>
										<span class="block text-2xl font-bold text-blue-600">{formatCurrency(giftReservedValue)}</span>
									</div>
								</div>
								
								<div class="mt-2">
									<div class="w-full bg-gray-200 rounded-full h-2.5">
										<div class="bg-blue-600 h-2.5 rounded-full" style="width: {giftTotalValue > 0 ? (giftReservedValue / giftTotalValue) * 100 : 0}%"></div>
									</div>
									<p class="text-xs text-gray-500 mt-1">
										{giftTotalValue > 0 ? Math.round((giftReservedValue / giftTotalValue) * 100) : 0}% of total value reserved
									</p>
								</div>
							</div>
						</div>
					</Card>
				</div>
				
				<div class="md:col-span-2">
					<Card title="Gift Registry Items">
						{#if totalGiftItems === 0}
							<p class="text-gray-500 italic py-4">No gift registry items have been added yet.</p>
						{:else}
							<div class="overflow-x-auto">
								<table class="min-w-full divide-y divide-gray-200">
									<thead>
										<tr>
											<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
											<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
											<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										{#each $settingsStore.giftRegistry.items as item}
											<tr class="hover:bg-gray-50">
												<td class="px-4 py-3">
													<div>
														<span class="font-medium">{item.name}</span>
														<p class="text-sm text-gray-500">{item.description}</p>
													</div>
												</td>
												<td class="px-4 py-3 whitespace-nowrap">
													{formatCurrency(item.price)}
												</td>
												<td class="px-4 py-3 whitespace-nowrap">
													{#if item.isReserved}
														<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
															Reserved
														</span>
													{:else}
														<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
															Available
														</span>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}
					</Card>
				</div>
			</div>
		</div>
	{/if}
</div>
