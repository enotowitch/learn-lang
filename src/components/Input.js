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
				<div
					className={props.className} // ACTIVE: className={`${props.className} ${props.value.trim().length > 0 && `${props.className + "_active"}`}`}
					onChange={(e) => props.setValue(e.target.value)
					}
					contentEditable
				>
					{props.value}
				</div>
			}
			{
				props.type === "select" &&
				<select
					className={props.className}
					name={props.name}
					value={props.value}
					onChange={(e) => props.setValue(e.target.value)
					}
				>
					<option>en</option>
					<option>uk</option>
					<option>de</option>
					<option>fr</option>
					<option>ru</option>
				</select>
			}
		</>
	)
}