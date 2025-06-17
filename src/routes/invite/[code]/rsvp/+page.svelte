<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import type { Guest } from '$lib/stores/mockGuests';
	
	// Get data from server (would normally be passed through the +page.server.ts)
	const data = $page.data;
	const invite = data.invite;
	const allGuests = data.guests;
	const settings = data.settings;
	const isPastDeadline = data.isPastDeadline;
	const lang = data.lang as 'en' | 'it' | 'zh';
	
	// Separate main guests and plus ones
	let mainGuests = $state(allGuests.filter((g: Guest) => !g.isPlusOne));
	let plusOnes = $state(allGuests.filter((g: Guest) => g.isPlusOne));
	
	// Plus one form
	let newPlusOneName = $state('');
	let showPlusOneForm = $state(false);
	
	// Form saving state
	let isSaving = $state(false);
	let saveSuccess = $state(false);
	let saveError = $state('');
	
	// Check if we can add more plus ones
	const canAddPlusOne = $derived(
		plusOnes.length < invite.maxPlusOnes && !isPastDeadline && !invite.locked
	);
	
	// Translations
	const translations = {
		title: {
			en: 'Update Your RSVP',
			it: 'Aggiorna la tua RSVP',
			zh: '更新您的回复'
		},
		mainGuests: {
			en: 'Named Guests',
			it: 'Ospiti Nominati',
			zh: '指定宾客'
		},
		plusOnes: {
			en: 'Plus Ones',
			it: 'Accompagnatori',
			zh: '额外宾客'
		},
		attending: {
			en: 'Attending',
			it: 'Partecipa',
			zh: '参加'
		},
		notAttending: {
			en: 'Not Attending',
			it: 'Non Partecipa',
			zh: '不参加'
		},
		undecided: {
			en: 'Undecided',
			it: 'Indeciso',
			zh: '未定'
		},
		addPlusOne: {
			en: 'Add a Plus One',
			it: 'Aggiungi un Accompagnatore',
			zh: '添加一位嘉宾'
		},
		name: {
			en: 'Full Name',
			it: 'Nome Completo',
			zh: '全名'
		},
		add: {
			en: 'Add',
			it: 'Aggiungi',
			zh: '添加'
		},
		cancel: {
			en: 'Cancel',
			it: 'Annulla',
			zh: '取消'
		},
		save: {
			en: 'Save RSVP',
			it: 'Salva RSVP',
			zh: '保存回复'
		},
		saving: {
			en: 'Saving...',
			it: 'Salvataggio...',
			zh: '保存中...'
		},
		success: {
			en: 'Your RSVP has been updated successfully!',
			it: 'La tua RSVP è stata aggiornata con successo!',
			zh: '您的回复已成功更新！'
		},
		removePlusOne: {
			en: 'Remove',
			it: 'Rimuovi',
			zh: '移除'
		},
		maxPlusOnes: {
			en: `You can add up to ${invite.maxPlusOnes} additional guest${invite.maxPlusOnes !== 1 ? 's' : ''}.`,
			it: `Puoi aggiungere fino a ${invite.maxPlusOnes} ospite${invite.maxPlusOnes !== 1 ? 'i' : ''} aggiuntivo${invite.maxPlusOnes !== 1 ? 'i' : ''}.`,
			zh: `您最多可以添加${invite.maxPlusOnes}位额外嘉宾。`
		},
		noPlusOnes: {
			en: 'You cannot add additional guests to this invitation.',
			it: 'Non puoi aggiungere ospiti aggiuntivi a questo invito.',
			zh: '您不能在此邀请中添加额外嘉宾。'
		},
		backToInvite: {
			en: 'Back to Invitation',
			it: 'Torna all\'Invito',
			zh: '返回邀请函'
		}
	};
	
	// Update attendance status
	function updateAttendance(guest: Guest, attending: boolean | null) {
		guest.attending = attending;
	}
	
	// Add a new plus one
	function addPlusOne() {
		if (!newPlusOneName.trim() || !canAddPlusOne) return;
		
		// In a real app, this would be an API call
		// For now, we'll just update the local state
		const newGuest: Omit<Guest, 'id' | 'createdAt'> = {
			inviteId: invite.id,
			name: newPlusOneName.trim(),
			attending: true,
			isPlusOne: true,
			dietaryRestrictions: []
		};
		
		// This would normally be handled by the server
		// Mock implementation for demo
		const id = (Math.max(...allGuests.map((g: Guest) => parseInt(g.id))) + 1).toString();
		const createdGuest = {
			...newGuest,
			id,
			createdAt: new Date()
		};
		
		plusOnes = [...plusOnes, createdGuest];
		allGuests.push(createdGuest);
		
		// Reset form
		newPlusOneName = '';
		showPlusOneForm = false;
	}
	
	// Remove a plus one
	function removePlusOne(guest: Guest) {
		plusOnes = plusOnes.filter((g: Guest) => g.id !== guest.id);
		// In a real app, we would call an API to delete the guest
	}
	
	// Save all changes
	async function saveChanges() {
		if (isPastDeadline || invite.locked) return;
		
		isSaving = true;
		saveError = '';
		saveSuccess = false;
		
		try {
			// In a real app, this would be an API call
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Success!
			saveSuccess = true;
			
			// Navigate back to invitation page after a delay
			setTimeout(() => {
				goto(`/invite/${invite.code}`);
			}, 2000);
		} catch (error) {
			saveError = 'An error occurred while saving your RSVP. Please try again.';
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="space-y-8">
	<!-- Page Title -->
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-bold text-gray-800">{translations.title[lang]}</h1>
		<a href={`/invite/${invite.code}`} class="text-sm text-blue-600 hover:underline">
			{translations.backToInvite[lang]}
		</a>
	</div>
	
	{#if isPastDeadline || invite.locked}
		<NotificationBanner
			type="warning"
			message={lang === 'en' ? 
				'The RSVP deadline has passed. Please contact the couple directly for any changes.' : 
				lang === 'it' ? 
				'La scadenza per la conferma è passata. Si prega di contattare direttamente la coppia per eventuali modifiche.' : 
				'回复截止日期已过。如需更改，请直接联系新婚夫妇。'}
			showDismiss={false}
		/>
	{/if}
	
	{#if saveSuccess}
		<NotificationBanner
			type="success"
			message={translations.success[lang]}
			showDismiss={false}
		/>
	{/if}
	
	{#if saveError}
		<NotificationBanner
			type="error"
			message={saveError}
			showDismiss={true}
		/>
	{/if}
	
	<!-- Main Guests -->
	<Card title={translations.mainGuests[lang]}>
		<ul class="divide-y divide-gray-200">
			{#each mainGuests as guest}
				<li class="py-4">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<p class="font-medium">{guest.name}</p>
						</div>
						
						<div class="flex space-x-2">
							<button 
								class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
								class:bg-green-100={guest.attending === true}
								class:text-green-800={guest.attending === true}
								class:bg-gray-100={guest.attending !== true}
								class:text-gray-800={guest.attending !== true}
								class:hover:bg-green-200={!isPastDeadline && !invite.locked}
								class:opacity-50={isPastDeadline || invite.locked}
								disabled={isPastDeadline || invite.locked}
								on:click={() => updateAttendance(guest, true)}
							>
								{translations.attending[lang]}
							</button>
							
							<button 
								class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
								class:bg-red-100={guest.attending === false}
								class:text-red-800={guest.attending === false}
								class:bg-gray-100={guest.attending !== false}
								class:text-gray-800={guest.attending !== false}
								class:hover:bg-red-200={!isPastDeadline && !invite.locked}
								class:opacity-50={isPastDeadline || invite.locked}
								disabled={isPastDeadline || invite.locked}
								on:click={() => updateAttendance(guest, false)}
							>
								{translations.notAttending[lang]}
							</button>
							
							<button 
								class="px-3 py-1 rounded-full text-sm font-medium transition-colors text-gray-800"
								class:bg-gray-300={guest.attending === null}
								class:bg-gray-100={guest.attending !== null}
								class:hover:bg-gray-200={!isPastDeadline && !invite.locked}
								class:opacity-50={isPastDeadline || invite.locked}
								disabled={isPastDeadline || invite.locked}
								on:click={() => updateAttendance(guest, null)}
							>
								{translations.undecided[lang]}
							</button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</Card>
	
	<!-- Plus Ones -->
	<Card title={translations.plusOnes[lang]}>
		{#if invite.maxPlusOnes > 0}
			<p class="text-sm text-gray-600 mb-4">{translations.maxPlusOnes[lang]}</p>
		{:else}
			<p class="text-sm text-gray-600 mb-4">{translations.noPlusOnes[lang]}</p>
		{/if}
		
		{#if plusOnes.length > 0}
			<ul class="divide-y divide-gray-200 mb-4">
				{#each plusOnes as guest}
					<li class="py-4">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<p class="font-medium">{guest.name}</p>
								<p class="text-xs text-gray-500">
									{lang === 'en' ? 'Plus One' : lang === 'it' ? 'Accompagnatore' : '额外嘉宾'}
								</p>
							</div>
							
							<div class="flex space-x-2">
								<button 
									class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
									class:bg-green-100={guest.attending === true}
									class:text-green-800={guest.attending === true}
									class:bg-gray-100={guest.attending !== true}
									class:text-gray-800={guest.attending !== true}
									class:hover:bg-green-200={!isPastDeadline && !invite.locked}
									class:opacity-50={isPastDeadline || invite.locked}
									disabled={isPastDeadline || invite.locked}
									on:click={() => updateAttendance(guest, true)}
								>
									{translations.attending[lang]}
								</button>
								
								<button 
									class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
									class:bg-red-100={guest.attending === false}
									class:text-red-800={guest.attending === false}
									class:bg-gray-100={guest.attending !== false}
									class:text-gray-800={guest.attending !== false}
									class:hover:bg-red-200={!isPastDeadline && !invite.locked}
									class:opacity-50={isPastDeadline || invite.locked}
									disabled={isPastDeadline || invite.locked}
									on:click={() => updateAttendance(guest, false)}
								>
									{translations.notAttending[lang]}
								</button>
								
								{#if !isPastDeadline && !invite.locked}
									<button 
										class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
										on:click={() => removePlusOne(guest)}
									>
										{translations.removePlusOne[lang]}
									</button>
								{/if}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{:else if invite.maxPlusOnes > 0}
			<p class="text-sm text-gray-600 italic mb-4">
				{lang === 'en' ? 
					'You haven\'t added any additional guests yet.' : 
					lang === 'it' ? 
					'Non hai ancora aggiunto ospiti aggiuntivi.' : 
					'您尚未添加任何额外嘉宾。'}
			</p>
		{/if}
		
		{#if canAddPlusOne}
			{#if showPlusOneForm}
				<div class="border rounded-md p-4 bg-gray-50">
					<h3 class="text-sm font-medium mb-2">{translations.addPlusOne[lang]}</h3>
					<div class="flex gap-2">
						<input
							type="text"
							placeholder={translations.name[lang]}
							bind:value={newPlusOneName}
							class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
						/>
						<Button size="sm" on:click={addPlusOne}>
							{translations.add[lang]}
						</Button>
						<Button variant="secondary" size="sm" on:click={() => showPlusOneForm = false}>
							{translations.cancel[lang]}
						</Button>
					</div>
				</div>
			{:else}
				<div class="text-center">
					<Button variant="secondary" on:click={() => showPlusOneForm = true}>
						{translations.addPlusOne[lang]}
					</Button>
				</div>
			{/if}
		{/if}
	</Card>
	
	<!-- Save Button -->
	<div class="flex justify-end">
		<Button 
			disabled={isPastDeadline || invite.locked || isSaving} 
			on:click={saveChanges}
		>
			{isSaving ? translations.saving[lang] : translations.save[lang]}
		</Button>
	</div>
</div>
