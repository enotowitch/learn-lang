import React from "react"
import Icon from "./Icon"

export default function IconText(props) {
	return (
		<div className="IconText" onClick={() => props.bullFn(prev => !prev)}>
			<Icon src={props.src} rotate={props.rotate} />
			<span>{props.text}</span>
		</div>
	)
}