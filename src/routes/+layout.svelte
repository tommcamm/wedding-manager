<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import WorkInProgress from '$lib/components/common/WorkInProgress.svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	// Check if current route is an admin route
	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));

	// Show work in progress page if preview mode is on and not an admin route
	const showWorkInProgress = $derived(data?.previewMode && !isAdminRoute);
</script>

{#if showWorkInProgress}
	<WorkInProgress />
{:else}
	<div class="flex min-h-screen flex-col">
		<Header />

		<main class="container mx-auto flex-grow px-4 py-8">
			{@render children()}
		</main>

		<Footer />
	</div>
{/if}
