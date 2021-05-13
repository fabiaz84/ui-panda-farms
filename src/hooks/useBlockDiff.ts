import { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useBlock from './useBlock'
import useFirstDepositBlock from './useFirstDepositBlock'
import useLastDepositBlock from './useLastDepositBlock'
import useLastWithdrawBlock from './useLastWithdrawBlock'
import { getMasterChefContract } from '../panda/utils'
import usePanda from './usePanda'
import BigNumber from 'bignumber.js'

// import debounce from 'debounce'

const useBlockDiff = (pid:number) => {
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()
  const panda = usePanda()
  const masterChefContract = getMasterChefContract(panda)
  const firstDepositBlock = useFirstDepositBlock (pid)
  const lastWithdrawBlock = useLastWithdrawBlock (pid)
  
  const blockDiff =
  block -
  new BigNumber(
    firstDepositBlock >
    lastWithdrawBlock
      ? firstDepositBlock
      : lastWithdrawBlock,
  ).toNumber();

  return blockDiff
}

export default useBlockDiff
