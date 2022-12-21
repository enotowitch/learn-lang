import React, { useContext, useState } from "react"
import { Context } from "../context"
import Button from "./Button"
import InputText from "./InputText"
import IconText from "./IconText"
import Tags from "./Tags"
import Tag from "./Tag"

export default function Add() {

	const { add1, setAdd1, add2, setAdd2, wordTranslated, translate, addFn, tags } = useContext(Context)

	// ! showTags
	const [showTags, setShowTags] = useState(true)


	// ! RETURN
	return (
		<>
			<section className="addSection">
				<div>
					<InputText name="add1" placeholder="new word" value={add1} setValue={setAdd1} />
					{wordTranslated && <InputText name="add2" placeholder="translation" value={add2} setValue={setAdd2} />}
				</div>

				{!wordTranslated && <div onClick={translate}><Button text="translate" /></div>}

				{wordTranslated && <div onClick={addFn}><Button text="add" /></div>}

			</section>

			{
				wordTranslated &&
				<>
					<div onClick={() => setShowTags(prev => !prev)}>
						<IconText src="arrow" text="Synonym" rotate={showTags} />
					</div>

					{showTags &&
						<div className="Tags">
							<Tags tags={tags} mode="write" />
							{/* empty tag => so user can add synonym */}
							<Tag mode="write" />
						</div>
					}
				</>
			}
		</>
	)
}