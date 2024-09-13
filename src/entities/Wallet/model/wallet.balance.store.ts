import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { ConnectedWallet } from '@tonconnect/ui'

type State = {
    walletAddress: string | null,
    walletInfo: ConnectedWallet | null,
    isAuthorized: boolean,
};

const router = useRouter()

export const USER_INFO_KEY = 'user-info-key'
export const WALLET_INFO_KEY = 'wallet-info-key'
export const WALLET_ADDRESS = 'wallet-address'

export const useWalletStore = defineStore({
    id: 'wallet-store',
    state: (): State => ({
        walletInfo: null,
        walletAddress: localStorage.getItem(WALLET_ADDRESS),
        isAuthorized: false,
    }),
    getters: {
        wallet(): ConnectedWallet | null {
            return this.walletInfo
        },
        address(): string {
            return this.walletAddress ?? ''
        },
    },
    actions: {
        setWalletAddress(address: string | null) {
            this.walletAddress = address

            if (address) {
                localStorage.setItem(WALLET_ADDRESS, address)
            } else {
                localStorage.removeItem(WALLET_ADDRESS)
            }

        },
        setWalletInfo(walletInfo: ConnectedWallet | null) {
            this.walletInfo = walletInfo
        },

        setAuthorized(isAuthorized: boolean) {
            if (!isAuthorized) {
                this.walletAddress = null
                localStorage.removeItem(USER_INFO_KEY)
                localStorage.removeItem(WALLET_INFO_KEY)
                router.push('/')
            }
            this.isAuthorized = isAuthorized
        },
        logout() {
            this.setAuthorized(false)
            this.setWalletAddress(null)
            this.setWalletInfo(null)
        }
    }
})
