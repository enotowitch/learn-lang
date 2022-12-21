import React, { useState } from "react"
import InputText from "./InputText"

export default function Tag(props) {

	const [tagState, setTagState] = useState(props.text || "")

	function toggleActive(e) {
		e.target.classList.toggle("Tag_active")
	}

	return (
		<>
			{props.mode === "write" &&
				<div onClick={toggleActive}>
					<InputText className="Tag" placeholder="add synonym" value={tagState} setValue={setTagState} />
				</div>
			}

			{props.mode === "read" && <div className="Tag Tag_read">{props.text}</div>}
		</>
	)
}