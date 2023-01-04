import React, { useContext, useState, useEffect } from "react"
import { Context } from "./../context"
import AnswerBlock from "./AnswerBlock"
import Button from "./Button"
import Icon from "./Icon"
import IconText from "./IconText"
import Input from "./Input"
import Tags from "./Tags"

export default function Answer() {

	let { words, setWords, answerStatus, answer, setAnswer, lastCorrectAnswer, setLastCorrectAnswer, langFrom, langTo, random, setRandom } = useContext(Context)

	answer = answer.toLowerCase()

	// ! curWords, word, wordToTranslate, mistake, wordNum, randomNum 
	let curWords = []
	words.map(word => word.status === answerStatus && word.langFrom === langFrom && word.langTo === langTo && (curWords.push(word)))

	// ! wordNum
	const [wordNum, setWordNum] = useState(0)

	const randomNum = random ? Math.floor(Math.random() * curWords.length) : 0
	useEffect(() => {
		// new StatusBlock visited (answerStatus changed) => "set word to random word or to first word"
		random ? setWordNum(randomNum) : setWordNum(0)
	}, [answerStatus])
	// ? wordNum

	const word = curWords[wordNum]
	const wordToTranslate = word && word.toTranslate.toLowerCase()

	const [mistake, setMistake] = useState(0)
	// word changed, new StatusBlock visited, correct answer => setMistake(0)
	useEffect(() => {
		setMistake(0)
	}, [wordNum, answerStatus, lastCorrectAnswer])
	// ? curWords, word, wordToTranslate, mistake, wordNum, randomNum 

	// ! answerBlocks length & put '?' to answerBlock 
	let calcQuestionMarks = []

	if (wordToTranslate) {
		for (let i = 0; i < wordToTranslate.length; i++) {
			calcQuestionMarks.push('?')
		}
	}

	const [letters, setLetters] = useState(calcQuestionMarks)
	// refresh answerBlocks length when: new StatusBlock visited, correct answer, new word displays
	useEffect(() => {
		setLetters(calcQuestionMarks)
	}, [answerStatus, lastCorrectAnswer, wordNum])


	const answerBlocks = letters.map(letter => <AnswerBlock letter={letter} />)
	// ? answerBlocks length & put '?' to answerBlock 

	// ! correct letters
	let toTranslateArr, answerArr, letterArr
	if (wordToTranslate) {
		toTranslateArr = wordToTranslate.split('')
		answerArr = answer.split('')
		letterArr = []
	}
	// ? correct letters

	function checkAnswer() {
		// ! correct letters
		for (let i = 0; i < toTranslateArr.length; i++) {
			if (toTranslateArr[i] === answerArr[i]) {
				letterArr.push(answerArr[i])
			} else {
				letterArr.push('?')
			}
		}
		setLetters(letterArr)
		// ? correct letters

		// ! calculatedStatus, setMistake
		let calculatedStatus

		// WRONG ANSWER
		// ! put 1,2,3... letter to answerBlock & to answer input
		if (wordToTranslate !== answer) {
			setMistake(prev => prev + 1)
			letterArr[mistake] = toTranslateArr[mistake]
			setAnswer(letterArr.join(''))
		}
		// ? put 1,2,3... letter to answerBlock & to answer input

		// ! rules logic
		mistake === 0 && (calculatedStatus = "learned")
		mistake === 1 && (calculatedStatus = "repeat")
		mistake > 1 && (calculatedStatus = "learn")
		// ? rules logic

		// CORRECT ANSWER
		if (wordToTranslate === answer) {
			words.map(wordObj => {
				wordObj.toTranslate === answer && (wordObj.status = calculatedStatus)
				wordObj.toTranslate === answer && localStorage.setItem(wordObj.id, JSON.stringify(wordObj))
			})
			setLastCorrectAnswer(answer)
			// ! color body
			mistake === 0 && (document.querySelectorAll("body, input, select").forEach(el => el.style.background = "#ACE1AF")) // green = learned
			mistake === 1 && (document.querySelectorAll("body, input, select").forEach(el => el.style.background = "#fff0c1")) // yellow = repeat
			mistake > 1 && (document.querySelectorAll("body, input, select").forEach(el => el.style.background = "#ffcbcb")) // red = learn
			setTimeout(() => {
				document.querySelectorAll("body, input, select").forEach(el => el.style.background = "#efefef") // white
			}, 1500);
			// ? color body
		}
		// ? calculatedStatus, setMistake
	}

	// ! deleteWord
	function deleteWord() {
		const translated = document.querySelector('.translated__word').innerText
		if (window.confirm(`Delete word "${translated}"?`)) {
			const deleted = words.filter(w => {
				return w.id != word.id
			})
			setWords(deleted)
			localStorage.removeItem(word.id)
		}
	}
	// ? deleteWord

	// ! showSynonym,	showUsage
	const [showSynonym, setShowSynonym] = useState(false)
	const [showUsage, setShowUsage] = useState(false)
	// ? showSynonym,	showUsage

	// ! synonym, usage
	const synonym = word && eval(word.synonym)

	let usage = word && eval(word.usage)

	usage = word && usage.map(u => u.replace(new RegExp(word.toTranslate), "? "))
	// ? synonym, usage

	// ! other
	// drop answer input text if word changed, correct answer given
	useEffect(() => {
		setAnswer("")
	}, [wordNum, lastCorrectAnswer])
	// go to random word if no next word
	!wordToTranslate && curWords.length > 0 && setWordNum(randomNum)


	// ! RETURN
	return (
		<section className="answerSection">

			{
				curWords.length > 0 && wordToTranslate ?
					<>

						<IconText src={random ? "on" : "off"} text="Random" className="random" classNameBg="bshn" bullFn={setRandom} />

						<div className="translated">
							<div className="translated__word">
								<span className="circle circle_num">{wordNum + 1}</span>
								<span>{word.translated}</span>
							</div>
							<div className="buttons">

								<span onClick={() => setWordNum(prev => prev - 1)}>
									<Icon src="arrow_l" classNameBg="round" />
								</span>

								<span onClick={() => setWordNum(prev => prev + randomNum + 1)}>
									<Icon src="arrow_r" classNameBg="round ml" />
								</span>

								<span onClick={deleteWord}>
									<Icon src="delete" classNameBg="round ml" />
								</span>
							</div>
						</div>

						{synonym.length > 0 &&
							<>
								<IconText src="arrow" text="Synonym" rotate={showSynonym} bullFn={setShowSynonym} classNameBg="sui bshn" />

								{showSynonym &&
									<div className="Tags">
										<Tags tags={synonym} mode="read" />
									</div>
								}
							</>
						}

						{usage.length > 0 &&
							<>
								<IconText src="arrow" text="Usage" rotate={showUsage} bullFn={setShowUsage} classNameBg="sui bshn" />

								{showUsage &&
									<div className="Tags">
										<Tags tags={usage} mode="read" />
									</div>
								}
							</>
						}

						<div className="answerBlocks">
							{answerBlocks}
						</div>

						<div className="answer">
							<Input type="text" name="answer" placeholder={`answer (${wordToTranslate.length})`} value={answer} setValue={setAnswer} maxLength={word.toTranslate.length} />

							<div onClick={checkAnswer}>
								<Button text="check" className="ma" />
							</div>

						</div>

						<div className="mistake">Mistakes: {mistake}
							<div className="circle ml" onClick={() => alert(`0 mistakes: Learned\n1 mistake: Repeat\n2 & more mistakes: Learn`)}>?</div>
						</div>
					</>
					:
					<div className="noWords">No words left</div>
			}

		</section>
	)
}