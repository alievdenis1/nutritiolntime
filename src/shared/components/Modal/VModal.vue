<template>
	<transition
		name="background"
		@before-enter="disableScroll"
		@after-leave="enableScroll"
		@click="closeModal"
	>
		<div
			v-show="isVisible"
			class="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-end justify-center"
		>
			<transition name="modal">
				<div
					v-show="isVisible"
					class="bg-white p-4 rounded-t-xl width-custom max-w-md relative z-50"
					@click.stop
				>
					<slot />
				</div>
			</transition>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const isVisible = ref(props.show)

watch(() => props.show, (newVal) => {
	isVisible.value = newVal
})

const closeModal = () => {
	isVisible.value = false
	emit('close')
}

const disableScroll = () => {
	document.body.style.overflow = 'hidden'
}

const enableScroll = () => {
	document.body.style.overflow = ''
}
</script>

<style scoped>
.width-custom{
	max-width: 375px;
	width: 100%;
}
</style>