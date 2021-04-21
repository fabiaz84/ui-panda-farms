import React, { useCallback, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import bsc from '@binance-chain/bsc-use-wallet'
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import PandaProvider from './contexts/PandaProvider'
import theme from './theme'
import Farms from './views/Farms'
import Home from './views/Home'

const url = new URL(window.location.toString())
if (url.searchParams.has('ref')) {
	document.querySelectorAll('a[href]').forEach((el) => {
		const attrUrl = new URL(el.getAttribute('href'))
		attrUrl.searchParams.set('ref', url.searchParams.get('ref'))
	})
}

const App: React.FC = () => {
	const [mobileMenu, setMobileMenu] = useState(false)

	const handleDismissMobileMenu = useCallback(() => {
		setMobileMenu(false)
	}, [setMobileMenu])

	const handlePresentMobileMenu = useCallback(() => {
		setMobileMenu(true)
	}, [setMobileMenu])

	return (
		<Providers>
			<Router>
				<TopBar onPresentMobileMenu={handlePresentMobileMenu} />
				<MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
				<Switch>
					<Route path="/" exact>
						<Home />
					</Route>
					<Route path="/farms">
						<Farms />
					</Route>
				</Switch>
			</Router>
		</Providers>
	)
}

const Providers: React.FC = ({ children }) => {
	return (
		<ThemeProvider theme={theme}>
			<UseWalletProvider
				chainId={56}
				connectors={{
					bsc,
					walletconnect: { rpcUrl: 'https://bsc-dataseed.binance.org/' },
				}}
			>
				<PandaProvider>
					<TransactionProvider>
						<FarmsProvider>
							<ModalsProvider>{children}</ModalsProvider>
						</FarmsProvider>
					</TransactionProvider>
				</PandaProvider>
			</UseWalletProvider>
		</ThemeProvider>
	)
}

export default App
