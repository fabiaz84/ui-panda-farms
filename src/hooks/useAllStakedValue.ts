import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getMasterChefContract,
  getWbnbContract,
  getFarms,
  getTotalLPWbnbValue,
} from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wbnbAmount: BigNumber
  totalWbnbValue: BigNumber
  tokenPriceInWbnb: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const pnda = usePanda()
  const farms = getFarms(pnda)
  const masterChefContract = getMasterChefContract(pnda)
  const wbnbContract = getWbnbContract(pnda)
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
          tokenDecimals,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
          tokenDecimals: number
        }) =>
          getTotalLPWbnbValue(
            masterChefContract,
            wbnbContract,
            lpContract,
            tokenContract,
            tokenDecimals,
            pid,
          ),
      ),
    )

    setBalance(balances)
  }, [account, masterChefContract, pnda])

  useEffect(() => {
    if (account && masterChefContract && pnda) {
      fetchAllStakedValue()
    }
  }, [account, block, masterChefContract, setBalance, pnda])

  return balances
}

export default useAllStakedValue
