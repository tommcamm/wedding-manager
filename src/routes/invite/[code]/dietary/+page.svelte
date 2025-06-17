<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import type { Guest, DietaryRestriction } from '$lib/stores/mockGuests';
	
	// Get data from server (would normally be passed through the +page.server.ts)
	const data = $page.data;
	const invite = data.invite;
	const allGuests = data.guests;
	const settings = data.settings;
	const isPastDeadline = data.isPastDeadline;
	const lang = data.lang as 'en' | 'it' | 'zh';
	
	// Only show attending guests
	const attendingGuests = $state(allGuests.filter((g: Guest) => g.attending === true));
	
	// Form saving state
	let isSaving = $state(false);
	let saveSuccess = $state(false);
	let saveError = $state('');
	
	// Diet options
	const dietaryOptions: { value: DietaryRestriction; label: { en: string; it: string; zh: string } }[] = [
		{
			value: 'vegetarian',
			label: {
				en: 'Vegetarian',
				it: 'Vegetariano',
				zh: '素食'
			}
		},
		{
			value: 'vegan',
			label: {
				en: 'Vegan',
				it: 'Vegano',
				zh: '纯素食'
			}
		},
		{
			value: 'gluten-free',
			label: {
				en: 'Gluten-Free',
				it: 'Senza Glutine',
				zh: '无麸质'
			}
		},
		{
			value: 'dairy-free',
			label: {
				en: 'Dairy-Free',
				it: 'Senza Latticini',
				zh: '无乳制品'
			}
		},
		{
			value: 'nut-allergy',
			label: {
				en: 'Nut Allergy',
				it: 'Allergia alle Noci',
				zh: '坚果过敏'
			}
		},
		{
			value: 'shellfish-allergy',
			label: {
				en: 'Shellfish Allergy',
				it: 'Allergia ai Crostacei',
				zh: '贝类过敏'
			}
		},
		{
			value: 'other',
			label: {
				en: 'Other',
				it: 'Altro',
				zh: '其他'
			}
		}
	];
	
	// Translations
	const translations = {
		title: {
			en: 'Dietary Preferences',
			it: 'Preferenze Dietetiche',
			zh: '饮食偏好'
		},
		subtitle: {
			en: 'Let us know about any dietary requirements for attending guests',
			it: 'Fateci sapere eventuali esigenze dietetiche per gli ospiti che partecipano',
			zh: '请告知参加的客人的任何饮食要求'
		},
		noneAttending: {
			en: 'No guests have confirmed attendance yet.',
			it: 'Nessun ospite ha ancora confermato la partecipazione.',
			zh: '还没有客人确认出席。'
		},
		otherNotes: {
			en: 'Additional Notes',
			it: 'Note Aggiuntive',
			zh: '其他说明'
		},
		otherNotesPlaceholder: {
			en: 'Please provide details about any other dietary needs or allergies...',
			it: 'Si prega di fornire dettagli su eventuali altre esigenze dietetiche o allergie...',
			zh: '请提供有关任何其他饮食需求或过敏症的详情...'
		},
		save: {
			en: 'Save Preferences',
			it: 'Salva Preferenze',
			zh: '保存偏好'
		},
		saving: {
			en: 'Saving...',
			it: 'Salvataggio...',
			zh: '保存中...'
		},
		success: {
			en: 'Dietary preferences saved successfully!',
			it: 'Preferenze dietetiche salvate con successo!',
			zh: '饮食偏好已成功保存！'
		},
		backToInvite: {
			en: 'Back to Invitation',
			it: 'Torna all\'Invito',
			zh: '返回邀请函'
		}
	};
	
	// Toggle a dietary restriction for a guest
	function toggleDietaryRestriction(guest: Guest, restriction: DietaryRestriction) {
		const index = guest.dietaryRestrictions.indexOf(restriction);
		
		if (index === -1) {
			// Add restriction
			guest.dietaryRestrictions = [...guest.dietaryRestrictions, restriction];
		} else {
			// Remove restriction
			guest.dietaryRestrictions = guest.dietaryRestrictions.filter(r => r !== restriction);
		}
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
			saveError = 'An error occurred while saving dietary preferences. Please try again.';
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="space-y-8">
	<!-- Page Title -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-800">{translations.title[lang]}</h1>
			<p class="text-gray-600 mt-1">{translations.subtitle[lang]}</p>
		</div>
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
	
	{#if attendingGuests.length === 0}
		<Card>
			<div class="text-center py-8 text-gray-500">
				<p>{translations.noneAttending[lang]}</p>
				<div class="mt-4">
					<a href={`/invite/${invite.code}/rsvp`}>
						<Button>
							{lang === 'en' ? 'Update RSVP' : lang === 'it' ? 'Aggiorna RSVP' : '更新回复'}
						</Button>
					</a>
				</div>
			</div>
		</Card>
	{:else}
		<!-- Attending Guests Dietary Preferences -->
		{#each attendingGuests as guest}
			<Card title={guest.name}>
				<div class="space-y-4">
					<!-- Dietary restrictions checkboxes -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
						{#each dietaryOptions as option}
							<label class="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={guest.dietaryRestrictions.includes(option.value)}
									disabled={isPastDeadline || invite.locked}
									on:change={() => toggleDietaryRestriction(guest, option.value)}
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<span>{option.label[lang]}</span>
							</label>
						{/each}
					</div>
					
					<!-- Other notes textarea -->
					{#if guest.dietaryRestrictions.includes('other')}
						<div>
							<label for={`notes-${guest.id}`} class="block text-sm font-medium text-gray-700 mb-1">
								{translations.otherNotes[lang]}
							</label>
							<textarea
								id={`notes-${guest.id}`}
								bind:value={guest.otherDietaryNotes}
								disabled={isPastDeadline || invite.locked}
								placeholder={translations.otherNotesPlaceholder[lang]}
								class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
								rows={3}
							></textarea>
						</div>
					{/if}
				</div>
			</Card>
		{/each}
		
		<!-- Save Button -->
		<div class="flex justify-end">
			<Button 
				disabled={isPastDeadline || invite.locked || isSaving} 
				on:click={saveChanges}
			>
				{isSaving ? translations.saving[lang] : translations.save[lang]}
			</Button>
		</div>
	{/if}
</div>
