import React, { useContext, useState } from "react"
import get from "../functions/get"
import { Context } from "../context"
import Input from "./Input"
import Icon from "./Icon"
import UseOutside from "../hooks/useOutside"

export default function List(props) {

	const { list, setList, listNum, setListNum, setWordAlert } = useContext(Context)

	// ! showLists, changeList, searchList
	const lists = get("lists") && get("lists").map(list => <div onClick={changeList} className="list__option">{list || "no list"}</div>)

	function changeList(e) {
		const { innerText: listName } = e.target

		setList(listName)
		setListNum(get("lists").indexOf(listName)) // in Answer Comp when select listName from List
		setShowLists(false)
	}

	function searchList(e) {
		const value = e.target.closest("div").querySelector("input").value

		setList(value)
		// setListNum => search num, else if search input value is "" setListNum of "no list" 
		value ? setListNum(get("lists").indexOf(value)) : setListNum(get("lists").indexOf("no list"))
		setShowLists(false)

		setWordAlert("No list found")
	}

	const [showLists, setShowLists] = useState(false)
	// ? showLists, changeList, searchList


	return (
		<div className="list__wrap">
			<div className="f">
				<Input type="text" className="list__input" name="list" placeholder="no list" value={list} setValue={setList} />
				<Icon src="arrow" onClick={() => setShowLists(prev => !prev)} classNameBg="list__icon" />
				{props.search && <Icon src="search" onClick={searchList} classNameBg="list__icon" />}
			</div>

			{showLists &&
				<UseOutside hideClass="list__wrap" setVisibility={setShowLists}>
					<div className="list__options zi3">
						{lists}
					</div>
				</UseOutside>
			}

		</div>
	)
}