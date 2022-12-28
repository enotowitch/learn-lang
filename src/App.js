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
import Icon from "./components/Icon";

export default function App() {

	// ! default cookies
	!document.cookie.match(/lastId/) && setCookie("lastId", 0)
	!document.cookie.match(/synonym/) && setCookie("synonym", "")
	!document.cookie.match(/usage/) && setCookie("usage", "")
	!document.cookie.match(/langFrom/) && setCookie("langFrom", "en")
	!document.cookie.match(/langTo/) && setCookie("langTo", "ru")
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

	// ! translate, synonymArr, usageArr, cookieSynonym, cookieUsage

	const [synonymArr, setSynonymArr] = useState([])
	const [usageArr, setUsageArr] = useState([])

	function translate() {
		if (add1.trim()) {
			// ! fetch 1 synonym
			fetch(`https://www.wordreference.com/enru/${add1}`)
				.then((response) => {
					return response.text();
				})
				.then((data) => {
					// ! cookieSynonym
					const cookieSynonym = []
					if (data.match(/'ToWrd'.*<em/g)) {
						// todo 1 regexp
						data.match(/'ToWrd'.*<em/g).map(synonym => cookieSynonym.push(synonym.replace(/'ToWrd'\s>|\s\<em"|<em|&|;|(<([^>]+)>)/g, "").trim()))
						console.log("CASE 1")
					} else if (data.match(/\s\S+<a class='footnote'/g)) {
						data.match(/\s\S+<a class='footnote'/g).map(synonym => cookieSynonym.push(synonym.replace(/&#x301;|<a class='footnote'|^\s|\(|href.*<\/a>|&|;|(<([^>]+)>)/g, "").trim()))
						console.log("CASE 2")
					} else if (data.match(/ruen\/.*? '|ruen\/.*?"/g)) {
						console.log("CASE 3")
						data.match(/ruen\/.*? '|ruen\/.*?"/g).map(synonym => cookieSynonym.push(synonym.replace(/&#x301;|ruen\/|"|&|;|(<([^>]+)>)/g, "").trim()))
					}
					console.log(cookieSynonym)
					setCookie("synonym", JSON.stringify(cookieSynonym))
					setSynonymArr(eval(getCookie("synonym")))
					// ? cookieSynonym
					setAdd2(cookieSynonym[0])
				});
			setWordTranslated(true)
			// ? fetch 1 synonym
			// ! fetch 2 usage
			fetch(`https://www.wordreference.com/englishcollocations/${add1}`)
				.then((response) => {
					return response.text();
				})
				.then((data) => {
					// ! cookieUsage
					const cookieUsage = []
					data.match(/<ol>.*?<li>.*?<\/li>/g).map(usage => cookieUsage.push(usage.replace(/<ol>|<li>|<\/li>/g, "")))
					setCookie("usage", JSON.stringify(cookieUsage))
					setUsageArr(eval(getCookie("usage")))
					// ? cookieUsage
				});
			// ? fetch 2 usage
		}
	}
	// ? translate, synonymArr, usageArr, cookieSynonym, cookieUsage

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

		const add_1 = add1.toLowerCase().trim()
		const add_2 = add2.toLowerCase().trim()

		let collectedSynonym = []
		document.querySelectorAll('.Synonym .Tag').forEach(t => t.innerText.trim() && collectedSynonym.push(t.innerText.trim()))
		let collectedUsage = []
		document.querySelectorAll('.Usage .Tag').forEach(t => t.innerText.trim() && collectedUsage.push(t.innerText.trim()))

		let exist
		words.map(word => word.toTranslate.toLowerCase().trim() === add_1 && word.translated.toLowerCase().trim() === add_2 && (exist = true))

		if (!exist) {
			setLastId(prev => prev + 1)
			setWords(prev => ([...prev, { id: lastId + 1, "toTranslate": add_1, "translated": add_2, status: "new", synonym: collectedSynonym, usage: collectedUsage, langFrom, langTo }]))
			localStorage.setItem(lastId + 1, JSON.stringify({ id: lastId + 1, "toTranslate": add_1, "translated": add_2, status: "new", synonym: JSON.stringify(collectedSynonym), usage: JSON.stringify(collectedUsage), langFrom, langTo }))
			setAdd1("")
			setAdd2("")
			setWordTranslated(false)
			setSynonymArr([])
			setUsageArr([])
			setUsage("")
		} else {
			alert(`word pair "${add1}" & "${add2}": already exists!`);
		}
	}
	// ? addFn

	// ! StatusBlock nums
	const calcNum = (status) => words.map(word => word.status === status && word.langFrom === langFrom && word.langTo === langTo).filter(t => t).length

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
		<Context.Provider value={{ words, setWords, answerStatus, setAnswerStatus, add1, setAdd1, add2, setAdd2, wordTranslated, translate, addFn, answer, setAnswer, lastCorrectAnswer, setLastCorrectAnswer, synonymArr, setSynonymArr, usageArr, setUsageArr, usage, setUsage, langFrom, setLangFrom, langTo, setLangTo, setWordTranslated }} >

			<Lang />

			<div onClick={drop}>
				<Button text="drop" className="drop danger ma" />
			</div>

			{/* back to "add new word" */}
			<div className="w100" onClick={() => setAnswerStatus("")}>
				<Icon src="add" classNameBg="m0a mb" />
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