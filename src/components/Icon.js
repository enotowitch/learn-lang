import React from "react"

export default function Icon(props) {

	try {
		var src = require(`../../public/img/${props.src}.svg`)
	} catch (ex) {
		console.log("SRC NOT FOUND!")
	}

	const styleBg = props.rotate ? { "background": "#ACE1AF" } : { "background": "transparent" }
	const styleImg = props.rotate ? { "transform": "rotate(180deg)" } : { "transform": "rotate(0deg)" }

	return (
		<div className={`Icon__bg ${props.className}`} style={styleBg}>
			<img className={`Icon ${props.className}`} src={src} style={styleImg} />
		</div>
	)
}