<template>
	<svg
		:width="iconWidth"
		:height="iconHeight"
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M10 15 L20 25 L30 15"
			:stroke="iconColor"
			stroke-width="5"
			fill="none"
		/>
	</svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	iconColor: string,
	iconWidth: number,
	iconHeight: number,
}>(), {
	iconColor: '#ffffff',
	iconWidth: 12,
	iconHeight: 15,
})
</script>

<style scoped></style>