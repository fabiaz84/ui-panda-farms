/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
  }
  BinanceChain?: {
    isMetaMask?: false
    on?: (...args: any[]) => void
  }
  web3?: {}
}