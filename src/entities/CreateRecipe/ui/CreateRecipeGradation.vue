<template>
	<div>
		<VAccordion :title="t('spicinessAndDifficulty')">
			<div class="gradation-selector flex flex-col gap-4">
				<div class="gradation-group flex flex-col gap-2">
					<h3 class="text-lg font-semibold">
						{{ t('spiciness') }}
					</h3>
					<div class="gradation-buttons flex gap-2">
						<button
							v-for="level in levels"
							:key="level"
							:class="['py-2 px-4 rounded-lg border', level === spiciness ? 'bg-green-500 text-white' : 'bg-gray-200']"
							@click="selectSpiciness(level)"
						>
							{{ level }}
						</button>
					</div>
					<p class="text-gray-500 text-sm">
						{{ t('spicinessDescription') }}
					</p>
				</div>
				<div class="gradation-group flex flex-col gap-2">
					<h3 class="text-lg font-semibold">
						{{ t('difficulty') }}
					</h3>
					<div class="gradation-buttons flex gap-2">
						<button
							v-for="level in levels"
							:key="level"
							:class="['py-2 px-4 rounded-lg border', level === difficulty ? 'bg-green-500 text-white' : 'bg-gray-200']"
							@click="selectDifficulty(level)"
						>
							{{ level }}
						</button>
					</div>
					<p class="text-gray-500 text-sm">
						{{ t('difficultyDescription') }}
					</p>
				</div>
			</div>
		</VAccordion>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './CreateRecipeGradation.localization.json'

const { t } = useTranslation(localization)

const spiciness = ref(3)
const difficulty = ref(3)
const levels = [1, 2, 3, 4, 5]

const selectSpiciness = (level: number) => {
    spiciness.value = level
}

const selectDifficulty = (level: number) => {
    difficulty.value = level
}
</script>

<style scoped></style>