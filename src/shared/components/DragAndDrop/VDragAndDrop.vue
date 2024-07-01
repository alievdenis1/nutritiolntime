<template>
	<div class="tabs-container">
		<div class="tabs-wrapper">
			<div
				v-for="tab in items"
				:key="tab.id"
				:data-id="tab.id"
				class="tab-column rounded-[100px] px-[16px] py-[12px]"
				:class="{
					'active-tab': tab.id === selectedTab.id,
					'draggable-tab': tab.id === draggableTabId,
					'highlight-draggable': tab.id === draggableTabId && draggedActive,
					'touch-active': tab.id === draggableTabId && draggedActive,
				}"
				:draggable="tab.id === draggableTabId && draggedActive"
				@dragstart="onDragStart(tab, $event)"
				@dragover.prevent="onDragOver(tab)"
				@dragleave="onDragLeave"
				@drop="onDrop($event, tab)"
				@click="onTabClick(tab)"
				@touchstart="onTouchStart(tab, $event)"
				@touchmove="onTouchMove($event)"
				@touchend="onTouchEnd"
			>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<IconKebab
							v-if="tab.isActiveEdit && tab.id === selectedTab.id"
							class="mr-[6px] cursor-pointer"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<IconEdit class="icon" />
							{{ t('edit') }}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem @click="enableDragging(tab.id)">
							<IconMove class="icon" />
							{{ t('move') }}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<IconBin class="icon" />
							{{ t('delete') }}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<div
					v-if="tab.isActiveEdit && tab.id !== selectedTab.id"
					class="w-[22px]"
				/>
				<div>{{ tab.label }}</div>
				<div class="ml-[6px] text-gray">
					{{ tab.count }}
				</div>
			</div>
		</div>
		<button class="cursor-pointer px-[13px] py-[13px] rounded-[100px] bg-lightGray ml-[8px]">
			<IconPlus :icon-color="'#319A6E'" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { DragTypes } from './types'
import { IconPlus, IconKebab, IconBin, IconMove, IconEdit } from 'shared/components/Icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './VDragAndDrop.localization.json'

const { t } = useTranslation(Localization)

const props = defineProps({
  items: {
    type: Array as () => DragTypes[],
    required: true
  }
})

const { items } = toRefs(props)

const selectedTab = ref(items.value[0])
const draggedTab = ref<DragTypes | null>(null)
const draggedOverTab = ref<DragTypes | null>(null)
const draggedActive = ref(false)
const draggableTabId = ref<number | null>(null)
let touchStartX = 0
let touchStartY = 0

const onDragStart = (tab: DragTypes, event: DragEvent) => {
  if (tab.id === draggableTabId.value) {
    draggedTab.value = tab
    const dataTransfer = event.dataTransfer
    if (dataTransfer) {
      dataTransfer.effectAllowed = 'move'
      dataTransfer.setData('tab-id', tab.id.toString())
    }
  }
}

const onDragOver = (tab: DragTypes) => {
  draggedOverTab.value = tab
}

const onDragLeave = () => {
  draggedOverTab.value = null
}

const onDrop = (event: DragEvent, tab: DragTypes) => {
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) {
    console.error('DragEvent\'s dataTransfer is null.')
    return
  }

  const draggedTabId = parseInt(dataTransfer.getData('tab-id'))
  if (isNaN(draggedTabId)) {
    console.error('Failed to parse tab-id.')
    return
  }

  const draggedTabIndex = items.value.findIndex((t) => t.id === draggedTabId)
  const targetTabIndex = items.value.findIndex((t) => t.id === tab.id)

  if (draggedTabIndex !== -1 && targetTabIndex !== -1) {
    const [movedTab] = items.value.splice(draggedTabIndex, 1)
    items.value.splice(targetTabIndex, 0, movedTab)
  }

  draggedTab.value = null
  draggedOverTab.value = null
  draggableTabId.value = null
  draggedActive.value = false
}

const onTabClick = (tab: DragTypes) => {
  selectedTab.value = tab
  if (draggableTabId.value !== tab.id) {
    draggableTabId.value = null
    draggedActive.value = false
  }
}

const enableDragging = (tabId: number) => {
  draggedActive.value = true
  draggableTabId.value = tabId
}

const onTouchStart = (tab: DragTypes, event: TouchEvent) => {
  if (tab.id === draggableTabId.value) {
    draggedTab.value = tab
    const touch = event.touches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY
  }
}

const onTouchMove = (event: TouchEvent) => {
  if (!draggedTab.value) return
  const touch = event.touches[0]
  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY
  const element = (event.target as HTMLElement).closest('.tab-column') as HTMLElement
  if (element) {
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }
}

const onTouchEnd = (event: TouchEvent) => {
  if (!draggedTab.value) return
  const element = (event.target as HTMLElement).closest('.tab-column') as HTMLElement
  if (element) {
    element.style.transform = ''
  }
  const touch = event.changedTouches[0]
  const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement
  if (target && target.classList.contains('tab-column')) {
    const targetTabId = target.getAttribute('data-id')
    const targetTab = targetTabId ? items.value.find(tab => tab.id === Number(targetTabId)) : null
    if (targetTab && draggedTab.value) {
      onDrop(
        {
          dataTransfer: {
            getData: () => draggedTab.value?.id.toString() || ''
          }
        } as unknown as DragEvent,
        targetTab
      )
    }
  }
  draggedTab.value = null
}
</script>

<style lang="scss" scoped>
.tabs-container {
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;

  &.visible {
    overflow-y: visible;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.tabs-wrapper {
  display: flex;
  gap: 8px;
  -webkit-overflow-scrolling: touch;
}

.tab-column {
  display: inline-flex;
  justify-content: center;
  position: relative;
  align-items: center;
  -webkit-overflow-scrolling: touch;

  &.draggable-tab {
    width: 100%;
    cursor: pointer;
  }

  &.active-tab {
    background-color: rgba(49, 154, 110, 0.1);
    color: #319A6E;
  }

  &.highlight-draggable {
    outline: 2px dashed #319A6E;
    outline-offset: -4px;
  }

  &.touch-active {
    touch-action: none;
  }
}

.context-menu {
  background-color: white;
  border-radius: 8px;
  padding: 14px 16px;
  width: 160px;
  border: 1px solid rgba(28, 28, 28, 0.05);
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: absolute;
  top: 40px;
  left: -80px;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  text-align: left;
  background-color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;

  .icon {
    margin-right: 8px;
  }
}

.icon {
  width: 15px;
  height: 15px;
}

.span {
  border: 0.2px solid #9f9fa0;
}

.v-button {
  cursor: pointer;
  padding: 13px;
  border-radius: 100px;
  background-color: #F3F3F3;
  margin-left: 8px;
}
</style>