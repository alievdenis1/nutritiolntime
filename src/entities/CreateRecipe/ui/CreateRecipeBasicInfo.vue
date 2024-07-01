<template>
	<VAccordion :title="t('basicInformation')">
		<div class="recipe-form p-4">
			<div :class="['photo-upload mb-[8px]', { 'p-[8px]': uploadedImage, 'p-[24px]': !uploadedImage }]">
				<div
					v-if="uploadedImage"
					class="flex gap-[8px] items-center justify-center"
				>
					<img
						:src="uploadedImage"
						alt="Uploaded Photo"
						class="w-[54px] h-[54px] object-cover rounded"
					>
					<button
						class="p-2"
						@click.stop.prevent="removeImage"
					>
						<IconClose icon-color="#9F9FA0" />
					</button>
				</div>
				<label
					v-else
					class="photo-upload-label"
				>
					<input
						type="file"
						class="photo-upload-input"
						@change="handleFileUpload"
					>
					<div class="photo-upload-content flex items-center gap-2">
						<IconPhoto />
						<span class="text-xs">{{ t('uploadMainPhoto') }}</span>
					</div>
				</label>
			</div>
			<p class="text-xs text-gray-500 max-w-xs mb-[24px]">
				{{ t('additionalPhotosInfo') }}
			</p>
			<div class="form-section flex flex-col gap-4">
				<input
					v-model="recipeTitle"
					type="text"
					:placeholder="t('recipeTitlePlaceholder')"
					class="border rounded px-2 py-4 text-base"
				>
				<textarea
					v-model="recipeDescription"
					:placeholder="t('recipeDescriptionPlaceholder')"
					class="border rounded px-2 py-4 text-base min-h-[122px]"
				/>
			</div>

			<div class="category-selection flex flex-col gap-[12px] mt-[12px]">
				<div
					class="border rounded px-2 py-4 cursor-pointer flex justify-between items-center text-gray"
					@click="openCategoryModal('category')"
				>
					{{ t('dishCategory') }}
					<IconArrowRight icon-color="#1C1C1C" />
				</div>
				<div
					class="border rounded px-2 py-4 cursor-pointer flex justify-between items-center text-gray"
					@click="openCategoryModal('cuisine')"
				>
					{{ t('cuisineNationality') }}
					<IconArrowRight icon-color="#1C1C1C" />
				</div>
				<div
					class="border rounded px-2 py-4 cursor-pointer flex justify-between items-center text-gray"
					@click="openCategoryModal('diet')"
				>
					{{ t('dietType') }}
					<IconArrowRight icon-color="#1C1C1C" />
				</div>
			</div>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { IconArrowRight, IconPhoto, IconClose } from '@/shared/components/Icon'
import { VAccordion } from '@/shared/components/Accordion'
import localization from './CreateRecipeBasicInfo.localization.json'

const { t } = useTranslation(localization)

const recipeTitle = ref('')
const recipeDescription = ref('')
const uploadedImage = ref<string | null>(null)

const handleFileUpload = (event: Event) => {
	const target = event.target as HTMLInputElement
	const files = target.files
	if (files && files[0]) {
		const reader = new FileReader()
		reader.onload = (e: ProgressEvent<FileReader>) => {
			uploadedImage.value = e.target?.result as string
		}
		reader.readAsDataURL(files[0])
	}
}

const removeImage = () => {
	uploadedImage.value = null
}

const openCategoryModal = (type: string) => {
	console.log(`Open modal for ${type}`)
}
</script>

<style scoped>

.border {
	border: 1px solid #E1E1E1;
}

.photo-upload {
	@apply bg-lightGray rounded-[16px] text-center cursor-pointer;
}

.photo-upload-label {
	@apply flex flex-col items-center;
}

.photo-upload-input {
	@apply hidden;
}
</style>