<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
	<Header />
	
	<main class="flex-grow container mx-auto px-4 py-8">
		{@render children()}
	</main>
	
	<Footer />
</div>
