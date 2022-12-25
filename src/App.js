/* 
TO SEE COMMENTS (! = start, ? = end) INSTALL EXTENSION:
Name: Better Comments
Id: aaron-bond.better-comments 
*/

import React, { useState, useEffect } from "react"
import { Context } from "./context"
import getCookie from "./functions/getCookie";
import setCookie from "./functions/setCookie";
import data from "./data"
import StatusBlock from "./components/StatusBlock";
import Answer from "./components/Answer";
import Add from "./components/Add";
import Lang from "./components/Lang";
import Button from "./components/Button";

export default function App() {

	// ! default cookies
	!document.cookie.match(/lastId/) && setCookie("lastId", 0)
	!document.cookie.match(/tags/) && setCookie("tags", "")
	!document.cookie.match(/langFrom/) && setCookie("langFrom", "EN")
	!document.cookie.match(/langTo/) && setCookie("langTo", "RU")
	// ? default cookies

	// ! wordTranslated,	words, lastId
	const [wordTranslated, setWordTranslated] = useState(false)
	const [words, setWords] = useState(data)
	const [lastId, setLastId] = useState(Number(getCookie("lastId")))

	useEffect(() => {
		setCookie("lastId", lastId)
	}, [lastId])
	// ? wordTranslated,	words, lastId
	// ! add1, add2, answer, answerStatus, lastCorrectAnswer, usage
	const [add1, setAdd1] = useState("")
	const [add2, setAdd2] = useState("")
	const [answer, setAnswer] = useState("")
	const [usage, setUsage] = useState("")

	const [answerStatus, setAnswerStatus] = useState("")

	useEffect(() => {
		setAnswer("")
	}, [answerStatus])

	const [lastCorrectAnswer, setLastCorrectAnswer] = useState("")
	// ? add1, add2, answer, answerStatus, lastCorrectAnswer, usage

	// ! langFrom, langTo
	const [langFrom, setLangFrom] = useState(getCookie("langFrom"))
	const [langTo, setLangTo] = useState(getCookie("langTo"))

	useEffect(() => {
		setCookie("langFrom", langFrom)
	}, [langFrom])
	useEffect(() => {
		setCookie("langTo", langTo)
	}, [langTo])
	// ? langFrom, langTo

	// ! translate, tags, cookieTags

	const [tags, setTags] = useState([])

	function translate() {
		if (add1.trim()) {
			fetch(`https://api.mymemory.translated.net/get?q=${add1}!&langpair=${langFrom}|${langTo}`)
				.then((response) => response.json())
				.then((responseText) => {
					// ! cookieTags
					const cookieTags = []
					responseText.matches.map(tag => cookieTags.push(tag.translation))
					setCookie("tags", JSON.stringify(cookieTags))
					setTags(eval(getCookie("tags")))
					// ? cookieTags

					setAdd2(responseText.responseData.translatedText)
				});
			setWordTranslated(true)
		}
	}
	// ? translate, tags, cookieTags

	// ! addFn
	function addFn() {
		if (!add1.trim()) {
			alert("Please add a new word")
			return
		}
		if (!add2.trim()) {
			alert("Please add the translation")
			return
		}

		// ! synonym
		const synonym = []
		document.querySelectorAll(".Tag_active").forEach(tag => tag.value.trim() && synonym.push(tag.value))
		// ! usage
		const usage = document.querySelector(".usage").value.trim()

		let exist
		words.map(word => word.toTranslate.toLowerCase().trim() === add1.toLowerCase().trim() && (exist = true))

		if (!exist) {
			setLastId(prev => prev + 1)
			setWords(prev => ([...prev, { id: lastId + 1, "toTranslate": add1, "translated": add2, status: "new", synonym: synonym, usage: usage, langFrom, langTo }]))
			localStorage.setItem(lastId + 1, JSON.stringify({ id: lastId + 1, "toTranslate": add1, "translated": add2, status: "new", synonym: JSON.stringify(synonym), usage: usage, langFrom, langTo }))
			setAdd1("")
			setAdd2("")
			setWordTranslated(false)
			setTags([])
			setUsage("")
		} else {
			alert("word already exists!");
		}
	}
	// ? addFn

	// ! StatusBlock nums
	const calcNum = (status) => words.map(word => word.status === status && word.langFrom === langFrom && word.langTo === langTo).filter(t => t).length

	// ! statusBlockToggle
	const [statusBlockToggle, setStatusBlockToggle] = useState(0)
	useEffect(() => {
		setStatusBlockToggle(0)
	}, [answerStatus])
	// ? statusBlockToggle

	// ! drop
	function drop() {
		if (window.confirm("DELETE ALL WORDS?")) {
			localStorage.clear()
			document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
			window.location.reload()
		}
	}
	// ? drop


	// ! RETURN
	return (
		<Context.Provider value={{ words, setWords, answerStatus, setAnswerStatus, add1, setAdd1, add2, setAdd2, wordTranslated, translate, addFn, answer, setAnswer, lastCorrectAnswer, setLastCorrectAnswer, statusBlockToggle, setStatusBlockToggle, tags, usage, setUsage, langFrom, setLangFrom, langTo, setLangTo }} >

			<Lang />

			<div onClick={drop}>
				<Button text="drop" className="drop danger ma" />
			</div>

			<div className="StatusBlocks">
				<StatusBlock status="new" num={calcNum("new") || 0} />
				<StatusBlock status="learned" num={calcNum("learned") || 0} />
				<StatusBlock status="to repeat" num={calcNum("to repeat") || 0} />
				<StatusBlock status="to learn" num={calcNum("to learn") || 0} />
			</div>
			{
				!answerStatus ?
					<Add />
					:
					<Answer />
			}

		</Context.Provider>
	)
}