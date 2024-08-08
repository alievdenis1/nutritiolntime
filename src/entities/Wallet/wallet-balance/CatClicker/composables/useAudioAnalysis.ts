import { ref, computed } from 'vue'
import { useCatClickerStore } from '../model/cat-clicker-store'
import { CLICKER_CONFIG } from '../config/clickerConfig'

export const useAudioAnalysis = () => {
    const store = useCatClickerStore()

    const CALIBRATION_DURATION = 3000
    const NOISE_SAMPLES = 50
    const SMOOTHING_FACTOR = 0.2

    const isCalibrating = ref(true)
    const isAudioInitialized = ref(false)
    const errorMessage = ref('')
    const baselineNoiseLevel = ref(0)
    const noiseLevels = ref<number[]>([])
    const currentAudioLevel = ref(0)
    const smoothedAudioLevel = ref(0)

    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let microphone: MediaStreamAudioSourceNode | null = null

    const isWebAudioSupported = 'AudioContext' in window || 'webkitAudioContext' in window

    const startAudioAnalysis = async () => {
        if (isAudioInitialized.value) return

        if (!isWebAudioSupported) {
            console.log('Web Audio API is not supported. Using alternative method.')
            startAlternativeAudioAnalysis()
            return
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            analyser = audioContext.createAnalyser()
            microphone = audioContext.createMediaStreamSource(stream)
            microphone.connect(analyser)
            analyser.fftSize = 1024
            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            const calibrationStartTime = Date.now()

            const getAudioLevel = (): number => {
                analyser!.getByteFrequencyData(dataArray)
                return Math.max(...dataArray) / 255
            }

            const updateNoiseLevel = (level: number) => {
                noiseLevels.value.push(level)
                if (noiseLevels.value.length > NOISE_SAMPLES) {
                    noiseLevels.value.shift()
                }
                baselineNoiseLevel.value = noiseLevels.value.reduce((sum, level) => sum + level, 0) / noiseLevels.value.length
            }
            const checkAudioLevel = () => {
                const rawLevel = getAudioLevel()
                currentAudioLevel.value = rawLevel

                if (Date.now() - calibrationStartTime < CALIBRATION_DURATION) {
                    updateNoiseLevel(rawLevel)
                } else {
                    if (isCalibrating.value) {
                        isCalibrating.value = false
                        console.log('Calibration complete. Baseline noise level:', baselineNoiseLevel.value)
                    }

                    smoothedAudioLevel.value = smoothedAudioLevel.value * (1 - SMOOTHING_FACTOR) + rawLevel * SMOOTHING_FACTOR

                    const normalizedLevel = Math.max(0, Math.min(1, (smoothedAudioLevel.value - baselineNoiseLevel.value) / (1 - baselineNoiseLevel.value)))

                    let shoutLevel = ''
                    if (normalizedLevel > CLICKER_CONFIG.sound.thresholdHigh) {
                        shoutLevel = 'high'
                    } else if (normalizedLevel > CLICKER_CONFIG.sound.thresholdMedium) {
                        shoutLevel = 'medium'
                    } else if (normalizedLevel > CLICKER_CONFIG.sound.thresholdLow) {
                        shoutLevel = 'low'
                    }

                    if (shoutLevel) {
                        console.log(`Shouting detected! Level: ${shoutLevel}, Normalized level: ${normalizedLevel.toFixed(2)}`)
                        store.setShouting(true, shoutLevel)
                    } else {
                        store.setShouting(false, '')
                    }
                }

                requestAnimationFrame(checkAudioLevel)
            }
            checkAudioLevel()
            isAudioInitialized.value = true
        } catch (error) {
            console.error('Error accessing microphone:', error)
            errorMessage.value = 'Не удалось получить доступ к микрофону'
            startAlternativeAudioAnalysis()
        }
    }

    const startAlternativeAudioAnalysis = () => {
        console.log('Starting alternative audio analysis')
        isAudioInitialized.value = true
        let clickCount = 0
        let lastClickTime = Date.now()

        const handleClick = () => {
            const currentTime = Date.now()
            if (currentTime - lastClickTime < 300) { // Если клики происходят быстро
                clickCount++
                if (clickCount > 5) { // Пороговое значение для "громкого" звука
                    store.setShouting(true, 'high')
                } else if (clickCount > 3) { // Пороговое значение для "среднего" звука
                    store.setShouting(true, 'medium')
                } else {
                    store.setShouting(true, 'low')
                }
            } else {
                clickCount = 1
                store.setShouting(false, '')
            }
            lastClickTime = currentTime
        }
        const container = document.querySelector('.img-container')
        if (container) {
            container.addEventListener('click', handleClick)
        }

        isAudioInitialized.value = true
    }

    const stopAudioAnalysis = () => {
        if (audioContext) {
            audioContext.close()
            audioContext = null
        }
        if (microphone) {
            microphone.disconnect()
            microphone = null
        }
        analyser = null
        isAudioInitialized.value = false
    }

    const normalizedAudioLevel = computed(() => {
        return Math.max(0, (smoothedAudioLevel.value - baselineNoiseLevel.value) / (1 - baselineNoiseLevel.value))
    })

    return {
        startAudioAnalysis,
        stopAudioAnalysis,
        isCalibrating,
        isAudioInitialized,
        errorMessage,
        normalizedAudioLevel,
        startAlternativeAudioAnalysis
    }
}
