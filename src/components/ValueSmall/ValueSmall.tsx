import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'

import styled from 'styled-components'

interface ValueSmallProps {
	value: string | number
	decimals?: number
}

const ValueSmall: React.FC<ValueSmallProps> = ({ value, decimals }) => {
	const [start, updateStart] = useState(0)
	const [end, updateEnd] = useState(0)

	useEffect(() => {
		if (typeof value === 'number') {
			updateStart(end)
			updateEnd(value)
		}
	}, [value])

	return (
		<StyledValueSmall>
			{typeof value == 'string' ? (
				value
			) : (
				<CountUp
					start={start}
					end={end}
					decimals={
						decimals !== undefined ? decimals : end < 0 ? 4 : end > 1e5 ? 0 : 3
					}
					duration={1}
					separator=","
				/>
			)}
		</StyledValueSmall>
	)
}

const StyledValueSmall = styled.div`
	font-family: 'Roboto Mono', monospace;
	color: ${(props) => props.theme.color.grey[600]};
	font-size: 14px;
	font-weight: bold;
`

export default ValueSmall
