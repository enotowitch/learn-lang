import React, { useContext } from "react"
import { Context } from "../context"
import Button from "./Button"
import InputText from "./InputText"

export default function Add() {

	const { add1, setAdd1, add2, setAdd2, wordChecked, translate, addFn } = useContext(Context)

	return (
		<section className="addSection">
			<div>
				<InputText name="add1" placeholder="new word" value={add1} setValue={setAdd1} />
				<InputText name="add2" placeholder="translation" value={add2} setValue={setAdd2} />
			</div>

			<div onClick={translate}>
				<Button text="translate" />
			</div>

			{
				wordChecked &&
				<div onClick={addFn}>
					<Button text="add" />
				</div>
			}
		</section>
	)
}