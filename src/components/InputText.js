import React from "react"

export default function InputText(props) {

	return (
		<input
			type="text"
			placeholder={props.placeholder}
			name={props.name}
			value={props.value}
			onChange={(e) => props.setValue(e.target.value)}
		/>
	)
}