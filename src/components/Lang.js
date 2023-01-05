import React, { useContext } from "react"
import { Context } from "../context"
import Input from "./Input"
import Icon from "./Icon"

export default function Lang() {

	const { langFrom, setLangFrom, langTo, setLangTo } = useContext(Context)

	return (
		<div className="lang__wrap ma">
			<Input type="select" className="lang" value={langFrom} setValue={setLangFrom} />

			<Icon src="arrow_r" className="bn" onClick={() => (setLangFrom(langTo), setLangTo(langFrom))} />

			<Input type="select" className="lang" value={langTo} setValue={setLangTo} />
		</div>
	)
}