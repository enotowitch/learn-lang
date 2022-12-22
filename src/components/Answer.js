import React, { useContext, useState, useEffect } from "react"
import { Context } from "./../context"
import AnswerBlock from "./AnswerBlock"
import Button from "./Button"
import IconText from "./IconText"
import Input from "./Input"
import Tags from "./Tags"

export default function Answer() {

	const { words, setWords, answerStatus, answer, setAnswer, lastCorrectAnswer, setLastCorrectAnswer } = useContext(Context)

	// ! wordNum
	const [wordNum, setWordNum] = useState(0)
	// new StatusBlock visited => setWordNum(0)
	useEffect(() => {
		setWordNum(0)
	}, [answerStatus])
	// ? wordNum

	// ! curWords, word, wordToTranslate, mistake 
	let curWords = []
	words.map(word => word.status === answerStatus && (curWords.push(word)))

	const word = curWords[wordNum]
	const wordToTranslate = word && word.toTranslate

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
		if (wordToTranslate !== answer) {
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
		if (wordToTranslate === answer) {
			words.map(wordObj => {
				wordObj.toTranslate === answer && (wordObj.status = calculatedStatus)
				wordObj.toTranslate === answer && localStorage.setItem(wordObj.id, JSON.stringify(wordObj))
			})
			setLastCorrectAnswer(answer)
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

	// ! showTags,	showUsage
	const [showTags, setShowTags] = useState(false)
	const [showUsage, setShowUsage] = useState(false)
	// ? showTags,	showUsage

	// ! tags, usage
	const tags = word && eval(word.synonym)

	let usage = word && word.usage // they called their daughter Hannah
	if (wordToTranslate) {
		for (let i = 1; i <= wordToTranslate.length; i++) {
			const regExp = new RegExp(wordToTranslate.slice(0, i + 1)) // match first 2 letters & more: /ca/, /cal/, /call/
			if (usage.match(regExp)) {
				const replaceNum = usage.match(regExp).index // 5 "they "called
				const regExp2 = new RegExp(`.{${replaceNum}}`) // /.{5}/
				const found = usage.replace(regExp2, "").match(/\S+/)[0] // called
				// ! more complex; maybe use later
				// const calcQuestionMarks = wordToTranslate.split("").map(letter => letter.replace(letter, "?")).join("") // call = ????
				// const slice = found.slice(0, calcQuestionMarks.length) // call
				// const Found = found.replace(slice, calcQuestionMarks) // called = ????ed
				// usage = usage.replace(found, Found) // they ????ed their daughter Hannah
				// ? more complex
				usage = usage.replace(found, "?") // they ? their daughter Hannah
			}
		}
	}
	// ? tags, usage

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
							<div className="translated__word">{word.translated}</div>

							<div onClick={() => setWordNum(prev => prev + 1)}>
								<Button text="next" />
							</div>

							<div onClick={deleteWord}>
								<Button text="delete" />
							</div>
						</div>

						{tags.length > 0 &&
							<>
								<div onClick={() => setShowTags(prev => !prev)}>
									<IconText src="arrow" text="Synonym" rotate={showTags} />
								</div>

								{showTags &&
									<div className="Tags">
										<Tags tags={tags} mode="read" />
									</div>
								}
							</>
						}

						{usage &&
							<>
								<div onClick={() => setShowUsage(prev => !prev)}>
									<IconText src="arrow" text="Usage" rotate={showUsage} />
								</div>

								{showUsage &&
									<div className="usage usage_read">{usage}</div>
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
							<div className="rules ml" onClick={() => alert(`0 mistakes: Learned\n1 mistake: To Repeat\n2 & more mistakes: To Learn`)}>?</div>
						</div>
					</>
					:
					<div className="noWords">No words left</div>
			}

		</section>
	)
}