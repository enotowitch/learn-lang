import React, { useContext, useState, useEffect } from "react"
import { Context } from "./../context"
import AnswerBlock from "./AnswerBlock"
import Button from "./Button"
import IconText from "./IconText"
import Input from "./Input"
import Tags from "./Tags"

export default function Answer() {

	const { words, setWords, answerStatus, answer, setAnswer, lastCorrectAnswer, setLastCorrectAnswer, langFrom, langTo } = useContext(Context)

	// ! wordNum
	const [wordNum, setWordNum] = useState(0)
	// new StatusBlock visited => setWordNum(0)
	useEffect(() => {
		setWordNum(0)
	}, [answerStatus])
	// ? wordNum

	// ! curWords, word, wordToTranslate, mistake 
	let curWords = []
	words.map(word => word.status === answerStatus && word.langFrom === langFrom && word.langTo === langTo && (curWords.push(word)))

	const word = curWords[wordNum]
	const wordToTranslate = word && word.toTranslate.toLowerCase()

	const [mistake, setMistake] = useState(0)
	// word changed, new StatusBlock visited, correct answer => setMistake(0)
	useEffect(() => {
		setMistake(0)
	}, [wordNum, answerStatus, lastCorrectAnswer])
	// ? curWords, word, wordToTranslate, mistake 

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
		if (wordToTranslate !== answer.toLowerCase()) {
			setMistake(prev => prev + 1)
			letterArr[mistake] = toTranslateArr[mistake]
			setAnswer(letterArr.join(''))
		}
		// ? put 1,2,3... letter to answerBlock & to answer input

		// ! rules logic
		mistake === 0 && (calculatedStatus = "learned")
		mistake === 1 && (calculatedStatus = "to repeat")
		mistake > 1 && (calculatedStatus = "to learn")
		// ? rules logic

		// CORRECT ANSWER
		if (wordToTranslate === answer.toLowerCase()) {
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
				document.querySelectorAll("body, input, select").forEach(el => el.style.background = "white")
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
	// go to first word if no next word
	!wordToTranslate && curWords.length > 0 && setWordNum(0)


	// ! RETURN
	return (
		<section className="answerSection">

			{
				curWords.length > 0 && wordToTranslate ?
					<>
						<div className="translated">
							<div className="translated__word">
								<span className="circle circle_num">{wordNum + 1}</span>
								<span>{word.translated}</span>
							</div>
						</div>

						<div className="buttons">
							<span onClick={() => setWordNum(prev => prev + 1)}>
								<Button text="next" />
							</span>

							<span onClick={() => setWordNum(prev => prev - 1)}>
								<Button text="prev" />
							</span>

							<span onClick={deleteWord}>
								<Button text="delete" className="danger" />
							</span>
						</div>

						{synonym.length > 0 &&
							<>
								<IconText src="arrow" text="Synonym" rotate={showSynonym} bullFn={setShowSynonym} />

								{showSynonym &&
									<div className="Tags">
										<Tags tags={synonym} mode="read" />
									</div>
								}
							</>
						}

						{usage.length > 0 &&
							<>
								<IconText src="arrow" text="Usage" rotate={showUsage} bullFn={setShowUsage} />

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
							<Input type="text" name="answer" placeholder="answer" value={answer} setValue={setAnswer} maxLength={word.toTranslate.length} />

							<div onClick={checkAnswer}>
								<Button text="check" />
							</div>

						</div>

						<div className="mistake">Mistakes: {mistake}
							<div className="circle ml" onClick={() => alert(`0 mistakes: Learned\n1 mistake: To Repeat\n2 & more mistakes: To Learn`)}>?</div>
						</div>
					</>
					:
					<div className="noWords">No words left</div>
			}

		</section>
	)
}