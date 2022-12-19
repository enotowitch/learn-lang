import React, { useContext } from "react"
import { Context } from "./../context"

export default function StatusBlock(props) {

	const { answerStatus, setAnswerStatus, statusBlockToggle, setStatusBlockToggle } = useContext(Context)
	
	function toggleBlock() {
		setStatusBlockToggle(prev => prev + 1)
		if (statusBlockToggle % 2 === 0) {
			setAnswerStatus(props.status)
		} else {
			setAnswerStatus("")
		}
	}

	return (
		<>
			<div className={`StatusBlock StatusBlock_main ${answerStatus === props.status && 'activeBlock'}`} onClick={toggleBlock}>
				<span>{props.status}:</span><span>&nbsp;{props.num}</span>
			</div>
		</>
	)
}