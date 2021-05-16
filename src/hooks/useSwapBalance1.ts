import { useCallback, useEffect, useState, useMemo } from 'react'

import { BigNumber } from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { getStaked, getMasterChefContract, getRhinoBalancePanda, getRhinoStakingContract } from '../panda/utils'
import usePanda from './usePanda'
import useBlock from './useBlock'
import { ethers } from 'ethers'

const useSwapBalance1 = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const panda = usePanda()
  const block = useBlock()
  const rhinoStakingContract = useMemo(() => getRhinoStakingContract(panda), [
    panda,
  ])


  let pandaBalance

  const fetchBalance1 = useCallback(async () => {
    BigNumber.config({ DECIMAL_PLACES: 18 })
    const balance1 = await getRhinoBalancePanda(rhinoStakingContract)
    pandaBalance = new BigNumber(balance1)
    setBalance(pandaBalance.decimalPlaces(18))
  }, [account, block])

  useEffect(() => {
    if (account && panda) {
      fetchBalance1()
    }
  }, [account, block, panda])

  return balance.decimalPlaces(18)
}

export default useSwapBalance1
