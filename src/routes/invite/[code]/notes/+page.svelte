<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	
	// Get data from server (would normally be passed through the +page.server.ts)
	const data = $page.data;
	const invite = data.invite;
	const guests = data.guests;
	const settings = data.settings;
	const lang = data.lang as 'en' | 'it' | 'zh';
	
	// State for message form
	let message = $state(invite.notes || '');
	let isSaving = $state(false);
	let saveSuccess = $state(false);
	let saveError = $state('');
	
	// Translations
	const translations = {
		title: {
			en: 'Message to the Couple',
			it: 'Messaggio agli Sposi',
			zh: '给新人的留言'
		},
		subtitle: {
			en: 'Leave a personal message or note to the couple',
			it: 'Lascia un messaggio personale o una nota alla coppia',
			zh: '给新人留下个人留言或祝福'
		},
		messageLabel: {
			en: 'Your Message',
			it: 'Il tuo Messaggio',
			zh: '您的留言'
		},
		messagePlaceholder: {
			en: 'Write your wishes, congratulations or any message you would like to share with the couple...',
			it: 'Scrivi i tuoi auguri, congratulazioni o qualsiasi messaggio che vorresti condividere con la coppia...',
			zh: '写下您的祝福、恭喜或任何您想与新人分享的信息...'
		},
		save: {
			en: 'Save Message',
			it: 'Salva Messaggio',
			zh: '保存留言'
		},
		saving: {
			en: 'Saving...',
			it: 'Salvataggio...',
			zh: '保存中...'
		},
		success: {
			en: 'Your message has been saved successfully! Thank you for your kind words.',
			it: 'Il tuo messaggio è stato salvato con successo! Grazie per le tue gentili parole.',
			zh: '您的留言已成功保存！感谢您的美好祝福。'
		},
		backToInvite: {
			en: 'Back to Invitation',
			it: 'Torna all\'Invito',
			zh: '返回邀请函'
		}
	};
	
	// Save message
	async function saveMessage() {
		if (!message.trim()) return;
		
		isSaving = true;
		saveError = '';
		saveSuccess = false;
		
		try {
			// In a real app, this would be an API call
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Update the invite notes
			invite.notes = message.trim();
			
			// Success!
			saveSuccess = true;
			
			// Navigate back to invitation page after a delay
			setTimeout(() => {
				goto(`/invite/${invite.code}`);
			}, 2500);
		} catch (error) {
			saveError = 'An error occurred while saving your message. Please try again.';
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
	
	<!-- Message Form -->
	<Card>
		<div class="space-y-4">
			<div>
				<label for="message" class="block text-sm font-medium text-gray-700 mb-1">
					{translations.messageLabel[lang]}
				</label>
				<textarea
					id="message"
					bind:value={message}
					placeholder={translations.messagePlaceholder[lang]}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					rows={6}
				></textarea>
			</div>
			
			<div class="flex justify-end">
				<Button 
					disabled={!message.trim() || isSaving} 
					on:click={saveMessage}
				>
					{isSaving ? translations.saving[lang] : translations.save[lang]}
				</Button>
			</div>
		</div>
	</Card>
	
	<!-- Message Inspiration -->
	<Card title={lang === 'en' ? 'Message Ideas' : lang === 'it' ? 'Idee per il Messaggio' : '留言灵感'}>
		<div class="space-y-4">
			<p class="text-gray-700">
				{lang === 'en' ? 
					'Not sure what to write? Here are some ideas:' : 
					lang === 'it' ? 
					'Non sei sicuro di cosa scrivere? Ecco alcune idee:' : 
					'不确定写什么？这里有一些想法：'}
			</p>
			
			<ul class="list-disc pl-5 space-y-2 text-gray-700">
				<li>
					{lang === 'en' ? 
						'Share a memory you have with the couple' : 
						lang === 'it' ? 
						'Condividi un ricordo che hai con la coppia' : 
						'分享您与新人的回忆'}
				</li>
				<li>
					{lang === 'en' ? 
						'Offer your congratulations and well wishes' : 
						lang === 'it' ? 
						'Offri le tue congratulazioni e auguri' : 
						'表达您的祝贺和美好祝愿'}
				</li>
				<li>
					{lang === 'en' ? 
						'Share advice for a happy marriage' : 
						lang === 'it' ? 
						'Condividi consigli per un matrimonio felice' : 
						'分享幸福婚姻的建议'}
				</li>
				<li>
					{lang === 'en' ? 
						'Tell them how excited you are to celebrate with them' : 
						lang === 'it' ? 
						'Dì loro quanto sei emozionato di festeggiare con loro' : 
						'告诉他们您多么期待与他们一起庆祝'}
				</li>
			</ul>
		</div>
	</Card>
</div>
