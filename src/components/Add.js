import React, { useContext, useState } from "react"
import { Context } from "../context"
import Button from "./Button"
import Input from "./Input"
import TagBlock from "./TagBlock"

export default function Add() {

	const { add1, setAdd1, add2, setAdd2, wordTranslated, translate, addFn, synonymArr, setSynonymArr, usageArr, setUsageArr } = useContext(Context)

	// ! showSynonym
	const [showSynonym, setShowSynonym] = useState(true)
	// ! showUsage
	const [showUsage, setShowUsage] = useState(true)


	// ! RETURN
	return (
		<>
			<section className="addSection">
				<div>
					<Input type="text" name="add1" placeholder="new word" value={add1} setValue={setAdd1} />
					{wordTranslated && <Input type="text" name="add2" placeholder="translation" value={add2} setValue={setAdd2} />}
				</div>

				{!wordTranslated && <div onClick={translate}><Button text="translate" /></div>}

				{wordTranslated && <div onClick={addFn}><Button text="add" /></div>}

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