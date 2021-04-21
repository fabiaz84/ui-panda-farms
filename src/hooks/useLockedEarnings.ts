import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { getLockedEarned, getPandaContract } from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'

const useLockedEarnings = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const pnda = usePanda()
  const pndaContract = getPandaContract(pnda)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getLockedEarned(pndaContract, account)
    setBalance(new BigNumber(balance))
  }, [account, pndaContract, pnda])

  useEffect(() => {
    if (account && pndaContract && pnda) {
      fetchBalance()
    }
  }, [account, block, pndaContract, setBalance, pnda])

  return balance
}

export default useLockedEarnings
