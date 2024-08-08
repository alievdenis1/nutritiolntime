<template>
	<div class="config-panel mb-4 p-4 bg-gray-100 rounded-lg">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-4">
				<br>
				<span class="text-amber-900">тряска: <span class="text-gray">
					{{ isShaking ? 'есть' : 'никакой' }}</span></span>
				<span class="text-amber-900">мяуканье: <span class="text-gray">
					{{ isShouting ? 'есть' : 'нет' }}</span></span>

				<br>
				<label class="block text-sm font-medium text-gray-700">Порог определения тряски</label>
				<input
					v-model.number="CLICKER_CONFIG.shake.thresholdLow"
					type="number"
					class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
			</div>
			<br>
			<div>
				<label class="block text-sm font-medium text-gray-700">Порог определения мяу</label>
				<input
					v-model.number="CLICKER_CONFIG.sound.thresholdLow"
					type="number"
					step="0.1"
					min="0"
					max="5"
					class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
			</div>

			Какие-то циферки: <br>
			{{ store.currency }} <br>
			{{ store.energyCurrent }} <br>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CLICKER_CONFIG } from '../config/clickerConfig'
import { useCatClickerStore } from '../model/cat-clicker-store'
import { storeToRefs } from 'pinia'

const store = useCatClickerStore()
const { isShouting, isShaking } = storeToRefs(store)
</script>

<style scoped></style>