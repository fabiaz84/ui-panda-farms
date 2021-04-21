import { useCallback } from 'react'

import usePanda from './usePanda'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { unstake, getMasterChefContract, getRefUrl } from '../panda/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const pnda = usePanda()
  const masterChefContract = getMasterChefContract(pnda)

  const handleUnstake = useCallback(
    async (amount: string) => {
      console.log(getRefUrl())
      const txHash = await unstake(
        masterChefContract,
        pid,
        amount,
        account,
        getRefUrl(),
      )
      console.log(txHash)
    },
    [account, pid, pnda],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
