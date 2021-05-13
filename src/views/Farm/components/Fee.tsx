import React from 'react'
import styled from 'styled-components'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Value from '../../../components/Value'
import ValueSmall from '../../../components/ValueSmall'
import useValues from '../../../hooks/useValues'
import useSubValues from '../../../hooks/useSubValues'
import { decimate } from '../../../utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import Spacer from '../../../components/Spacer'
import usePanda from '../../../hooks/usePanda'
import useFees from '../../../hooks/useFees'
import pandaIcon from '../../../assets/img/pnda.png'
import useEarnings from '../../../hooks/useEarnings'
import useFirstDepositBlock from '../../../hooks/useFirstDepositBlock'
import useLastWithdrawBlock from '../../../hooks/useLastWithdrawBlock'
import useLastDepositBlock from '../../../hooks/useLastDepositBlock'
import useBlock from '../../../hooks/useBlock'
import useBlockDiff from '../../../hooks/useBlockDiff'

interface FeeProps {
	pid: number
}

const Fee: React.FC<FeeProps> = ({ pid }) => {
	const firstDepositBlock = useFirstDepositBlock (pid)
	const lastWithdrawBlock = useLastWithdrawBlock (pid)
	const lastDepositBlock = useLastDepositBlock (pid)
	const fees = useFees(pid)
	const blockDiff = useBlockDiff(pid)
	const lastInteraction = new Date(
		new Date().getTime() - 1000 * (blockDiff * 3)
	).toLocaleString()

	return (
	<Card>
		<CardContent>
			<StyledCardContentInner>
					<StyledInfoHeader>
						Deposit Fee
					</StyledInfoHeader>
					<Spacer />
					<StyledInfo>
						A 0.75% deposit fee for every deposit.<br />
						<br />
						First deposit block: {(firstDepositBlock * 1).toFixed(0)}
						<br />
						Last deposit block: {(lastDepositBlock)}
					</StyledInfo>
					<Spacer />
					<StyledInfoHeader>
						Withdraw Fee
					</StyledInfoHeader>
					<Spacer />
					<StyledInfo>
					Fee percentage: {(fees * 100).toFixed(2)}%<br />
					<br />
					Blocks passed: {(blockDiff)}<br />
					Last interaction: {(lastInteraction).toString()}
          </StyledInfo>
					<Spacer />
					<StyledInfo>
					Last withdraw block: {(lastWithdrawBlock)}
					</StyledInfo>
					<br />
					<StyledInfo>
						<b>Disclaimer</b><br />The first deposit activates and each withdraw resets the timer for penalities and fees, this is pool based.
					</StyledInfo>
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

const StyledSpacer = styled.div`
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
const StyledInfo = styled.h3`
	color: ${(props) => props.theme.color.grey[400]};
	font-size: 16px;
	font-weight: 400;
	margin: 0;
	padding: 0;
	text-align: center;
	max-width: 750px;
`
const StyledInfoHeader = styled.h3`
	color: ${(props) => props.theme.color.grey[400]};
	font-size: 20px;
	font-weight: bold;
	margin: 0;
	padding: 0;
	text-align: center;
	max-width: 750px;
`

export default Fee
