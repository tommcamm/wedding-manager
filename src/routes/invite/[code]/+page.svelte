<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import NotificationBanner from '$lib/components/common/NotificationBanner.svelte';
	import type { Guest } from '$lib/stores/mockGuests';
	
	// Get data from server
	const data = $page.data;
	const invite = data.invite;
	const guests = data.guests;
	const settings = data.settings;
	const isPastDeadline = data.isPastDeadline;
	const lang = data.lang as 'en' | 'it' | 'zh';
	
	// Format date helper
	function formatDate(date: Date) {
		return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang === 'it' ? 'it-IT' : 'zh-CN', { 
			weekday: 'long',
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		}).format(new Date(date));
	}
	
	// Count responses
	const acceptedCount = guests.filter((g: Guest) => g.attending === true).length;
	const declinedCount = guests.filter((g: Guest) => g.attending === false).length;
	const pendingCount = guests.filter((g: Guest) => g.attending === null).length;
	
	// Greeting translations
	const greetings = {
		en: `Dear ${invite.familyName}`,
		it: `Cara famiglia ${invite.familyName}`,
		zh: `亲爱的 ${invite.familyName}`
	};
	
	const titles = {
		en: 'You Are Invited!',
		it: 'Sei Invitato!',
		zh: '邀请函'
	};
	
	const joinTexts = {
		en: 'We would be delighted to have you join us for our wedding celebration.',
		it: 'Saremmo lieti di averti con noi per festeggiare il nostro matrimonio.',
		zh: '我们诚挚地邀请您参加我们的婚礼庆典。'
	};
	
	const deadlineTexts = {
		en: `Please RSVP by ${formatDate(invite.rsvpDeadline)}`,
		it: `Si prega di rispondere entro il ${formatDate(invite.rsvpDeadline)}`,
		zh: `请在 ${formatDate(invite.rsvpDeadline)} 前回复`
	};
	
	const deadlinePassedTexts = {
		en: 'The RSVP deadline has passed. Please contact the couple directly for any changes.',
		it: 'La scadenza per la conferma è passata. Si prega di contattare direttamente la coppia per eventuali modifiche.',
		zh: '回复截止日期已过。如需更改，请直接联系新婚夫妇。'
	};
</script>

<div class="space-y-8">
	<!-- Deadline Banner -->
	{#if isPastDeadline || invite.locked}
		<NotificationBanner
			type="warning"
			message={deadlinePassedTexts[lang]}
			showDismiss={false}
		/>
	{:else}
		<NotificationBanner
			type="info"
			message={deadlineTexts[lang]}
			showDismiss={false}
		/>
	{/if}
	
	<!-- Invitation Header -->
	<div class="text-center">
		<h1 class="text-3xl font-bold text-blue-600 mb-3">{titles[lang]}</h1>
		<p class="text-xl mb-2">{greetings[lang]},</p>
		<p class="text-lg mb-6">{joinTexts[lang]}</p>
		
		<div class="mb-8">
			<p class="text-2xl font-semibold mb-2">Tommy & Sammy</p>
			<p class="text-xl">{formatDate(settings.wedding.date)}</p>
			<p class="text-lg mt-2">
				{settings.wedding.timeStart} - {settings.wedding.timeEnd}<br>
				{settings.wedding.venue}<br>
				{settings.wedding.address}
			</p>
		</div>
	</div>
	
	<!-- Invitation Code -->
	<Card title={lang === 'en' ? 'Your Invitation' : lang === 'it' ? 'Il tuo invito' : '您的邀请函'}>
		<div class="text-center">
			<p class="text-sm text-gray-600 mb-2">
				{lang === 'en' ? 'Invitation Code' : lang === 'it' ? 'Codice Invito' : '邀请码'}
			</p>
			<p class="text-2xl font-mono font-bold tracking-widest mb-4">{invite.code}</p>
			
			<div class="grid grid-cols-3 gap-4 text-center">
				<div>
					<div class="text-3xl font-bold text-green-600">{acceptedCount}</div>
					<div class="text-sm text-gray-600">
						{lang === 'en' ? 'Accepted' : lang === 'it' ? 'Accettato' : '已接受'}
					</div>
				</div>
				
				<div>
					<div class="text-3xl font-bold text-red-600">{declinedCount}</div>
					<div class="text-sm text-gray-600">
						{lang === 'en' ? 'Declined' : lang === 'it' ? 'Rifiutato' : '已拒绝'}
					</div>
				</div>
				
				<div>
					<div class="text-3xl font-bold text-gray-600">{pendingCount}</div>
					<div class="text-sm text-gray-600">
						{lang === 'en' ? 'Pending' : lang === 'it' ? 'In attesa' : '待定'}
					</div>
				</div>
			</div>
		</div>
	</Card>
	
	<!-- Guest List -->
	<Card title={lang === 'en' ? 'Guest List' : lang === 'it' ? 'Lista Invitati' : '来宾名单'}>
		<ul class="divide-y divide-gray-200">
			{#each guests as guest}
				<li class="py-3 flex justify-between items-center">
					<div>
						<p class="font-medium">{guest.name}</p>
						<p class="text-sm text-gray-600">
							{guest.isPlusOne ? 
								(lang === 'en' ? 'Plus One' : lang === 'it' ? 'Accompagnatore' : '额外嘉宾') : 
								(lang === 'en' ? 'Named Guest' : lang === 'it' ? 'Ospite Nominato' : '指定嘉宾')}
						</p>
					</div>
					<div>
						{#if guest.attending === true}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
								{lang === 'en' ? 'Attending' : lang === 'it' ? 'Partecipa' : '参加'}
							</span>
						{:else if guest.attending === false}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
								{lang === 'en' ? 'Not Attending' : lang === 'it' ? 'Non Partecipa' : '不参加'}
							</span>
						{:else}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
								{lang === 'en' ? 'No Response' : lang === 'it' ? 'Nessuna Risposta' : '未回复'}
							</span>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
		
		<div class="mt-4 text-center">
			<a href={`/invite/${invite.code}/rsvp`}>
				<Button disabled={isPastDeadline || invite.locked}>
					{lang === 'en' ? 'Update RSVP' : lang === 'it' ? 'Aggiorna RSVP' : '更新回复'}
				</Button>
			</a>
		</div>
	</Card>
	
	<!-- Options -->
	<div class="grid md:grid-cols-3 gap-4">
		<Card title={lang === 'en' ? 'Dietary Needs' : lang === 'it' ? 'Esigenze Dietetiche' : '饮食需求'}>
			<p class="text-gray-700 mb-4">
				{lang === 'en' ? 
					'Let us know about any dietary restrictions or allergies.' : 
					lang === 'it' ? 
					'Fateci sapere di eventuali restrizioni dietetiche o allergie.' : 
					'请告知我们您的任何饮食限制或过敏情况。'}
			</p>
			<div class="text-center">
				<a href={`/invite/${invite.code}/dietary`}>
					<Button variant="secondary" disabled={isPastDeadline || invite.locked}>
						{lang === 'en' ? 'Dietary Preferences' : lang === 'it' ? 'Preferenze Dietetiche' : '饮食偏好'}
					</Button>
				</a>
			</div>
		</Card>
		
		<Card title={lang === 'en' ? 'Gift Registry' : lang === 'it' ? 'Lista Regali' : '礼品登记处'}>
			<p class="text-gray-700 mb-4">
				{lang === 'en' ? 
					'Browse our gift registry or contribute to our honeymoon fund.' : 
					lang === 'it' ? 
					'Sfoglia la nostra lista regali o contribuisci al nostro fondo per la luna di miele.' : 
					'浏览我们的礼品登记处或为我们的蜜月基金做出贡献。'}
			</p>
			<div class="text-center">
				<a href={`/invite/${invite.code}/gifts`}>
					<Button variant="secondary">
						{lang === 'en' ? 'View Gifts' : lang === 'it' ? 'Visualizza Regali' : '查看礼品'}
					</Button>
				</a>
			</div>
		</Card>
		
		<Card title={lang === 'en' ? 'Message to Couple' : lang === 'it' ? 'Messaggio agli Sposi' : '给新人的留言'}>
			<p class="text-gray-700 mb-4">
				{lang === 'en' ? 
					'Send a personal message or note to the happy couple.' : 
					lang === 'it' ? 
					'Invia un messaggio personale o una nota alla coppia felice.' : 
					'向新婚夫妇发送个人留言或祝福。'}
			</p>
			<div class="text-center">
				<a href={`/invite/${invite.code}/notes`}>
					<Button variant="secondary">
						{lang === 'en' ? 'Leave a Note' : lang === 'it' ? 'Lascia un Messaggio' : '留言'}
					</Button>
				</a>
			</div>
		</Card>
	</div>
</div>
