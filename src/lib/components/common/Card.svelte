<script lang="ts">
	const { title = '', padded = true, class: className = '' } = $props<{
		title?: string;
		padded?: boolean;
		class?: string;
	}>();

	const classes = $derived(`
		bg-white shadow rounded-lg overflow-hidden
		${className}
	`);

	const contentClasses = $derived(`
		${padded ? 'p-4' : ''}
	`);
</script>

<div class={classes}>
	{#if title}
		<div class="border-b px-4 py-3">
			<h3 class="text-lg font-medium text-gray-800">{title}</h3>
		</div>
	{/if}
	<div class={contentClasses}>
		<slot />
	</div>
</div>
