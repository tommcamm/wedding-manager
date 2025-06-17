<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'danger' | 'outline';
	type Size = 'sm' | 'md' | 'lg';

	const { variant = 'primary', size = 'md', type = 'button', disabled = false } = $props<{
		variant?: Variant;
		size?: Size;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
	}>();

	const variants = {
		primary: 'bg-blue-600 hover:bg-blue-700 text-white',
		secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
		danger: 'bg-red-600 hover:bg-red-700 text-white',
		outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800'
	};

	const sizes = {
		sm: 'text-xs py-1 px-2',
		md: 'text-sm py-2 px-4',
		lg: 'text-base py-2 px-6'
	};

	const classes = $derived(`
		${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} 
		rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
		${disabled ? 'opacity-50 cursor-not-allowed' : ''}
	`);
</script>

<button type={type} class={classes} disabled={disabled}>
	<slot />
</button>
