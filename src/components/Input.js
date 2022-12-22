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
					onChange={(e) => props.setValue(e.target.value)
					}
				/>
			}
			{props.type === "textarea" &&
				<textarea
					className={props.className}
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