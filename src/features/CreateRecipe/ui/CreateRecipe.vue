<template>
	<button
		class="text-[#735F2B] font-bold cursor-pointer self-start opacity-70 mb-5"
		@click="router.push('/')"
	>
		&lt; Назад
	</button>
	<form class="flex flex-col gap-7 mb-6">
		<img
			src="/image/placeholder.png"
			alt="New recipe"
			width="347"
			class="max-h-[167px]"
		>
		<div class="flex flex-col gap-4">
			<div class="form-element">
				<span class="form-element-title">
					{{ t('cuisine') }}
				</span>

				/>
			</div>

			<div class="form-element">
				<span class="form-element-title">
					{{ t('calories') }}
				</span>
			</div>

			<div class="form-element">
				<span class="form-element-title">
					{{ t('chooseProducts') }}
				</span>
			</div>
			<div class="form-element">
				<span class="form-element-title">
					{{ t('excludeProducts') }}
				</span>
				<div>
					<div class="form-element">
						<span class="form-element-title">
							{{ t('time') }}
						</span>
					</div>

					<div class="form-element">
						<span class="form-element-title">
							{{ t('cookingMethod') }}
						</span>
					</div>

					<div class="form-element">
						<span class="form-element-title">
							{{ t('spiciness') }}
						</span>
					</div>

					<div class="form-element">
						<span class="form-element-title">
							{{ t('difficulty') }}
						</span>
					</div>

					<div class="flex flex-col items-center">
						<v-button
							class="create-button mb-[12px]"
							@click="router.push('/create-recipe-gpt')"
						>
							{{ t('createAi') }}
						</v-button>

						<v-button
							class="create-button"
							@click="router.push('/create-recipe-manual')"
						>
							{{ t('createManually') }}
						</v-button>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Localization from './CreateRecipe.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const router = useRouter()
// const time = ref(0)
// const spiciness = ref(0)
// const difficulty = ref(0)
const cookingMethods = ref([])

watch(cookingMethods, () => {
	console.log(cookingMethods)
}, { deep: true })
//
// const forges = [
// 	{ id:1, name: 'Italian Cuisine' },
// 	{ id:2, name: 'Georgian cuisine' },
// 	{ id:3, name: 'Italian Cuisine' },
// 	{ id:4, name: 'Georgian cuisine' },
// 	{ id:5, name: 'Italian Cuisine' },
// 	{ id:6, name: 'Georgian cuisine' },
// ]
//
// const calories = [
// 	{ id:1, count: 50 },
// 	{ id:2, count: 60 },
// 	{ id:3, count: 70 },
// 	{ id:4, count: 50 },
// 	{ id:5, count: 60 },
// 	{ id:6, count: 70 },
// ]
//
// const products = [
// 	{ id:1, name: 'Milk' },
// 	{ id:2, name: 'Milk' },
// 	{ id:3, name: 'Milk' },
// 	{ id:4, name: 'Milk' },
// 	{ id:5, name: 'Milk' },
// 	{ id:6, name: 'Milk' },
// ]
//
// const marks = reactive({
//   15: '15min',
//   30: '30min',
//   45: '45min',
//   60: '60min',
//   75: '75min'
// })
</script>

<style lang="scss" scoped>
.form-element-title {
	@apply text-[#AB9F80] text-[15px] leading-[94.95%]
}

.form-element {
	@apply flex flex-col gap-[12px]
}

.create-button {
	@apply text-[20px] leading-[110%] font-medium w-[235px] h-[54px] flex items-center justify-center
	bg-[#735F2B] rounded-[40px] text-white cursor-pointer
}

.scroll-hide::-webkit-scrollbar {
	display: none;
}

.scroll-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>