import React, { useContext, useEffect, useState } from "react"
import Input from "./Input"
import { Context } from "./../context"
import Icon from "./Icon"

export default function Tag(props) {

	const [tagState, setTagState] = useState(props.text || "")
	const { setAdd2, synonymArr, setSynonymArr, usageArr, setUsageArr } = useContext(Context)

	// ! toggleActive
	function toggleActive(e) {
		if (e.target.closest(".Tags").className.includes("Synonym")) {
			// style tag
			document.querySelectorAll(".Tag").forEach((t) => t.classList.remove("activeBlock"))
			e.target.classList.add("activeBlock")
			// set translation(add2) = a tag you clicked
			setAdd2(e.target.innerText)
			e.target.addEventListener("keyup", (e) => {
				// set translation(add2) = what you typed in tag
				setAdd2(e.target.innerText)
			})
		}
	}
	// ? toggleActive
	// ! deleteTag
	function deleteTag(e) {
		const tagText = e.target.closest(".Tag__wrap").querySelector(".Tag").innerText
		// synonym
		if (e.target.closest(".Tags").className.includes("Synonym")) {
			const deleted = synonymArr.filter(s => s !== tagText)
			setSynonymArr(deleted)
		}
		// usage
		if (e.target.closest(".Tags").className.includes("Usage")) {
			const deleted = usageArr.filter(s => s !== tagText)
			setUsageArr(deleted)
		}
		// erase "custom" tag text
		e.target.closest(".Tag__wrap").querySelector(".Tag").innerText = ""
	}
	// update tagState when delete tag
	useEffect(() => {
		setTagState(props.text)
	}, [synonymArr, usageArr])
	// ? deleteTag


	// ! RETURN
	return (
		<>
			{props.mode === "write" &&
				<div className="Tag__wrap" onClick={toggleActive}>
					<Input type="textarea" className="Tag" value={tagState} setValue={setTagState} />
					<div onClick={deleteTag}>
						<Icon src="del" />
					</div>
				</div>
			}

			{props.mode === "read" && <div className="Tag Tag_read bshn">{props.text}</div>}
		</>
	)
}