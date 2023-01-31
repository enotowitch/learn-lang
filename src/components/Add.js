import React, { useContext, useState } from "react"
import { Context } from "../context"
import Button from "./Button"
import Icon from "./Icon"
import Input from "./Input"
import List from "./List"
import TagBlock from "./TagBlock"

export default function Add() {

	const { add1, setAdd1, add2, setAdd2, wordTranslated, setWordTranslated, translate, addFn, synonymArr, setSynonymArr, usageArr, setUsageArr, list, setList } = useContext(Context)

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

					{wordTranslated && <Icon src="del" classNameBg="m0a mb" onClick={clearTranslation} />}

					<div className="m0a">
						<Input type="text" className="mb" name="add1" placeholder="new word" value={add1} setValue={setAdd1} />
						{wordTranslated && <Input type="text" className="mb" name="add2" placeholder="translation" value={add2} setValue={setAdd2} />}

						{wordTranslated &&
							<List />
						}
					</div>

					{!wordTranslated && <Button text="translate" onClick={translate} />}
					{wordTranslated && <Button text="add" onClick={addFn} className="mt" />}

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