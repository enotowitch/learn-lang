import React, { useEffect, useRef } from "react"

function useOutsideFn(ref, setVisibility, hideClass) {
	useEffect(() => {

		const clickOutsideHidesThis = document.querySelector(`.${hideClass}`)

		function handleClick(e) {
			if (!clickOutsideHidesThis.contains(e.target)) {
				setVisibility(false)
			}
		}

		document.addEventListener("click", handleClick)
	}, [ref])
}



export default function useOutside(props) {

	const { children, setVisibility, hideClass } = props

	const ref = useRef(null)
	useOutsideFn(ref, setVisibility, hideClass)

	return (
		<div ref={ref}>{children}</div>
	)
}