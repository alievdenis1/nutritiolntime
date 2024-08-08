import { ref } from 'vue'
import { useCatClickerStore } from '../model/cat-clicker-store'
import { CLICKER_CONFIG } from '../config/clickerConfig'
import { Card } from '../../types'

export const useCards = () => {
    const store = useCatClickerStore()

    const clickSpeed = ref(0)
    let clickCount = 0
    let clickTimer: number | null = null
    const cards = ref<Card[]>([])

    const addCardAndAnimate = (event: MouseEvent) => {
        if (store.energyCurrent <= 0 || !event.currentTarget) return
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const duration = CLICKER_CONFIG.animation.card.duration / 1000

        let multiplier = 1
        if (store.isShouting) {
            multiplier = 4
        } else if (store.isShaking) {
            multiplier = 2
        }

        cards.value.push({ id: clickCount++, x, y, duration, multiplier })

        store.useEnergy()
        store.addCurrency(multiplier)

        clickSpeed.value++
        let currentThreshold = CLICKER_CONFIG.rapidClick.threshold
        if (store.isShaking) {
            currentThreshold = CLICKER_CONFIG.rapidClick.shakeThreshold
        }
        if (store.isShouting) {
            currentThreshold = CLICKER_CONFIG.rapidClick.shoutThreshold
        }
        store.setRapidClicking(clickSpeed.value > currentThreshold)

        vibrate(store.isRapidClicking ? CLICKER_CONFIG.vibration.rapidClickDuration : CLICKER_CONFIG.vibration.duration)

        if (clickTimer) clearTimeout(clickTimer)
        clickTimer = window.setTimeout(() => {
            clickSpeed.value = 0
            store.setRapidClicking(false)
        }, CLICKER_CONFIG.rapidClick.timeout)
    }

    const removeCard = (id: number) => {
        const index = cards.value.findIndex(card => card.id === id)
        if (index !== -1) {
            cards.value.splice(index, 1)
        }
    }

    const vibrate = (duration: number) => {
        if (CLICKER_CONFIG.vibration.enabled && 'vibrate' in navigator) {
            navigator.vibrate(duration)
        }
    }

    const animateClick = (x: number, y: number, container: HTMLElement) => {
        const { duration, scaleFactor, rotateFactor, shadowFactor } = CLICKER_CONFIG.animation.click
        const centerX = container.offsetWidth / 2
        const centerY = container.offsetHeight / 2
        const distanceX = (x - centerX) / centerX
        const distanceY = (y - centerY) / centerY

        container.animate([
            { transform: 'scale(1)' },
            {
                transform: `scale(${scaleFactor}) rotateX(${distanceY * rotateFactor}deg) rotateY(${-distanceX * rotateFactor}deg)`,
                boxShadow: `${distanceX * shadowFactor}px ${distanceY * shadowFactor}px ${shadowFactor * 2}px rgba(0,0,0,0.3)`
            },
            { transform: 'scale(1)' }
        ], {
            duration,
            easing: 'ease-in-out'
        })

        const imgWrapper = container.querySelector('.img-wrapper') as HTMLElement
        if (imgWrapper) {
            imgWrapper.animate([
                { transform: 'scale(1) translate(0, 0)' },
                {
                    transform: `scale(${CLICKER_CONFIG.catEffect.scaleFactor}) translate(${distanceX * 5}%, ${distanceY * 5}%)`,
                },
                { transform: 'scale(1) translate(0, 0)' }
            ], {
                duration,
                easing: 'ease-in-out'
            })
        }
    }

    return {
        addCardAndAnimate,
        cards,
        removeCard,
        animateClick,
    }
}