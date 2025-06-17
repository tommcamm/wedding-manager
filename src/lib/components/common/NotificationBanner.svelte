<script lang="ts">
	type BannerType = 'info' | 'success' | 'warning' | 'error';
	
	const { 
		type = 'info', 
		message = '', 
		showDismiss = true,
		countdown = 0 
	} = $props<{
		type?: BannerType;
		message: string;
		showDismiss?: boolean;
		countdown?: number;
	}>();
	
	let visible = $state(true);
	let countdownText = $state('');
	
	// Colors based on notification type
	const colors = {
		info: 'bg-blue-50 text-blue-800 border-blue-200',
		success: 'bg-green-50 text-green-800 border-green-200',
		warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
		error: 'bg-red-50 text-red-800 border-red-200'
	};
	
	const bannerClass = $derived(`
		${colors[type as keyof typeof colors]} border px-4 py-3 rounded relative
	`);
	
	// Set up countdown if provided
	$effect(() => {
		if (countdown > 0) {
			updateCountdown();
			const interval = setInterval(updateCountdown, 1000);
			return () => clearInterval(interval);
		}
	});
	
	function updateCountdown() {
		const now = new Date();
		const targetDate = new Date(now.getTime() + countdown * 1000);
		
		const diff = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
		
		const days = Math.floor(diff / (24 * 60 * 60));
		const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((diff % (60 * 60)) / 60);
		const seconds = diff % 60;
		
		countdownText = '';
		if (days > 0) countdownText += `${days}d `;
		if (hours > 0) countdownText += `${hours}h `;
		if (minutes > 0) countdownText += `${minutes}m `;
		if (seconds > 0) countdownText += `${seconds}s`;
		
		if (diff === 0) {
			visible = false;
		}
	}
	
	function dismiss() {
		visible = false;
	}
</script>

{#if visible}
	<div class={bannerClass} role="alert">
		<span class="block sm:inline">{message}</span>
		{#if countdown > 0}
			<span class="ml-2 font-semibold">{countdownText}</span>
		{/if}
		{#if showDismiss}
			<button 
				class="absolute top-0 bottom-0 right-0 px-4 py-3" 
				on:click={dismiss}
				aria-label="Dismiss"
			>
				<span class="text-xl">&times;</span>
			</button>
		{/if}
	</div>
{/if}
