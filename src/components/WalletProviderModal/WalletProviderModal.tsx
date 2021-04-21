import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import metamaskLogo from '../../assets/img/metamask-fox.svg'
import walletConnectLogo from '../../assets/img/wallet-connect.svg'
import binanceSmartWalletLogo from '../../assets/img/binanceChainWallet.svg'
import trustWalletLogo from '../../assets/img/trustWallet.svg'
import mathWalletLogo from '../../assets/img/mathWallet.png'

import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../Spacer'

import WalletCard from './components/WalletCard'

import { isMobile } from 'react-device-detect'

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
	const { account, connect } = useWallet()

	useEffect(() => {
		if (account) {
			onDismiss()
		}
	}, [account, onDismiss])

	return (
		<Modal>
			<ModalTitle text="Select a wallet provider." />

			<ModalContent>
				<StyledWalletsWrapper>
					<StyledWalletCard>
						<WalletCard
							icon={<img src={metamaskLogo} style={{ height: 32 }} />}
							onConnect={() => connect('injected')}
							title="Metamask"
						/>
					</StyledWalletCard>
					<Spacer size="sm" />
					{window.BinanceChain ? (
						<>
							<StyledWalletCard>
								<WalletCard
									icon={
										<img src={binanceSmartWalletLogo} style={{ height: 32 }} />
									}
									onConnect={() => connect('bsc')}
									title="Binance Chain Wallet"
								/>
							</StyledWalletCard>
							<Spacer size="sm" />
						</>
					) : (
						''
					)}
					<StyledWalletCard>
						<WalletCard
							icon={<img src={walletConnectLogo} style={{ height: 32 }} />}
							onConnect={() => connect('walletconnect')}
							title="WalletConnect"
						/>
					</StyledWalletCard>
					<Spacer size="sm" />
					<StyledWalletCard>
						<WalletCard
							icon={<img src={mathWalletLogo} style={{ height: 32 }} />}
							onConnect={() => connect('injected')}
							title="Math Wallet"
						/>
					</StyledWalletCard>
					<Spacer size="sm" />
					<StyledWalletCard>
						<WalletCard
							icon={<img src={trustWalletLogo} style={{ height: 32 }} />}
							onConnect={() =>
								isMobile ? connect('injected') : connect('walletconnect')
							}
							title="Trust Wallet"
						/>
					</StyledWalletCard>
					<Spacer size="sm" />
				</StyledWalletsWrapper>
			</ModalContent>

			<ModalActions>
				<Button text="Cancel" variant="secondary" onClick={onDismiss} />
			</ModalActions>
		</Modal>
	)
}

const StyledWalletsWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	@media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
		flex-direction: column;
		flex-wrap: none;
	}
`

const StyledWalletCard = styled.div`
	flex-basis: calc(50% - ${(props) => props.theme.spacing[2]}px);
`

export default WalletProviderModal
