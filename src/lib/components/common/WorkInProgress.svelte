<script lang="ts">
	import Card from './Card.svelte';
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 px-4"
>
	<div class="w-full max-w-2xl">
		<Card class="px-8 py-12 text-center">
			<div class="mb-8">
				<h1 class="mb-4 text-5xl font-bold text-blue-600">Samantha & Tommaso</h1>
				<div class="mb-2 text-2xl text-gray-700">are getting married in</div>
				<div class="mb-8 text-3xl font-semibold text-pink-600">June 2025</div>
			</div>

			<div class="space-y-4 text-lg text-gray-600">
				<p>Our wedding website is currently under construction</p>
				<p class="font-medium text-blue-700">We'll notify you when it's completed!</p>
			</div>

			<div class="mt-12 text-sm text-gray-500">
				<p>Thank you for your patience ❤️</p>
			</div>
		</Card>
	</div>
</div>
