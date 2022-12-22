import React from "react"

export default function Input(props) {

	return (
		<>
			{props.type === "text" &&
				<input
					className={props.className}
					type={props.type}
					placeholder={props.placeholder}
					name={props.name}
					value={props.value}
					onChange={(e) => props.setValue(e.target.value)}
					maxLength={props.maxLength}
				/>
			}
			{props.type === "textarea" &&
				<textarea
					className={props.className} // ACTIVE: className={`${props.className} ${props.value.trim().length > 0 && `${props.className + "_active"}`}`}
					type={props.type}
					placeholder={props.placeholder}
					name={props.name}
					value={props.value}
					onChange={(e) => props.setValue(e.target.value)
					}
				/>
			}
		</>
	)
}