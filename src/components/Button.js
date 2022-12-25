import React from "react"

export default function Button(props) {

	return (
		<button className={`ml ${props.className}`}>{props.text}</button>
	)
}