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
import save from "./functions/save";
import get from "./functions/get";

export default function App() {

	// ! default cookies
	!document.cookie.match(/lastId/) && setCookie("lastId", 0)
	!document.cookie.match(/synonym/) && setCookie("synonym", "")
	!document.cookie.match(/usage/) && setCookie("usage", "")
	!document.cookie.match(/langFrom/) && setCookie("langFrom", "en")
	!document.cookie.match(/langTo/) && setCookie("langTo", "ru")
	!document.cookie.match(/random/) && setCookie("random", "false")
	// ? default cookies

	// ! wordTranslated,	words, lastId
	const [wordTranslated, setWordTranslated] = useState(false)
	const [words, setWords] = useState(data)
	const [lastId, setLastId] = useState(Number(getCookie("lastId")))

	useEffect(() => {
		setCookie("lastId", lastId)
	}, [lastId])
	// ? wordTranslated,	words, lastId
	// ! add1, add2, answer, answerStatus, lastCorrectAnswer, usage, wordAlert
	const [add1, setAdd1] = useState("")
	const [add2, setAdd2] = useState("")
	const [list, setList] = useState("")
	const [listNum, setListNum] = useState(0)
	const [answer, setAnswer] = useState("")
	const [usage, setUsage] = useState("")
	const [wordAlert, setWordAlert] = useState("No words left")

	const [answerStatus, setAnswerStatus] = useState("")

	useEffect(() => {
		setAnswer("")
	}, [answerStatus])

	const [lastCorrectAnswer, setLastCorrectAnswer] = useState("")
	// ? add1, add2, answer, answerStatus, lastCorrectAnswer, usage, wordAlert

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
	// ! random
	const [random, setRandom] = useState(eval(getCookie("random")))

	useEffect(() => {
		setCookie("random", random)
	}, [random])
	// ? random

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
		const list_ = list ? list.toLowerCase().trim() : "no list"

		let collectedSynonym = []
		document.querySelectorAll('.Synonym .Tag').forEach(t => t.innerText.trim() && collectedSynonym.push(t.innerText.trim()))
		let collectedUsage = []
		document.querySelectorAll('.Usage .Tag').forEach(t => t.innerText.trim() && collectedUsage.push(t.innerText.trim()))

		let exist
		words.map(word => word.toTranslate.toLowerCase().trim() === add_1 && word.translated.toLowerCase().trim() === add_2 && (exist = true))

		if (!exist) {
			// id
			setLastId(prev => prev + 1)
			// save word
			setWords(prev => ([...prev, { id: lastId + 1, "toTranslate": add_1, "translated": add_2, list: list_, status: "new", synonym: collectedSynonym, usage: collectedUsage, langFrom, langTo }]))
			save(lastId + 1, { id: lastId + 1, "toTranslate": add_1, "translated": add_2, list: list_, status: "new", synonym: JSON.stringify(collectedSynonym), usage: JSON.stringify(collectedUsage), langFrom, langTo })
			// save list
			const oldLists = get("lists")
			oldLists && !oldLists.includes(list_) && save("lists", [...oldLists, list_])
			!oldLists && save("lists", [list_])
			// null inputs
			setAdd1("")
			setAdd2("")
			// null other
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

	// ! style translated onscroll (sticky translated)
	useEffect(() => {
		window.onscroll = () => {
			const translated = document.querySelector(".translated")
			if (window.scrollY >= translated.offsetTop) {
				translated.style.border = "10px solid #e8e8e8"
				translated.style.borderBottomLeftRadius = "10px"
				translated.style.borderBottomRightRadius = "10px"
			} else {
				translated.style.border = "none"
			}
		}
	}, [])
	// ? style translated onscroll (sticky translated)


	// ! RETURN
	return (
		<Context.Provider value={{ words, setWords, answerStatus, setAnswerStatus, add1, setAdd1, add2, setAdd2, wordTranslated, translate, addFn, answer, setAnswer, lastCorrectAnswer, setLastCorrectAnswer, synonymArr, setSynonymArr, usageArr, setUsageArr, usage, setUsage, langFrom, setLangFrom, langTo, setLangTo, setWordTranslated, random, setRandom, list, setList, listNum, setListNum, wordAlert, setWordAlert }} >

			<Lang />

			<Button text="drop" className="drop danger ma" onClick={drop} />

			{/* back to "add new word" */}
			<Icon src="add" classNameBg="m0a mb" onClick={() => setAnswerStatus("")} />

			<div className="StatusBlocks">
				<StatusBlock status="new" num={calcNum("new") || 0} />
				<StatusBlock status="learned" num={calcNum("learned") || 0} />
				<StatusBlock status="repeat" num={calcNum("repeat") || 0} />
				<StatusBlock status="learn" num={calcNum("learn") || 0} />
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