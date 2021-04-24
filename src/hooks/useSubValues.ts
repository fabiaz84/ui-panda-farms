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

const useSubValues = () => {
  const { account }: { account: string } = useWallet()
  const panda = usePanda()
  //const wbnbPriceContract = getWbnbPriceContract(panda)
  //const pndaPriceContract = getPandaPriceContract(panda)
  const locks = useLockedEarnings()
  const [usrSubText, setUsrSubText] = useState(new String())
  const [pndaPrices, setPandaPrices] = useState(new BigNumber(0))
  const [wbnbPrices, setWbnbPrices] = useState(new BigNumber(0))

  const getInfo = useCallback(async () => {
    if (panda) {
      const wbnbPriceFun = getWbnbPrice(panda).then((response) => {
        setWbnbPrices(response)

        const pndaPriceFun = getPandaPrice(panda).then((response) => {
          setPandaPrices(response)
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
          const usrSubText =
            'When this unlocks it will earn you $' +
            dailyPrice +
            ' per day for 6 years. The equivalent of $' +
            annualPrice +
            ' per year!'
          setUsrSubText(usrSubText)
        })
      })
    }
  }, [locks, usrSubText])

  useEffect(() => {
    if (account && panda) {
      getInfo()
    }
  }, [account, panda, locks, usrSubText])

  return usrSubText.toString()
}

export default useSubValues
