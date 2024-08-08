<template>
	<div>
		<div
			ref="imgContainer"
			class="img-container flex items-center justify-center h-[280px] mt-[35px] max-w-max m-auto mb-[16px] relative min-w-[280px] min-h-[280px]"
			:class="{ 'bg-transparentGreen': !store.isRapidClicking, 'bg-rapidClickColor': store.isRapidClicking }"
			@click="handleClick"
		>
			<div class="img-wrapper">
				<img
					src="/public/image/start-screen-image.webp"
					alt="Кот-повар"
					class="cat-image"
					:class="{ 'rapid-clicking': store.isRapidClicking }"
				>
			</div>
			<div id="card-container">
				<TransitionGroup
					name="card"
					tag="div"
				>
					<div
						v-for="card in visibleCards"
						:key="card.id"
						class="card"
						:class="{
							'double-reward': card.multiplier === 2,
							'quadruple-reward': card.multiplier === 4
						}"
						:style="{
							left: `${card.x}px`,
							top: `${card.y}px`,
							animationDuration: `${CLICKER_CONFIG.animation.card.duration}ms`
						}"
						@animationend="removeCard(card.id)"
					>
						+{{ card.multiplier }}
						<IconGold class="w-[24px] h-[24px]" />
					</div>
				</TransitionGroup>
			</div>
		</div>
		<button
			v-if="showPermissionButton"
			class="permission-button bg-forestGreen text-white py-2 px-4 rounded-full mb-4"
			@click="requestMotionPermission"
		>
			{{ t('enableShakeDetection') }}
		</button>
		<SensitivitySettings />
		<ConfigPanel />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { IconGold } from '@/shared/components/Icon'
import SensitivitySettings from './SensitivitySettings.vue'
import { CLICKER_CONFIG } from '../config/clickerConfig'
import { useAudioAnalysis } from '../composables/useAudioAnalysis'
import { useCards } from '../composables/useCards'
import { useCatClickerStore } from '../model/cat-clicker-store'
import ConfigPanel from './ConfigPanel.vue'
import { useTranslation } from '@/shared/lib/i18n'
const store = useCatClickerStore()
import Localization from './CatClicker.localization.json'

const { t } = useTranslation(Localization)
const props = defineProps<{
  initialEnergyCurrency: number,
  initialCurrency: number
}>()

const emit = defineEmits(['update:currency', 'update:energyCurrent'])

const {
  startAudioAnalysis,
  isAudioInitialized,
  errorMessage,
  stopAudioAnalysis,
} = useAudioAnalysis()

const { addCardAndAnimate, cards, removeCard, animateClick } = useCards()

const imgContainer = ref<HTMLElement | null>(null)
let shakeTimeout: number | null = null
const visibleCards = computed(() => cards.value.slice(-20))

const showPermissionButton = ref(true)
const debugAcceleration = ref(0)
const permissionGranted = ref(false)
const eventCount = ref(0)
const lastError = ref('')
const isDeviceMotionSupported = ref(false)
const shakeLevel = ref('medium')

const handleClick = (event: MouseEvent) => {
  addCardAndAnimate(event)
  if (imgContainer.value) {
    animateClick(event.clientX - imgContainer.value.offsetLeft, event.clientY - imgContainer.value.offsetTop, imgContainer.value)
  }

  if (!isAudioInitialized.value && !errorMessage.value) {
    startAudioAnalysis()
  }

  // Альтернативный метод обнаружения тряски для устройств без акселерометра
  if (!isDeviceMotionSupported.value) {
    simulateShake()
  }
}

const simulateShake = () => {
  const randomChance = Math.random()
  if (randomChance < 0.1) { // 10% шанс симуляции тряски при каждом клике
    console.log('Simulated shake detected!')
    store.setShaking(true)
    setTimeout(() => {
      store.setShaking(false)
    }, CLICKER_CONFIG.shake.timeout)
  }
}

const handleDeviceMotion = (event: DeviceMotionEvent) => {
  try {
    eventCount.value++
    console.log('Device motion event received', event)

    const { accelerationIncludingGravity } = event
    if (accelerationIncludingGravity) {
      const acceleration = Math.sqrt(
        Math.pow(accelerationIncludingGravity.x || 0, 2) +
        Math.pow(accelerationIncludingGravity.y || 0, 2) +
        Math.pow(accelerationIncludingGravity.z || 0, 2)
      ) - 9.81

      debugAcceleration.value = acceleration
      console.log('Calculated acceleration:', acceleration)

      let threshold
      switch (shakeLevel.value) {
        case 'low':
          threshold = CLICKER_CONFIG.shake.thresholdLow
          break
        case 'high':
          threshold = CLICKER_CONFIG.shake.thresholdHigh
          break
        default:
          threshold = CLICKER_CONFIG.shake.thresholdMedium
      }

      if (acceleration > threshold) {
        console.log('Shake detected!')
        store.setShaking(true)

        // Добавляем логику для увеличения счетчика или другие действия при тряске
        // store.addCurrency(CLICKER_CONFIG.shake.rewardMultiplier)

        if (shakeTimeout) clearTimeout(shakeTimeout)
        shakeTimeout = window.setTimeout(() => {
          store.setShaking(false)
        }, CLICKER_CONFIG.shake.timeout)
      }
    }
  } catch (error) {
    console.error('Error in handleDeviceMotion:', error)
    // store.setLastError(error instanceof Error ? error.message : 'Unknown error in handleDeviceMotion')
  }
}

const requestMotionPermission = async () => {
  try {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      const permissionState = await (DeviceMotionEvent as any).requestPermission()
      if (permissionState === 'granted') {
        permissionGranted.value = true
        window.addEventListener('devicemotion', handleDeviceMotion)
        console.log('Motion permission granted')
      } else {
        console.error('Motion permission denied')
        lastError.value = 'Motion permission denied. Please enable it in your device settings.'
      }
    } else {
      // Для устройств, не требующих явного разрешения
      permissionGranted.value = true
      window.addEventListener('devicemotion', handleDeviceMotion)
      console.log('Motion listener added without permission request')
    }
  } catch (error: any) {
    console.error('Error requesting motion permission:', error)
    lastError.value = error.message
  }
}

const checkDeviceMotionSupport = () => {
  isDeviceMotionSupported.value = 'DeviceMotionEvent' in window
  console.log('Device motion supported:', isDeviceMotionSupported.value)
  if (!isDeviceMotionSupported.value) {
    lastError.value = 'Device motion is not supported on this device. Using alternative shake detection.'
  }
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    store.setRapidClicking(false)
    store.setShaking(false)
    if (shakeTimeout) clearTimeout(shakeTimeout)
  }
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

onMounted(() => {
  console.log('Component mounted')
  window.addEventListener('visibilitychange', handleVisibilityChange)
  checkDeviceMotionSupport()
  if (isDeviceMotionSupported.value) {
    if (isIOS && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      showPermissionButton.value = true
      console.log('Permission button shown for iOS device')
    } else {
      requestMotionPermission()
    }
  } else {
    console.log('Using alternative shake detection method')
  }
  store.setCurrency(props.initialCurrency)
  store.setEnergyCurrent(props.initialEnergyCurrency)
})

onUnmounted(() => {
  console.log('Component unmounted')
  window.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('devicemotion', handleDeviceMotion)
  if (shakeTimeout) clearTimeout(shakeTimeout)
  stopAudioAnalysis()
})

watch(() => store.currency, (newValue) => {
  emit('update:currency', newValue)
})

watch(() => store.energyCurrent, (newValue) => {
  emit('update:energyCurrent', newValue)
})
</script>

<style scoped lang="scss">
.img-container {
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  perspective: 1000px;
  will-change: transform;
  border-radius: 50%;
  overflow: visible;
  width: v-bind('CLICKER_CONFIG.style.containerSize + "px"');
  height: v-bind('CLICKER_CONFIG.style.containerSize + "px"');
}

.img-wrapper {
  position: absolute;
  width: v-bind('(100 + CLICKER_CONFIG.style.catImageOverflow) + "%"');
  height: v-bind('(100 + CLICKER_CONFIG.style.catImageOverflow) + "%"');
  top: v-bind('(-CLICKER_CONFIG.style.catImageOverflow / 2) + "%"');
  left: v-bind('(-CLICKER_CONFIG.style.catImageOverflow / 2) + "%"');
  transition: transform 0.3s ease;
  will-change: transform;
  overflow: visible;
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform, filter;
}

.cat-image.rapid-clicking {
  animation: rapidClickingEffect v-bind('CLICKER_CONFIG.rapidClick.timeout + "ms"') infinite alternate;
}

#card-container {
  @apply absolute inset-0 pointer-events-none;
  z-index: 10;
  overflow: visible;
}

.card {
  @apply absolute w-[75px] h-10 bg-white flex justify-center items-center text-[#1C1C1C] text-[24px] rounded-[16px] opacity-100;
  animation: moveUp ease-out forwards;
  will-change: transform, opacity;
  pointer-events: none;

  &.double-reward {
    @apply w-[100px] h-14 text-[28px];
  }

  &.quadruple-reward {
    @apply w-[125px] h-16 text-[32px] text-[#ecae81];
  }
}

.card-enter-active,
.card-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.permission-button {
  display: block;
  margin: 1rem auto;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken(#319A6E, 10%);
  }
}

@keyframes moveUp {
  0% {
    transform: translate(-50%, 0) rotate(0deg);
    opacity: v-bind('CLICKER_CONFIG.animation.card.initialOpacity');
  }

  25% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance / 4}px) rotate(${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
  }

  50% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance / 2}px) rotate(-${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
  }

  75% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance * 3 / 4}px) rotate(${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
    opacity: v-bind('(CLICKER_CONFIG.animation.card.initialOpacity + CLICKER_CONFIG.animation.card.finalOpacity) / 2');
  }

  100% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance}px) rotate(0deg)`');
    opacity: v-bind('CLICKER_CONFIG.animation.card.finalOpacity');
  }
}

@keyframes rapidClickingEffect {
  0% {
    transform: v-bind('`scale(${CLICKER_CONFIG.catEffect.scaleFactor})`');
    filter: v-bind('`brightness(${CLICKER_CONFIG.catEffect.brightnessFactor.max}) hue-rotate(0deg)`');
  }

  100% {
    transform: scale(1);
    filter: v-bind('`brightness(${CLICKER_CONFIG.catEffect.brightnessFactor.min}) hue-rotate(${CLICKER_CONFIG.catEffect.hueRotateAngle}deg)`');
  }
}

.bg-rapidClickColor {
  background-color: v-bind('CLICKER_CONFIG.style.backgroundColor.rapid');
}

.bg-transparentGreen {
  background-color: v-bind('CLICKER_CONFIG.style.backgroundColor.normal');
}
</style>