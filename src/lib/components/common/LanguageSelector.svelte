<script lang="ts">
	import { page } from '$app/stores';
	
	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'it', name: 'Italiano' },
		{ code: 'zh', name: '中文' }
	];
	
	// Get current language from URL or default to 'en'
	const currentLang = $derived(
		$page.url.searchParams.get('lang') || 'en'
	);
	
	function handleLanguageChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const lang = select.value;
		
		// Create new URL with updated language parameter
		const url = new URL(window.location.href);
		url.searchParams.set('lang', lang);
		window.location.href = url.toString();
	}
</script>

<div class="language-selector">
	<select 
		value={currentLang} 
		on:change={handleLanguageChange}
		class="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded text-xs"
	>
		{#each languages as lang}
			<option value={lang.code}>{lang.name}</option>
		{/each}
	</select>
</div>
