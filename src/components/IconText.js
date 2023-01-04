import React from "react"
import Icon from "./Icon"

export default function IconText(props) {

	function IconTextFn(e) {
		props.bullFn(prev => !prev)
		e.target.closest(".IconText").classList.toggle("activeBlock")
	}

	return (
		<button className={`IconText ${props.className}`} onClick={IconTextFn}>
			<Icon src={props.src} rotate={props.rotate} classNameBg={props.classNameBg} />
			<span>{props.text}</span>
		</button>
	)
}