import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import { getBalanceNumber } from '../../../utils/formatBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { Contract } from 'web3-eth-contract'
import useModal from '../../../hooks/useModal'
import WithdrawModal from './WithdrawModal'
import BigNumber from 'bignumber.js'
import { getRhinoContract } from '../../../panda/utils'
import useDeposit from '../../../hooks/useDepositRhino'
import usePanda from '../../../hooks/usePanda'
import DepositModal from './DepositModal'
import rhino from '../../../assets/img/rhino-a.png'
import useWithdraw from '../../../hooks/useWithdrawRhino'
import useAllowanceRhino from '../../../hooks/useAllowanceRhino'
import useApproveRhino from '../../../hooks/useApproveRhino'

interface SwapRhinoProps {
	withdrawableBalance: BigNumber
}

const SwapRhino: React.FC<SwapRhinoProps> = ({ withdrawableBalance }) => {
	const panda = usePanda()

	const address = useMemo(() => getRhinoContract(panda)?.options.address, [
		panda,
	])
	const walletBalance = useTokenBalance(address)

	const [requestedApproval, setRequestedApproval] = useState(false)
	const contract = useMemo(() => getRhinoContract(panda), [panda])
	const allowance = useAllowanceRhino(contract)
	const { onApprove } = useApproveRhino(contract)

	const { onDeposit } = useDeposit(address)
	const { onWithdraw } = useWithdraw(address)

	const tokenName = 'RHINO'
	const tokenDecimals = 9

	const [onPresentDeposit] = useModal(
		<DepositModal
			max={walletBalance}
			onConfirm={onDeposit}
			tokenName={tokenName}
			tokenDecimals={tokenDecimals}
		/>,
	)

	const [onPresentWithdraw] = useModal(
		<WithdrawModal
			max={withdrawableBalance}
			onConfirm={onWithdraw}
			tokenName={tokenName}
			tokenDecimals={tokenDecimals}
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

	return (
		<Card>
			<CardContent>
				<StyledCardContentInner>
					<StyledCardHeader>
						<CardIcon>
							<img src={rhino} alt="" height="50" />
						</CardIcon>
						<Value value={getBalanceNumber(walletBalance, tokenDecimals)} />
						<Label text={`${tokenName} in wallet`} />
						<Value
							value={getBalanceNumber(withdrawableBalance, tokenDecimals)}
						/>
						<Label text={`${tokenName} withdrawable `} />
					</StyledCardHeader>
					<StyledCardActions>
						{!allowance.toNumber() ? (
							<Button
								disabled={
									requestedApproval || walletBalance.eq(new BigNumber(0))
								}
								onClick={handleApprove}
								text={`⬇Approve ${tokenName}`}
							/>
						) : (
							<Button
								disabled={!address || walletBalance.eq(new BigNumber(0))}
								text={`⬇Deposit ${tokenName}`}
								onClick={onPresentDeposit}
							/>
						)}
						<StyledActionSpacer />
						<Button
							disabled={!address || withdrawableBalance.eq(new BigNumber(0))}
							text={`⬆Withdraw ${tokenName}`}
							onClick={onPresentWithdraw}
						/>
					</StyledCardActions>
				</StyledCardContentInner>
			</CardContent>
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
	margin-top: ${(props) => props.theme.spacing[6]}px;
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

export default SwapRhino
