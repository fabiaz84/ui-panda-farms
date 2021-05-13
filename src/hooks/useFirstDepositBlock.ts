import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { getFirstDepositBlock, getMasterChefContract } from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'

const useFirstDepositBlock = (pid: number) => {
  const [firstDepositBlock, setFirstDepositBlock] = useState(new BigNumber(0).toNumber())
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const panda = usePanda()
  const masterChefContract = getMasterChefContract(panda)
  const block = useBlock()

  const fetchFirstDepositBlock = useCallback(async () => {
    const firstDepositBlock = await getFirstDepositBlock(masterChefContract, pid, account)
    setFirstDepositBlock(new BigNumber(firstDepositBlock).toNumber())
  }, [account, masterChefContract, panda])

  useEffect(() => {
    if (account && masterChefContract && panda) {
      fetchFirstDepositBlock()
    }
  }, [account, block, masterChefContract, setFirstDepositBlock, panda])

  return firstDepositBlock
}

export default useFirstDepositBlock
