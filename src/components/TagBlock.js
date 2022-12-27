import React from "react"
import Icon from "./Icon"
import IconText from "./IconText"
import Tags from "./Tags"

export default function TagBlock(props) {
	return (
		<>
			<div onClick={() => props.setShow(prev => !prev)}>
				<IconText src="arrow" text={props.text} rotate={props.show} />
			</div>

			{
				props.show &&
				<div className={`Tags ${props.text}`}>
					<Tags tags={props.tags} mode="write" />
					<div onClick={() => props.setTags(prev => [...prev, ""])}>
						<Icon src="add" />
					</div>
				</div>
			}
		</>
	)
}