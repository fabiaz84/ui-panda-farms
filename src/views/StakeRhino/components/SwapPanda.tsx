import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import ValueSmall from '../../../components/ValueSmall'
import useModal from '../../../hooks/useModal'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import useWithdraw from '../../../hooks/useWithdrawRhino'
import useAllowanceRhino from '../../../hooks/useAllowanceRhino'
import useApproveRhino from '../../../hooks/useApproveRhino'
import pnda from '../../../assets/img/pnda.png'
import useDeposit from '../../../hooks/useDepositRhino'
import { getPandaAddress, getPandaContract, getRhinoBalancePanda } from '../../../panda/utils'
import usePanda from '../../../hooks/usePanda'
import useSwapBalance1 from '../../../hooks/useSwapBalance1'

interface SwapPandaProps {
	withdrawableBalance: BigNumber
}

const SwapPanda: React.FC<SwapPandaProps> = ({ withdrawableBalance }) => {
	const panda = usePanda()
	const tokenName = 'PNDA'
	const address = useMemo(() => getPandaAddress(panda), [panda])
	const walletBalance = useTokenBalance(address)

	const [requestedApproval, setRequestedApproval] = useState(false)
	const contract = useMemo(() => getPandaContract(panda), [panda])
	const allowance = useAllowanceRhino(contract)
	const { onApprove } = useApproveRhino(contract)

	const { onDeposit } = useDeposit(address)
	const { onWithdraw } = useWithdraw(address)

	const [onPresentDeposit] = useModal(
		<DepositModal
			max={walletBalance}
			onConfirm={onDeposit}
			tokenName={tokenName}
			tokenDecimals={18}
		/>,
	)

	const [onPresentWithdraw] = useModal(
		<WithdrawModal
			max={withdrawableBalance}
			onConfirm={onWithdraw}
			tokenName={tokenName}
			tokenDecimals={9}
		/>,
	)

	const handleApprove = useCallback(async () => {
		try {
			setRequestedApproval(true)
			const txHash = await onApprove()
			// user rejected tx or didn't go thru
			if (!txHash) {
				setRequestedApproval(false)
			}
		} catch (e) {
			console.log(e)
		}
	}, [onApprove, setRequestedApproval])

	const pandaSupply = useSwapBalance1()

	return (
		<Card>
			<CardContent>
				<StyledCardContentInner>
					<StyledCardHeader>
						<CardIcon>
							<img src={pnda} alt="" height="50" />
						</CardIcon>
						<Value value={getBalanceNumber(walletBalance, 18)} />
						<Label text={`${tokenName} in wallet`} />
						<Value value={getBalanceNumber(withdrawableBalance, 9)} />
						<Label text={`${tokenName} withdrawable`} />
					</StyledCardHeader>
					<StyledCardActions>
						{!allowance.toNumber() ? (
							<Button
								disabled={
									requestedApproval || walletBalance.eq(new BigNumber(0))
								}
								onClick={handleApprove}
								text={`Approve ${tokenName}`}
							/>
						) : (
							<Button
								disabled={!address || walletBalance.eq(new BigNumber(0))}
								text={`Deposit ${tokenName}`}
								onClick={onPresentDeposit}
							/>
						)}
						<StyledActionSpacer />
						<Button
							disabled={!address || withdrawableBalance.eq(new BigNumber(0))}
							text={`Withdraw ${tokenName}`}
							onClick={onPresentWithdraw}
						/>
					</StyledCardActions>
				</StyledCardContentInner>
			</CardContent>
			<Footnote>
				In contract
				<FootnoteValue><ValueSmall value={getBalanceNumber(pandaSupply, 18)} /></FootnoteValue>
			</Footnote>
		</Card>
	)
}

const StyledCardHeader = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
`

const StyledCardActions = styled.div`
	display: flex;
	justify-content: center;
	margin-top: ${(props) => props.theme.spacing[5]}px;
	width: 100%;
`

const StyledActionSpacer = styled.div`
	height: ${(props) => props.theme.spacing[4]}px;
	width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
`

const Footnote = styled.div`
	font-size: 14px;
	padding: 8px 20px;
	color: ${(props) => props.theme.color.grey[400]};
	border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
	font-family: 'Roboto Mono', monospace;
	float: right;
`

export default SwapPanda
