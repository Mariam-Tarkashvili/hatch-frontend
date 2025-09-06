import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Quiz_box.css'

const Quiz_box = () => {
  const [quiz, setQuiz] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // store user's answers
  const [lockedQuestions, setLockedQuestions] = useState({}) // track which questions are locked
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get('/quiz.json')
        setQuiz(res.data.quiz)
      } catch (err) {
        console.error("Error fetching quiz:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [])

  const handleSelectAnswer = (qIndex, answer) => {
    // Don't allow changes if question is already locked
    if (lockedQuestions[qIndex]) return

    // Set the selected answer and lock the question
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: answer }))
    setLockedQuestions(prev => ({ ...prev, [qIndex]: true }))
  }

  const calculateScore = () => {
    let correct = 0
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correct++
      }
    })
    return correct
  }

  const handleShowResults = () => {
    setShowResults(true)
  }

  const isAnswered = (qIndex) => {
    return lockedQuestions[qIndex]
  }

  const isCorrectAnswer = (qIndex, answer) => {
    return quiz[qIndex]?.correct_answer === answer
  }

  const isSelectedAnswer = (qIndex, answer) => {
    return selectedAnswers[qIndex] === answer
  }

  const allQuestionsAnswered = () => {
    return quiz.length > 0 && Object.keys(selectedAnswers).length === quiz.length
  }

  if (loading) return <p>Loading quiz...</p>

  return (
    <div className="quiz_box_container">
      {quiz.map((q, index) => (
        <div key={index} className="quiz_question_box">
          <h3 className="quiz_question">{index + 1}. {q.question}</h3>
          <div className="quiz_answers">
            {q.answers.map((ans, i) => {
              const isSelected = isSelectedAnswer(index, ans)
              const isCorrect = isCorrectAnswer(index, ans)
              const questionAnswered = isAnswered(index)
              const userSelectedWrong = questionAnswered && isSelected && !isCorrect

              // Determine button class
              let buttonClass = "quiz_answer_btn"
              if (isSelected) {
                buttonClass += " selected"
              }
              if (questionAnswered && isCorrect) {
                buttonClass += " correct_highlight"
              }

              return (
                <button
                  key={i}
                  className={buttonClass}
                  onClick={() => handleSelectAnswer(index, ans)}
                  disabled={questionAnswered}
                >
                  <span className="answer_text">{ans}</span>
                  {questionAnswered && (
                    <span className="answer_icon">
                      {isSelected && isCorrect && "✓"}
                      {isSelected && !isCorrect && "✕"}
                      {!isSelected && isCorrect && "✓"}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Show Results Button */}
      {allQuestionsAnswered() && !showResults && (
        <div className="quiz_results_section">
          <button className="show_results_btn" onClick={handleShowResults}>
            Show Results
          </button>
        </div>
      )}

      {/* Results Display */}
      {showResults && (
        <div className="quiz_results_section">
          <div className="quiz_score">
            <h2>Quiz Results</h2>
            <p className="score_text">
              You scored <span className="score_highlight">{calculateScore()}</span> out of{" "}
              <span className="score_highlight">{quiz.length}</span> questions correct!
            </p>
            <p className="score_percentage">
              ({Math.round((calculateScore() / quiz.length) * 100)}%)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz_box