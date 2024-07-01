<template>
	<div class="grid w-full px-4 mb-2.5">
		<footer class="flex py-2 px-4 items-center gap-4 justify-between rounded-full bg-white shadow-custom">
			<button
				:class="{ 'active': isCurrentRoute('/') }"
				class="cursor-pointer flex-grow rounded-full"
				@click="navigateToHome"
			>
				<icon-home :icon-color="homeIconColor" />
				{{ t('home') }}
			</button>
			<button
				class="cursor-pointer p-3.5 bg-orange rounded-full"
				:class="[
					{ 'cursor-not-allowed opacity-50': isCreateRecipeRoute }
				]"
				:disabled="isCreateRecipeRoute"
				@click="openCreationModal"
			>
				<icon-plus :icon-color="'#FFFFFF'" />
			</button>
			<button
				:class="{ 'active': isCurrentRoute('/recipes') }"
				class="cursor-pointer flex-grow rounded-full"
				@click="navigateToRecipes"
			>
				<icon-search :icon-color="searchIconColor" />
				{{ t('recipes') }}
			</button>
		</footer>
		<ModalCreateRecipe />
	</div>
</template>

<script setup lang="ts">
import { IconHome, IconPlus, IconSearch } from '@/shared/components/Icon'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './FooterWidget.localization.json'
const { t } = useTranslation(Localization)
import { ModalCreateRecipe } from '@/entities/CreateRecipe/modal-create/ui'
import { useModalCreateStore } from '@/entities/CreateRecipe/modal-create/model/model-store'
const store = useModalCreateStore()
const router = useRouter()

const openCreationModal = () => {
	store.isModalCreateOpen = true
}

const isCurrentRoute = (route: string) => {
	return router.currentRoute.value.path === route
}

const isCreateRecipeRoute = computed(() => {
	return router.currentRoute.value.path === '/create-recipe'
})

const navigateToHome = () => {
	router.push('/')
}

const navigateToRecipes = () => {
	router.push('/recipes')
}

const homeIconColor = computed(() => {
	return isCurrentRoute('/') ? '#319A6E' : '#9F9FA0'
})

const searchIconColor = computed(() => {
	return isCurrentRoute('/recipes') ? '#319A6E' : '#9F9FA0'
})
</script>

<style lang="scss" scoped>
.shadow-custom {
	box-shadow: 0px 0px 34px 0px #00000014;
}

.active {
	background: #1C1C1C0D;
	color: #319A6E;
}

.flex-grow {
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	display: flex;
	padding: 7px 0;
	flex-direction: column;
}

.cursor-not-allowed {
	cursor: not-allowed;
}

.opacity-50 {
	opacity: 0.5;
}
</style>