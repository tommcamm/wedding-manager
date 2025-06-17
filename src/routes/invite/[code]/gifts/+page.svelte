<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import type { GiftRegistryItem } from '$lib/stores/mockSettings';
	import type { Guest } from '$lib/stores/mockGuests';
	
	// Get data from server (would normally be passed through the +page.server.ts)
	const data = $page.data;
	const invite = data.invite;
	const guests = data.guests;
	const settings = data.settings;
	const lang = data.lang as 'en' | 'it' | 'zh';
	
	// Get gift registry settings
	const giftRegistry = settings.giftRegistry;
	
	// State for reserving gifts
	let selectedGiftId = $state('');
	let isReserving = $state(false);
	let reserveSuccess = $state(false);
	let reserveError = $state('');
	
	// Find first attending guest to use for reservations
	const attendingGuest = guests.find((g: Guest) => g.attending === true);
	
	// Translations
	const translations = {
		title: {
			en: 'Gift Registry',
			it: 'Lista Regali',
			zh: '礼品登记处'
		},
		subtitle: {
			en: 'Choose a gift to help us start our new life together',
			it: 'Scegli un regalo per aiutarci a iniziare la nostra nuova vita insieme',
			zh: '选择一份礼物，帮助我们开始新的生活'
		},
		cash: {
			en: 'Cash Gift Options',
			it: 'Opzioni Regalo in Denaro',
			zh: '现金礼品选项'
		},
		noGifts: {
			en: 'The couple has not registered for any gifts yet.',
			it: 'La coppia non ha ancora registrato alcun regalo.',
			zh: '新人尚未登记任何礼品。'
		},
		price: {
			en: 'Price',
			it: 'Prezzo',
			zh: '价格'
		},
		reserved: {
			en: 'Reserved',
			it: 'Riservato',
			zh: '已预订'
		},
		available: {
			en: 'Available',
			it: 'Disponibile',
			zh: '可用'
		},
		reserve: {
			en: 'Reserve',
			it: 'Riserva',
			zh: '预订'
		},
		reserving: {
			en: 'Reserving...',
			it: 'Prenotazione...',
			zh: '预订中...'
		},
		confirmReserve: {
			en: 'Are you sure you want to reserve this gift?',
			it: 'Sei sicuro di voler riservare questo regalo?',
			zh: '您确定要预订这份礼物吗？'
		},
		confirm: {
			en: 'Confirm',
			it: 'Conferma',
			zh: '确认'
		},
		cancel: {
			en: 'Cancel',
			it: 'Annulla',
			zh: '取消'
		},
		successReserve: {
			en: 'Gift reserved successfully! Thank you for your generosity.',
			it: 'Regalo riservato con successo! Grazie per la tua generosità.',
			zh: '礼物预订成功！感谢您的慷慨。'
		},
		cashGiftMessage: {
			en: 'If you prefer to give a cash gift, we have the following options:',
			it: 'Se preferisci fare un regalo in denaro, abbiamo le seguenti opzioni:',
			zh: '如果您更喜欢给予现金礼物，我们有以下选项：'
		},
		backToInvite: {
			en: 'Back to Invitation',
			it: 'Torna all\'Invito',
			zh: '返回邀请函'
		}
	};
	
	// Format currency
	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}
	
	// Reserve a gift
	async function reserveGift(giftId: string) {
		if (!attendingGuest) return;
		
		isReserving = true;
		reserveError = '';
		reserveSuccess = false;
		
		try {
			// In a real app, this would be an API call
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Update the local state to mark the gift as reserved
			const updatedItems = giftRegistry.items.map((item: GiftRegistryItem) => 
				item.id === giftId 
					? { ...item, isReserved: true, reservedBy: attendingGuest.id }
					: item
			);
			
			// Update the registry
			giftRegistry.items = updatedItems;
			
			// Success!
			reserveSuccess = true;
			selectedGiftId = '';
			
		} catch (error) {
			reserveError = 'An error occurred while reserving the gift. Please try again.';
		} finally {
			isReserving = false;
		}
	}
	
	// Start the reservation process
	function startReservation(giftId: string) {
		if (!attendingGuest) {
			reserveError = lang === 'en' 
				? 'You must confirm your attendance before reserving a gift.' 
				: lang === 'it'
				? 'Devi confermare la tua partecipazione prima di riservare un regalo.'
				: '预订礼物前，您必须确认出席。';
			return;
		}
		
		selectedGiftId = giftId;
	}
	
	// Cancel reservation
	function cancelReservation() {
		selectedGiftId = '';
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
	
	{#if reserveSuccess}
		<NotificationBanner
			type="success"
			message={translations.successReserve[lang]}
			showDismiss={true}
		/>
	{/if}
	
	{#if reserveError}
		<NotificationBanner
			type="error"
			message={reserveError}
			showDismiss={true}
		/>
	{/if}
	
	<!-- Gift Registry Items -->
	{#if giftRegistry.enabled && giftRegistry.items.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each giftRegistry.items as item}
				<Card>
					<div class="space-y-4">
						{#if item.imageUrl}
							<img 
								src={item.imageUrl} 
								alt={item.name} 
								class="w-full h-48 object-cover rounded-md"
							/>
						{:else}
							<div class="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
								<span class="text-gray-500">No Image</span>
							</div>
						{/if}
						
						<div>
							<h3 class="text-lg font-medium">{item.name}</h3>
							<p class="text-gray-600 text-sm mt-1">{item.description}</p>
						</div>
						
						<div class="flex justify-between items-center">
							<span class="font-medium">
								{translations.price[lang]}: {formatCurrency(item.price)}
							</span>
							
							{#if item.isReserved}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									{translations.reserved[lang]}
								</span>
							{:else}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{translations.available[lang]}
								</span>
							{/if}
						</div>
						
						{#if !item.isReserved}
							<div class="pt-2">
								<Button 
									variant="secondary" 
									on:click={() => startReservation(item.id)}
									disabled={isReserving || !attendingGuest}
								>
									{translations.reserve[lang]}
								</Button>
							</div>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	{:else if giftRegistry.enabled}
		<Card>
			<div class="text-center py-8 text-gray-500">
				<p>{translations.noGifts[lang]}</p>
			</div>
		</Card>
	{/if}
	
	<!-- Cash Gift Options -->
	{#if giftRegistry.cashGiftOptions.enabled}
		<Card title={translations.cash[lang]}>
			<p class="text-gray-700 mb-6">{giftRegistry.cashGiftOptions.message}</p>
			
			<div class="space-y-4">
				{#each giftRegistry.cashGiftOptions.paymentLinks as link}
					<div class="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
						<span class="font-medium">{link.name}</span>
						<a href={link.url} target="_blank" rel="noopener noreferrer">
							<Button variant="secondary" size="sm">
								{lang === 'en' ? 'Open Link' : lang === 'it' ? 'Apri Link' : '打开链接'}
							</Button>
						</a>
					</div>
				{/each}
			</div>
		</Card>
	{/if}
	
	<!-- Reservation Confirmation Modal -->
	{#if selectedGiftId}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg p-6 max-w-md w-full">
				<h3 class="text-lg font-medium mb-4">{translations.confirmReserve[lang]}</h3>
				
				<p class="text-gray-600 mb-6">
					{lang === 'en' 
						? 'This will mark the gift as reserved by you.' 
						: lang === 'it' 
						? 'Questo contrassegnerà il regalo come riservato da te.' 
						: '这将标记礼物为您预订。'}
				</p>
				
				<div class="flex justify-end space-x-3">
					<Button variant="secondary" on:click={cancelReservation}>
						{translations.cancel[lang]}
					</Button>
					<Button on:click={() => reserveGift(selectedGiftId)} disabled={isReserving}>
						{isReserving ? translations.reserving[lang] : translations.confirm[lang]}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
