<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-100 py-8 mt-12">
	<div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-between items-center">
			<div class="mb-4 md:mb-0">
				<p class="text-gray-600 text-sm">
					&copy; {currentYear} Tommy & Sammy Wedding
				</p>
			</div>
			
			<div class="flex space-x-6">
				<a href="/" class="text-gray-600 hover:text-blue-600 text-sm">
					Home
				</a>
				<a href="/admin/login" class="text-gray-600 hover:text-blue-600 text-sm">
					Admin
				</a>
				<a href="#" class="text-gray-600 hover:text-blue-600 text-sm">
					Privacy Policy
				</a>
			</div>
		</div>
	</div>
</footer>
