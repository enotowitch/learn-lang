import React, { useContext } from "react"
import { Context } from "./../context"

export default function StatusBlock(props) {

	const { answerStatus, setAnswerStatus } = useContext(Context)
	return (
		<>
			<div className={`StatusBlock StatusBlock_main ${answerStatus === props.status && 'activeBlock'} ${props.status}`} onClick={() => setAnswerStatus(props.status)}>
				<span>{props.status}:</span><span>&nbsp;{props.num}</span>
			</div>
		</>
	)
}