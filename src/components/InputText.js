import React from "react"

export default function InputText(props) {

	return (
		<input
			className={props.className}
			type="text"
			placeholder={props.placeholder}
			name={props.name}
			value={props.value}
			onChange={(e) => props.setValue(e.target.value)}
		/>
	)
}