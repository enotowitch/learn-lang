import React from "react"
import Icon from "./Icon"

export default function IconText(props) {
	return (
		<div className="IconText">
			<Icon src={props.src} rotate={props.rotate} />
			<span>{props.text}</span>
		</div>
	)
}