<template>
	<TabsMain :default-value="store.defaultValueTabs">
		<div class="flex justify-between items-center mb-[16px]">
			<button
				class="p-[12px] rotate-180 shadow-2xl bg-white rounded-[50%] shadow-custom cursor-pointer"
				@click="$router.go(-1)"
			>
				<IconArrowRight icon-color="#1C1C1C" />
			</button>
			<h2 class="text-center text-lg text-darkGray">
				{{ t('createRecipe') }}
			</h2>
			<div />
		</div>
		<TabsList>
			<TabsTrigger value="ownRecepie">
				{{ t('manualCreation') }}
			</TabsTrigger>
			<TabsTrigger
				value="aiRecepie"
				class="flex gap-[8px]"
			>
				{{ t('aiCreation') }}
				<IconAi :icon-color="'#E1E1E1'" />
			</TabsTrigger>
		</TabsList>
		<TabsContent
			value="ownRecepie"
			class="flex gap-[16px] flex-col mt-[16px]"
		>
			<CreateRecipeBasicInfo />
			<CreateRecipeGradation />
		</TabsContent>
		<TabsContent value="aiRecepie">
			<CreateRecipeGpt />
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { CreateRecipeBasicInfo, CreateRecipeGpt, CreateRecipeGradation } from 'entities/CreateRecipe/ui'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useModalCreateStore } from '../../entities/CreateRecipe/modal-create/model/model-store'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateRecipeTabs.localization.json'
import { IconAi, IconArrowRight } from '@/shared/components/Icon'
const store = useModalCreateStore()
const { t } = useTranslation(localizations)
</script>

<style scoped></style>
