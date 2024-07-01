import { TonConnectUI } from '@tonconnect/ui'

let instance: TonConnectUI | null = null

export function getTonConnectUIInstance(): TonConnectUI {
    if (!instance) {
        instance = new TonConnectUI({
            manifestUrl: 'https://alievdenis1.github.io/nutritiolntime/tonconnect-manifest.json',
            buttonRootId: 'ton-connect-button-root',
            language: 'ru'
        })
    }
    return instance
}