<template>
	<div class="accordion">
		<button
			class="accordion-header"
			@click="toggle"
		>
			{{ title }}
			<IconArrow
				:class="{ 'rotate-180': isOpen }"
				icon-color="#000000"
				:icon-width="20"
				:icon-height="20"
			/>
		</button>
		<div
			ref="content"
			class="accordion-content"
			:style="contentStyle"
		>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IconArrow } from '@/shared/components/Icon'

defineProps<{
	title: string;
}>()

const isOpen = ref(false)
const content = ref<HTMLElement | null>(null)

const contentStyle = computed(() => ({
	maxHeight: isOpen.value ? `${content.value?.scrollHeight}px` : '0',
}))

const toggle = () => {
	isOpen.value = !isOpen.value
}

watch(isOpen, (newVal) => {
	if (newVal) {
		content.value?.style.setProperty('max-height', `${content.value.scrollHeight}px`)
	} else {
		content.value?.style.setProperty('max-height', '0')
	}
})
</script>

<style scoped>
.accordion {
	border: 1px solid #1C1C1C0D;
	border-radius: 16px;
}

.accordion-header {
	padding: 16px;
	cursor: pointer;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.accordion-content {
	overflow: hidden;
	transition: max-height 0.3s ease;
}

.rotate-180 {
	transform: rotate(180deg);
}
</style>