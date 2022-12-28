import React, { useContext, useState } from "react"
import { Context } from "../context"
import Button from "./Button"
import Icon from "./Icon"
import Input from "./Input"
import TagBlock from "./TagBlock"

export default function Add() {

	const { add1, setAdd1, add2, setAdd2, wordTranslated, setWordTranslated, translate, addFn, synonymArr, setSynonymArr, usageArr, setUsageArr } = useContext(Context)

	// ! showSynonym
	const [showSynonym, setShowSynonym] = useState(true)
	// ! showUsage
	const [showUsage, setShowUsage] = useState(true)
	// ! clearTranslation
	function clearTranslation() {
		setWordTranslated(prev => !prev)
		setAdd1("")
		document.querySelector('[name="add1"]').focus()
	}


	// ! RETURN
	return (
		<>
			<section className="addSection">
				<div className="addSection__top">

					<div onClick={clearTranslation}>
						{wordTranslated && <Icon src="del" />}
					</div>

					<div className="m0a">
						<Input type="text" name="add1" placeholder="new word" value={add1} setValue={setAdd1} />
						{wordTranslated && <Input type="text" name="add2" placeholder="translation" value={add2} setValue={setAdd2} />}
					</div>

					{!wordTranslated && <div onClick={translate}><Button text="translate" /></div>}
					{wordTranslated && <div onClick={addFn}><Button text="add" /></div>}

				</div>


			</section>

			{
				wordTranslated &&
				<>
					<TagBlock setShow={setShowSynonym} text="Synonym" show={showSynonym}
						tags={synonymArr} setTags={setSynonymArr} />

					<TagBlock setShow={setShowUsage} text="Usage" show={showUsage}
						tags={usageArr} setTags={setUsageArr} />
				</>
			}
		</>
	)
}