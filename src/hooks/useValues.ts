import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import { BigNumber } from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import {
  getWbnbPrice,
  getPandaPrice,
  getWbnbPriceContract,
  getPandaPriceContract,
} from '../panda/utils'
import useLockedEarnings from './useLockedEarnings'
import usePanda from './usePanda'
import useBlock from './useBlock'

const useValues = () => {
  const { account }: { account: string } = useWallet()
  const pnda = usePanda()
  const locks = useLockedEarnings()
  //const wbnbPriceContract = getWbnbPriceContract(pnda)
  //const pndaPriceContract = getPandaPriceContract(pnda)
  const [usrText, setUsrText] = useState(new String())
  const [pndaPrices, setPandaPrices] = useState(new BigNumber(0))
  const [wbnbPrices, setWbnbPrices] = useState(new BigNumber(0))

  const getInfo = useCallback(async () => {
    console.log(pnda)
    if (pnda) {
      const wbnbPriceFun = getWbnbPrice(pnda).then((response) => {
        setWbnbPrices(response)

        const pndaPriceFun = getPandaPrice(pnda).then((response) => {
          setPandaPrices(response)
          console.log('pndavalues')
          console.log(response)
          const currentRate = wbnbPrices
            .dividedBy(100000000)
            .dividedBy(pndaPrices)
          const userValue = currentRate.multipliedBy(
            locks.dividedBy(1000000000000000000),
          )
          const dailyPrice = userValue.dividedBy(1095).toFormat(2)
          console.log(dailyPrice + ' dailyPrice')
          console.log(wbnbPrices + ' wbnbprice')
          console.log(pndaPrices + ' pndaPrice')
          const annualPrice = userValue.dividedBy(3).toFormat(2)
          console.log(annualPrice + ' annual')
          const wbnbText = userValue.toFormat(2)
          const usrText1 = 'Your Locked PNDA is worth $' + wbnbText + ''
          setUsrText(usrText1)
          console.log(usrText)
        })
      })
    }
  }, [locks, usrText])

  useEffect(() => {
    if (account && pnda) {
      getInfo()
    }
  }, [account, pnda, locks, usrText])

  return usrText.toString()
}

export default useValues
