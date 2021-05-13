import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { getLastDepositBlock, getMasterChefContract } from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'

const useLastDepositBlock = (pid: number) => {
  const [lastDepositBlock, setLastDepositBlock] = useState(new BigNumber(0).toNumber())
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const panda = usePanda()
  const masterChefContract = getMasterChefContract(panda)
  const block = useBlock()

  const fetchLastDepositBlock = useCallback(async () => {
    const lastDepositBlock = await getLastDepositBlock(masterChefContract, pid, account)
    setLastDepositBlock(new BigNumber(lastDepositBlock).toNumber())
  }, [account, masterChefContract, panda])

  useEffect(() => {
    if (account && masterChefContract && panda) {
      fetchLastDepositBlock()
    }
  }, [account, block, masterChefContract, setLastDepositBlock, panda])

  return lastDepositBlock
}

export default useLastDepositBlock
