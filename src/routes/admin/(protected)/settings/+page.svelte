<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import settingsStore, { type GiftRegistryItem } from '$lib/stores/mockSettings';
	
	// Local state
	let showSuccessMessage = false;
	let activeTab: 'wedding' | 'rsvp' | 'gifts' | 'email' = 'wedding';
	
	// Copy settings for editing
	let editableSettings = $derived({...$settingsStore});
	
	// Form data for new gift item
	let newGiftItem = {
		name: '',
		description: '',
		price: 0,
		imageUrl: ''
	};
	
	// Form data for new payment link
	let newPaymentLink = {
		name: '',
		url: ''
	};
	
	// Format date for display
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}
	
	// Format date for input fields (YYYY-MM-DD)
	function formatDateForInput(date: Date): string {
		return date.toISOString().split('T')[0];
	}
	
	// Save wedding settings
	function saveWeddingSettings() {
		// Convert string dates to Date objects
		const weddingDateInput = document.getElementById('wedding-date') as HTMLInputElement;
		const weddingDate = new Date(
			weddingDateInput?.value + 'T' + 
			editableSettings.wedding.timeStart + ':00'
		);
		
		settingsStore.updateSection('wedding', {
			date: weddingDate,
			venue: editableSettings.wedding.venue,
			address: editableSettings.wedding.address,
			timeStart: editableSettings.wedding.timeStart,
			timeEnd: editableSettings.wedding.timeEnd
		});
		
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
	}
	
	// Save RSVP settings
	function saveRsvpSettings() {
		// Convert string date to Date object
		const rsvpDeadlineInput = document.getElementById('rsvp-deadline') as HTMLInputElement;
		const rsvpDeadline = new Date(
			rsvpDeadlineInput?.value + 'T23:59:59'
		);
		
		settingsStore.updateSection('rsvp', {
			deadline: rsvpDeadline,
			defaultMaxPlusOnes: editableSettings.rsvp.defaultMaxPlusOnes,
			allowDietaryRestrictions: editableSettings.rsvp.allowDietaryRestrictions,
			allowGiftRegistry: editableSettings.rsvp.allowGiftRegistry,
			allowNotes: editableSettings.rsvp.allowNotes
		});
		
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
	}
	
	// Save gift registry settings
	function saveGiftSettings() {
		settingsStore.updateSection('giftRegistry', {
			enabled: editableSettings.giftRegistry.enabled,
			cashGiftOptions: {
				enabled: editableSettings.giftRegistry.cashGiftOptions.enabled,
				paymentLinks: [...editableSettings.giftRegistry.cashGiftOptions.paymentLinks],
				message: editableSettings.giftRegistry.cashGiftOptions.message
			}
		});
		
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
	}
	
	// Save email settings
	function saveEmailSettings() {
		settingsStore.updateSection('email', {
			fromName: editableSettings.email.fromName,
			fromEmail: editableSettings.email.fromEmail,
			replyTo: editableSettings.email.replyTo,
			templates: {
				invitation: editableSettings.email.templates.invitation,
				reminder: editableSettings.email.templates.reminder,
				confirmation: editableSettings.email.templates.confirmation,
				thankyou: editableSettings.email.templates.thankyou
			}
		});
		
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
	}
	
	// Add new gift item
	function addGiftItem() {
		if (!newGiftItem.name || !newGiftItem.description || newGiftItem.price <= 0) {
			alert('Please fill out all required fields');
			return;
		}
		
		settingsStore.addGiftItem({
			name: newGiftItem.name,
			description: newGiftItem.description,
			price: newGiftItem.price,
			imageUrl: newGiftItem.imageUrl || undefined
		});
		
		// Reset form
		newGiftItem = {
			name: '',
			description: '',
			price: 0,
			imageUrl: ''
		};
		
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
	}
	
	// Remove gift item
	function removeGiftItem(id: string) {
		if (confirm('Are you sure you want to remove this gift item?')) {
			const updatedItems = editableSettings.giftRegistry.items.filter(item => item.id !== id);
			settingsStore.updateSection('giftRegistry', {
				items: updatedItems
			});
		}
	}
	
	// Add new payment link
	function addPaymentLink() {
		if (!newPaymentLink.name || !newPaymentLink.url) {
			alert('Please fill out all fields');
			return;
		}
		
		const updatedLinks = [
			...editableSettings.giftRegistry.cashGiftOptions.paymentLinks,
			{ ...newPaymentLink }
		];
		
		settingsStore.updateSection('giftRegistry', {
			cashGiftOptions: {
				...editableSettings.giftRegistry.cashGiftOptions,
				paymentLinks: updatedLinks
			}
		});
		
		// Reset form
		newPaymentLink = {
			name: '',
			url: ''
		};
		
		showSuccessMessage = true;
		setTimeout(() => showSuccessMessage = false, 3000);
	}
	
	// Remove payment link
	function removePaymentLink(index: number) {
		if (confirm('Are you sure you want to remove this payment link?')) {
			const updatedLinks = editableSettings.giftRegistry.cashGiftOptions.paymentLinks.filter(
				(_, i) => i !== index
			);
			
			settingsStore.updateSection('giftRegistry', {
				cashGiftOptions: {
					...editableSettings.giftRegistry.cashGiftOptions,
					paymentLinks: updatedLinks
				}
			});
		}
	}
	
	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	}
</script>

<div class="space-y-6">
	{#if showSuccessMessage}
		<NotificationBanner type="success" message="Settings saved successfully!" />
	{/if}
	
	<!-- Tabs -->
	<div class="border-b border-gray-200">
		<nav class="flex -mb-px">
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'wedding' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'wedding'}
			>
				Wedding Details
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'rsvp' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'rsvp'}
			>
				RSVP Settings
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'gifts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'gifts'}
			>
				Gift Registry
			</button>
			
			<button
				class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'email' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				on:click={() => activeTab = 'email'}
			>
				Email Settings
			</button>
		</nav>
	</div>
	
	<!-- Wedding Details Tab -->
	{#if activeTab === 'wedding'}
		<Card title="Wedding Details">
			<form on:submit|preventDefault={saveWeddingSettings} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">Wedding Date</label>
					<input 
						id="wedding-date"
						type="date" 
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						value={formatDateForInput($settingsStore.wedding.date)}
					/>
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700">Start Time</label>
						<input 
							type="time" 
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
							bind:value={editableSettings.wedding.timeStart}
						/>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700">End Time</label>
						<input 
							type="time" 
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
							bind:value={editableSettings.wedding.timeEnd}
						/>
					</div>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700">Venue Name</label>
					<input 
						type="text" 
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						bind:value={editableSettings.wedding.venue}
					/>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700">Venue Address</label>
					<textarea
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						rows="3"
						bind:value={editableSettings.wedding.address}
					></textarea>
				</div>
				
				<div class="pt-4">
					<Button type="submit">Save Wedding Details</Button>
				</div>
			</form>
		</Card>
	{/if}
	
	<!-- RSVP Settings Tab -->
	{#if activeTab === 'rsvp'}
		<Card title="RSVP Settings">
			<form on:submit|preventDefault={saveRsvpSettings} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">RSVP Deadline</label>
					<input 
						id="rsvp-deadline"
						type="date" 
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						value={formatDateForInput($settingsStore.rsvp.deadline)}
					/>
					<p class="mt-1 text-xs text-gray-500">
						After this date, guests will not be able to update their RSVPs
					</p>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700">Default Maximum Plus Ones</label>
					<select
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						bind:value={editableSettings.rsvp.defaultMaxPlusOnes}
					>
						<option value={0}>0 - No plus ones by default</option>
						<option value={1}>1 - One plus one by default</option>
						<option value={2}>2 - Two plus ones by default</option>
						<option value={3}>3 - Three plus ones by default</option>
					</select>
					<p class="mt-1 text-xs text-gray-500">
						This is the default number of plus ones allowed per invitation. You can override this for individual invitations.
					</p>
				</div>
				
				<div class="pt-4 space-y-3">
					<label class="block text-sm font-medium text-gray-700">RSVP Options</label>
					
					<div>
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="form-checkbox"
								bind:checked={editableSettings.rsvp.allowDietaryRestrictions}
							/>
							<span class="ml-2 text-sm">Allow guests to specify dietary restrictions</span>
						</label>
					</div>
					
					<div>
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="form-checkbox"
								bind:checked={editableSettings.rsvp.allowGiftRegistry}
							/>
							<span class="ml-2 text-sm">Show gift registry to guests</span>
						</label>
					</div>
					
					<div>
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="form-checkbox"
								bind:checked={editableSettings.rsvp.allowNotes}
							/>
							<span class="ml-2 text-sm">Allow guests to leave notes for the couple</span>
						</label>
					</div>
				</div>
				
				<div class="pt-4">
					<Button type="submit">Save RSVP Settings</Button>
				</div>
			</form>
		</Card>
	{/if}
	
	<!-- Gift Registry Tab -->
	{#if activeTab === 'gifts'}
		<div class="space-y-6">
			<Card title="Gift Registry Settings">
				<form on:submit|preventDefault={saveGiftSettings} class="space-y-4">
					<div>
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="form-checkbox"
								bind:checked={editableSettings.giftRegistry.enabled}
							/>
							<span class="ml-2 text-sm">Enable gift registry</span>
						</label>
						<p class="mt-1 text-xs text-gray-500 ml-6">
							When disabled, guests will not see the gift registry section
						</p>
					</div>
					
					<div class="border-t pt-4">
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="form-checkbox"
								bind:checked={editableSettings.giftRegistry.cashGiftOptions.enabled}
							/>
							<span class="ml-2 text-sm">Enable cash gift options</span>
						</label>
						<p class="mt-1 text-xs text-gray-500 ml-6">
							When enabled, guests will see payment links for cash gifts
						</p>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700">Cash Gift Message</label>
						<textarea
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
							rows="3"
							bind:value={editableSettings.giftRegistry.cashGiftOptions.message}
						></textarea>
						<p class="mt-1 text-xs text-gray-500">
							This message will be displayed to guests above the payment links
						</p>
					</div>
					
					<div class="pt-4">
						<Button type="submit">Save Gift Registry Settings</Button>
					</div>
				</form>
			</Card>
			
			<Card title="Payment Links">
				<div class="space-y-4">
					<div class="divide-y">
						{#if editableSettings.giftRegistry.cashGiftOptions.paymentLinks.length === 0}
							<p class="text-gray-500 italic py-2">No payment links added yet.</p>
						{:else}
							{#each editableSettings.giftRegistry.cashGiftOptions.paymentLinks as link, index}
								<div class="py-3 flex items-center justify-between">
									<div>
										<p class="font-medium">{link.name}</p>
										<p class="text-sm text-gray-500">{link.url}</p>
									</div>
									<button 
										type="button"
										class="text-sm text-red-600 hover:text-red-800"
										on:click={() => removePaymentLink(index)}
									>
										Remove
									</button>
								</div>
							{/each}
						{/if}
					</div>
					
					<div class="border-t pt-4">
						<h4 class="text-sm font-medium text-gray-700 mb-2">Add Payment Link</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-xs text-gray-500">Service Name</label>
								<input 
									type="text" 
									class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
									placeholder="PayPal, Venmo, etc."
									bind:value={newPaymentLink.name}
								/>
							</div>
							<div>
								<label class="block text-xs text-gray-500">Payment URL</label>
								<input 
									type="url" 
									class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
									placeholder="https://..."
									bind:value={newPaymentLink.url}
								/>
							</div>
						</div>
						<div class="mt-2">
							<Button size="sm" on:click={addPaymentLink}>
								Add Link
							</Button>
						</div>
					</div>
				</div>
			</Card>
			
			<Card title="Gift Registry Items">
				<div class="space-y-4">
					<div class="divide-y">
						{#if editableSettings.giftRegistry.items.length === 0}
							<p class="text-gray-500 italic py-2">No gift items added yet.</p>
						{:else}
							{#each editableSettings.giftRegistry.items as item}
								<div class="py-3 flex items-center justify-between">
									<div class="flex-1">
										<p class="font-medium">{item.name}</p>
										<p class="text-sm text-gray-500">{item.description}</p>
										<p class="text-sm font-medium mt-1">{formatCurrency(item.price)}</p>
										<div class="mt-1">
											{#if item.isReserved}
												<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
													Reserved
												</span>
											{:else}
												<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
													Available
												</span>
											{/if}
										</div>
									</div>
									
									<div class="flex items-center ml-4">
										<button 
											type="button"
											class="text-sm text-red-600 hover:text-red-800"
											on:click={() => removeGiftItem(item.id)}
										>
											Remove
										</button>
									</div>
								</div>
							{/each}
						{/if}
					</div>
					
					<div class="border-t pt-4">
						<h4 class="text-sm font-medium text-gray-700 mb-2">Add Gift Item</h4>
						<div class="space-y-3">
							<div>
								<label class="block text-xs text-gray-500">Item Name</label>
								<input 
									type="text" 
									class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
									bind:value={newGiftItem.name}
								/>
							</div>
							
							<div>
								<label class="block text-xs text-gray-500">Description</label>
								<textarea
									class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
									rows="2"
									bind:value={newGiftItem.description}
								></textarea>
							</div>
							
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label class="block text-xs text-gray-500">Price</label>
									<input 
										type="number" 
										min="0"
										step="0.01"
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
										bind:value={newGiftItem.price}
									/>
								</div>
								
								<div>
									<label class="block text-xs text-gray-500">Image URL (optional)</label>
									<input 
										type="url" 
										class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
										placeholder="https://..."
										bind:value={newGiftItem.imageUrl}
									/>
								</div>
							</div>
							
							<div class="mt-2">
								<Button size="sm" on:click={addGiftItem}>
									Add Gift Item
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	{/if}
	
	<!-- Email Settings Tab -->
	{#if activeTab === 'email'}
		<Card title="Email Settings">
			<form on:submit|preventDefault={saveEmailSettings} class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700">From Name</label>
						<input 
							type="text" 
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
							bind:value={editableSettings.email.fromName}
						/>
						<p class="mt-1 text-xs text-gray-500">
							Name displayed in the "From" field of emails
						</p>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700">From Email</label>
						<input 
							type="email" 
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
							bind:value={editableSettings.email.fromEmail}
						/>
						<p class="mt-1 text-xs text-gray-500">
							Email address used to send emails
						</p>
					</div>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700">Reply-To Email</label>
					<input 
						type="email" 
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
						bind:value={editableSettings.email.replyTo}
					/>
					<p class="mt-1 text-xs text-gray-500">
						Email address that will receive replies from guests
					</p>
				</div>
				
				<div class="border-t pt-4">
					<h3 class="text-base font-medium text-gray-700 mb-2">Email Templates</h3>
					
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700">Invitation Email</label>
							<textarea
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								rows="3"
								bind:value={editableSettings.email.templates.invitation}
							></textarea>
							<p class="mt-1 text-xs text-gray-500">
								Sent when a new invitation is created
							</p>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Reminder Email</label>
							<textarea
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								rows="3"
								bind:value={editableSettings.email.templates.reminder}
							></textarea>
							<p class="mt-1 text-xs text-gray-500">
								Sent as a reminder to guests who haven't responded
							</p>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Confirmation Email</label>
							<textarea
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								rows="3"
								bind:value={editableSettings.email.templates.confirmation}
							></textarea>
							<p class="mt-1 text-xs text-gray-500">
								Sent to guests after they RSVP
							</p>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Thank You Email</label>
							<textarea
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
								rows="3"
								bind:value={editableSettings.email.templates.thankyou}
							></textarea>
							<p class="mt-1 text-xs text-gray-500">
								Sent after the wedding to thank guests
							</p>
						</div>
					</div>
				</div>
				
				<div class="pt-4">
					<Button type="submit">Save Email Settings</Button>
				</div>
			</form>
		</Card>
	{/if}
</div>
