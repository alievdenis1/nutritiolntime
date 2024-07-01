<template>
	<div
		ref="target"
		class="grid"
	>
		<header class="flex items-center gap-5 w-full justify-between	">
			<img
				alt="Logo"
				height="34"
				src="/image/logo/logo-small.svg"
				width="178"
				class="logo-image"
			>

			<div class="flex items-center gap-[8px]">
				<button class="settings-button py-[10px] px-[16px] relative">
					<IconWallet />

					<div
						id="ton-connect-button-root"
						class="absolute opacity-0 left-0"
					/>
				</button>

				<button
					aria-label="Settings"
					class="settings-button p-[12px]"
					role="button"
					@click="languageDropDownOpen = !languageDropDownOpen"
				>
					{{ t('lang') }}
					<IconArrow
						:icon-color="'#1C1C1C'"
						:class="{ 'rotate-180': languageDropDownOpen }"
					/>
					<div
						v-if="languageDropDownOpen"
						class="language-dropdown"
					>
						<button
							:class="{ 'active': localeStore.currentLocale === 'ru' }"
							@click="localeStore.setLocale('ru')"
						>
							RUS
						</button>
						<button
							:class="{ 'active': localeStore.currentLocale === 'en' }"
							@click="localeStore.setLocale('en')"
						>
							ENG
						</button>
					</div>
				</button>
			</div>
		</header>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Locales, useLocaleStore, useTranslation } from 'shared/lib/i18n'
import Localization from './HeaderWidget.localization.json'
import { onClickOutside } from '@vueuse/core'
import WebApp from '@twa-dev/sdk'
import { useTWA } from 'entities/Session/api/useTWA'
import { useAuthButton } from 'entities/Session/api/useAuthButton'

import { IconWallet, IconArrow } from '@/shared/components/Icon'

const localeStore = useLocaleStore()
const { t } = useTranslation(Localization)
const target = ref(null)

const languageDropDownOpen = ref(false)

onClickOutside(target, () => languageDropDownOpen.value = false)

onMounted(() => {
	useAuthButton()
	useTWA()
	let user = WebApp.initDataUnsafe.user
	if (user && user.language_code) {
		localeStore.setLocale(user.language_code as Locales)
	}
})
</script>

<style lang="scss" scoped>
.connect-button {
	@apply relative cursor-pointer max-w-[108px] flex items-center justify-center py-2 px-2.5 gap-2 border-solid border border-[#735F2B] rounded-[30px];
}

.wallet-address {
	@apply text-[#735F2B] text-xs font-normal;
}

.settings-button {
	@apply cursor-pointer relative flex items-center gap-[2px] rounded-[16px];
	box-shadow: 0px 0px 34px 0px #00000014;
}

.language-dropdown {
	@apply absolute left-[-64px] top-[55px] z-20 flex flex-col border-[#1C1C1C0D] text-[#1C1C1C];

	button {
		padding: 14px 0px 14px 16px;
		border: 1px solid #1C1C1C0D;
		background: #FFFFFF;
		width: 129px;

		&:hover {
			background: #c5c4c4;
		}

		&:first-child {
			border-radius: 16px 16px 0px 0px;
		}

		&:nth-child(2) {
			border-radius: 0px 0px 16px 16px;
		}
	}
}

@media screen and (max-width: 390px) {
	.logo-image {
		@apply max-w-[128px]
	}

	header {
		@apply justify-between
	}
}
</style>