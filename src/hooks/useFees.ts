import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import supportedPools from '../panda/lib/supportedPools'
import _ from 'lodash'
import { getMasterChefContract } from '../panda/utils'
import usePanda from './usePanda'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import useBlock from './useBlock'
import useFirstDepositBlock from './useFirstDepositBlock'
import useLastDepositBlock from './useLastDepositBlock'
import useLastWithdrawBlock from './useLastWithdrawBlock'
import useBlockDiff from './useBlockDiff'

const getWithdrawalPenalty = (blocksSince) => {
  return blocksSince <= 0
    ? 0.99
    : blocksSince <= 1200
    ? 0.5
    : blocksSince <= 28800
    ? 0.25
    : blocksSince <= 86400
    ? 0.12
    : blocksSince <= 144000
    ? 0.08
    : blocksSince <= 403200
    ? 0.04
    : blocksSince <= 806400
    ? 0.02
    : 0.001
}

const useFees = ( pid: number ) => {
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()
  const panda = usePanda()
  const masterChefContract = getMasterChefContract(panda)
  const firstDepositBlock = useFirstDepositBlock (pid)
  const lastWithdrawBlock = useLastWithdrawBlock (pid)
  const blockDiff = useBlockDiff(pid)

  const userFees = getWithdrawalPenalty(blockDiff)

return userFees
}

export default useFees
