import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import usePanda from '../../hooks/usePanda'
import { getMasterChefContract } from '../../panda/utils'
import { getContract } from '../../utils/erc20'
import Harvest from './components/Harvest'
import Fee from './components/Fee'
import { PoolType } from '../../contexts/Farms/types'
import Stake from './components/Stake'

const Farm: React.FC = () => {
	const { farmId } = useParams()
	const {
		pid,
		lpToken,
		lpTokenAddress,
		tokenAddress,
		earnToken,
		name,
		icon,
		refUrl,
		poolType,
	} = useFarm(farmId) || {
		pid: 0,
		lpToken: '',
		lpTokenAddress: '',
		tokenAddress: '',
		earnToken: '',
		name: '',
		icon: '',
		refUrl: '',
		poolType: PoolType.PNDA,
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const panda = usePanda()
	const { ethereum } = useWallet()

	const lpContract = useMemo(() => {
		return getContract(ethereum as provider, lpTokenAddress)
	}, [ethereum, lpTokenAddress])

	const { onRedeem } = useRedeem(getMasterChefContract(panda))

	const lpTokenName = useMemo(() => {
		return lpToken.toUpperCase()
	}, [lpToken])

	const earnTokenName = useMemo(() => {
		return earnToken.toUpperCase()
	}, [earnToken])

	return (
		<>
			<PageHeader
				icon={icon}
				subtitle={`Deposit ${lpTokenName}  Tokens and earn PNDA`}
				title={name}
			/>
			<StyledFarm>
				<StyledCardsWrapper>
					<StyledCardWrapper>
						<Harvest pid={pid} />
					</StyledCardWrapper>
					<Spacer />
					<StyledCardWrapper>
						<Stake
							lpContract={lpContract}
							pid={pid}
							tokenName={lpToken.toUpperCase()}
							poolType={poolType}
						/>
					</StyledCardWrapper>
					<Spacer />
					<StyledCardWrapper>
						<Fee pid={pid} />
					</StyledCardWrapper>
				</StyledCardsWrapper>
				<Spacer size="lg" />
				<StyledInfo>
					❗️ <span style={{ fontWeight: 600, color: 'red' }}>Attention:</span> Please familiarize yourself with the fee structure before using PandaChef.
						Deposits are subject to a 0.75% fee. Withdrawal slashing fee of 0.1% - 50 % will be incurred
						when exiting a farm, depending on the length of time your LP was staked. Please <StyledLink href="https://docs.bao.finance/franchises/panda/pandaswap-fees-penalties" target="blank"> read
						the docs</StyledLink> to familiarize yourself with fees and penalties.
					</StyledInfo>
				<Spacer size="md" />
				<StyledInfo>
					⭐️ Every time you stake and unstake LP tokens, the contract will
					automagically claim PNDA rewards for you!
				</StyledInfo>
				<Spacer size="lg" />
			</StyledFarm>
		</>
	)
}

const StyledLink = styled.a`
	color: ${(props) => props.theme.color.grey[500]};
	text-decoration: none;
	font-weight: 600;
	&:hover {
		color: ${(props) => props.theme.color.grey[600]};
	}
`
const StyledFarm = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	@media (max-width: 102px) {
		width: 100%;
	}
`

const StyledCardsWrapper = styled.div`
	display: flex;
	width: 900px;
	@media (max-width: 768px) {
		width: 100%;
		flex-flow: column nowrap;
		align-items: center;
	}
`

const StyledCardWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	@media (max-width: 768px) {
		width: 80%;
	}
`

const StyledInfo = styled.h3`
	color: ${(props) => props.theme.color.grey[400]};
	font-size: 16px;
	font-weight: 400;
	margin: 0;
	padding: 0;
	text-align: center;
	max-width: 750px;
`

export default Farm
