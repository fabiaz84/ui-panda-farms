import { useCallback, useEffect, useState, useMemo } from 'react'

import { BigNumber } from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { getStaked, getMasterChefContract, getRhinoBalanceRhino, getRhinoStakingContract } from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'
import { ethers } from 'ethers'

const useSwapBalance2 = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const panda = usePanda()
  const block = useBlock()
  const rhinoStakingContract = useMemo(() => getRhinoStakingContract(panda), [
    panda,
  ])


  let pandaBalance2

  const fetchBalance2 = useCallback(async () => {
    BigNumber.config({ DECIMAL_PLACES: 9 })
    const balance2 = await getRhinoBalanceRhino(rhinoStakingContract)
    pandaBalance2 = new BigNumber(balance2)
    setBalance(pandaBalance2.decimalPlaces(9))
  }, [account, block])

  useEffect(() => {
    if (account && panda) {
      fetchBalance2()
    }
  }, [account, block, panda])

  return balance.decimalPlaces(9)
}

export default useSwapBalance2
