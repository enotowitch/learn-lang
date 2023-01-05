import React from "react"
import Icon from "./Icon"
import IconText from "./IconText"
import Tags from "./Tags"

export default function TagBlock(props) {
	return (
		<>
			<IconText src="arrow" text={props.text} rotate={props.show} bullFn={props.setShow} className="activeBlock" classNameBg="sui bshn" />

			{
				props.show &&
				<div className={`Tags ${props.text}`}>
					<Tags tags={props.tags} mode="write" />
					{/* add empty tag */}
					<Icon src="add" className="m0a" classNameBg="mt mb" onClick={() => props.setTags(prev => [...prev, ""])} />
				</div>
			}
		</>
	)
}