import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { getLastWithDrawBlock, getMasterChefContract } from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'

const useLastWithdrawBlock = (pid: number) => {
  const [lastWithdrawBlock, setLastWithdrawBlock] = useState(new BigNumber(0).toNumber())
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const panda = usePanda()
  const masterChefContract = getMasterChefContract(panda)
  const block = useBlock()

  const fetchLastWithdrawBlock = useCallback(async () => {
    const lastWithdrawBlock = await getLastWithDrawBlock(masterChefContract, pid, account)
    setLastWithdrawBlock(new BigNumber(lastWithdrawBlock).toNumber())
  }, [account, masterChefContract, panda])

  useEffect(() => {
    if (account && masterChefContract && panda) {
      fetchLastWithdrawBlock()
    }
  }, [account, block, masterChefContract, setLastWithdrawBlock, panda])

  return lastWithdrawBlock
}

export default useLastWithdrawBlock
