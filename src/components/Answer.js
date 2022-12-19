import React, { useContext, useState, useEffect } from "react"
import { Context } from "./../context"
import AnswerBlock from "./AnswerBlock"
import Button from "./Button"
import InputText from "./InputText"

export default function Answer() {

	const { words, setWords, answerStatus, answer, setAnswer, lastCorrectAnswer, setLastCorrectAnswer } = useContext(Context)

	// ! wordNum
	const [wordNum, setWordNum] = useState(0)
	// new StatusBlock visited => setWordNum(0)
	useEffect(() => {
		setWordNum(0)
	}, [answerStatus])
	// ? wordNum

	// ! curStatusWords, curStatusWord, mistake 
	let curStatusWords = []
	words.map(word => word.status === answerStatus && (curStatusWords.push(word)))

	const curStatusWord = curStatusWords[wordNum] && curStatusWords[wordNum].toTranslate

	const [mistake, setMistake] = useState(0)
	// new StatusBlock visited, correct answer => setMistake(0)
	useEffect(() => {
		setMistake(0)
	}, [answerStatus, lastCorrectAnswer])
	// ? curStatusWords, curStatusWord, mistake 

	// ! answerBlocks length & put '?' to answerBlock 
	let calcQuestionMarks = []

	if (curStatusWord) {
		for (let i = 0; i < curStatusWord.length; i++) {
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
	if (curStatusWord) {
		toTranslateArr = curStatusWord.split('')
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
		if (curStatusWord !== answer) {
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
		if (curStatusWord === answer) {
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
			const deleted = words.filter(word => {
				return word.id != curStatusWords[wordNum].id
			})
			setWords(deleted)
			localStorage.removeItem(curStatusWords[wordNum].id)
		}
	}
	
	// ! other
	// drop answer input text if word changed, correct answer given
	useEffect(() => {
		setAnswer("")
	}, [wordNum, lastCorrectAnswer])
	// go to first word if no next word
	!curStatusWord && curStatusWords.length > 0 && setWordNum(0)


	// ! RETURN
	return (
		<section className="answerSection">

			{
				curStatusWords.length > 0 && curStatusWord ?
					<>
						<div className="translated">
							<div className="translated__word">{curStatusWords[wordNum].translated}</div>

							<div onClick={() => setWordNum(prev => prev + 1)}>
								<Button text="next" />
							</div>

							<div onClick={deleteWord}>
								<Button text="delete" />
							</div>
						</div>

						<div className="answerBlocks">
							{answerBlocks}
						</div>

						<div className="answer">
							<InputText name="answer" placeholder="answer" value={answer} setValue={setAnswer} />

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