import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalCreateStore = defineStore('modal', () => {

    const isModalCreateOpen = ref<boolean>(false)
    const defaultValueTabs = ref<string>('ownRecepie')

    const openModal = () => {
        isModalCreateOpen.value = true
    }

    const closeModal = () => {
        isModalCreateOpen.value = false
    }

    return {
        isModalCreateOpen,
        defaultValueTabs,
        openModal,
        closeModal
    }
})