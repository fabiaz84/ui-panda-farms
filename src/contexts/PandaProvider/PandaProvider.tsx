import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from '@binance-chain/bsc-use-wallet'

import { Panda } from '../../panda'

export interface PandaContext {
	pnda?: typeof Panda
}

export const Context = createContext<PandaContext>({
	pnda: undefined,
})

declare global {
	interface Window {
		pndasauce: any
		pnda: any
	}
}

const PandaProvider: React.FC = ({ children }) => {
	const { ethereum }: { ethereum: any } = useWallet()
	const [pnda, setPanda] = useState<any>()

	window.pnda = pnda

	useEffect(() => {
		if (ethereum) {
			const chainId = Number(ethereum.chainId)
			console.log(chainId)
			const pndaLib = new Panda(ethereum, chainId, false, {
				defaultAccount: ethereum.selectedAddress,
				defaultConfirmations: 1,
				autoGasMultiplier: 1.05,
				testing: false,
				defaultGas: '300000',
				defaultGasPrice: '20000000000',
				accounts: [],
				ethereumNodeTimeout: 10000,
			})
			console.log(pndaLib)
			setPanda(pndaLib)
			window.pndasauce = pndaLib
		}
	}, [ethereum])

	return <Context.Provider value={{ pnda }}>{children}</Context.Provider>
}

export default PandaProvider
