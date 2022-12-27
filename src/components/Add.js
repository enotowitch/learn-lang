import React, { useContext, useEffect, useState } from "react"
import { Context } from "../context"
import Button from "./Button"
import Input from "./Input"
import IconText from "./IconText"
import Tags from "./Tags"
import Tag from "./Tag"
import Icon from "./Icon"

export default function Add() {

	const { add1, setAdd1, add2, setAdd2, wordTranslated, translate, addFn, synonymArr, setSynonymArr, usageArr } = useContext(Context)

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
					<div onClick={() => setShowSynonym(prev => !prev)}>
						<IconText src="arrow" text="Synonym" rotate={showSynonym} />
					</div>

					{showSynonym &&
						<div className="Tags synonymTags">
							<Tags tags={synonymArr} mode="write" />
							{/* empty tag => so user can add synonym */}
							<Tag mode="write" />
							<div onClick={() => setSynonymArr(prev => [...prev, ""])}>
								<Icon src="add" />
							</div>
						</div>
					}

					<div onClick={() => setShowUsage(prev => !prev)}>
						<IconText src="arrow" text="Usage" rotate={showUsage} />
					</div>

					{showUsage &&
						<div className="Tags usageTags">
							<Tags tags={usageArr} mode="write" />
							{/* empty tag => so user can add usage */}
							<Tag mode="write" />
						</div>
					}

				</>
			}
		</>
	)
}