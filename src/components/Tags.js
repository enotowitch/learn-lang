import React from "react"
import Tag from "./Tag"

export default function Tags(props) {

	const tagElements = props.tags.map(text => <Tag text={text} mode={props.mode} />)

	return (
		<>
			{tagElements}
		</>
	)
}