import React from "react"

export default function Button(props) {

	return (
		<button {...props} className={`${props.className}`}>{props.text}</button>
	)
}