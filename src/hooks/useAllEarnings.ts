import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const pnda = usePanda()
  const farms = getFarms(pnda)
  const masterChefContract = getMasterChefContract(pnda)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(masterChefContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, masterChefContract, pnda])

  useEffect(() => {
    if (account && masterChefContract && pnda) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, pnda])

  return balances
}

export default useAllEarnings
