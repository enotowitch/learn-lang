import React from "react"

export default function Icon(props) {

	try {
		var src = require(`../../public/img/${props.src}.svg`)
	} catch (ex) {
		console.log("SRC NOT FOUND!")
	}

	const styleImg = props.rotate ? { "transform": "rotate(180deg)" } : { "transform": "rotate(0deg)" }

	return (
		<button {...props} className={`Icon__bg ${props.className} ${props.classNameBg}`}>
			<img className={`Icon ${props.className}`} src={src} style={styleImg} />
		</button>
	)
}