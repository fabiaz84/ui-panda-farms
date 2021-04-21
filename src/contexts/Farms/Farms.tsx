import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from '@binance-chain/bsc-use-wallet'
import usePanda from '../../hooks/usePanda'

import { bnToDec } from '../../utils'
import { getMasterChefContract, getEarned } from '../../panda/utils'
import { getFarms } from '../../panda/utils'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
	const [unharvested, setUnharvested] = useState(0)

	const pnda = usePanda()
	const { account } = useWallet()

	const farms = getFarms(pnda)

	return (
		<Context.Provider
			value={{
				farms,
				unharvested,
			}}
		>
			{children}
		</Context.Provider>
	)
}

export default Farms
