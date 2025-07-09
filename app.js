/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const wordsList = ['panda', 'keyboard', 'react', 'banana', 'giraffe', 'jungle', 'coding', 'sunrise', 'laptop', 'guitar']
const MAX_STRIKES = 3
const MAX_PASSES = 2


function App() {
  const [words, setWords] = React.useState(() => {
    const saved = JSON.parse(localStorage.getItem('scrambleGame'))
    return saved?.words ?? shuffle(wordsList)
  })
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [guess, setGuess] = React.useState('')
  const [score, setScore] = React.useState(() => {
    return JSON.parse(localStorage.getItem('scrambleGame'))?.score ?? 0
  })
  const [strikes, setStrikes] = React.useState(() => {
    return JSON.parse(localStorage.getItem('scrambleGame'))?.strikes ?? 0
  })
  const [passesLeft, setPassesLeft] = React.useState(() => {
    return JSON.parse(localStorage.getItem('scrambleGame'))?.passesLeft ?? MAX_PASSES
  })
  const [message, setMessage] = React.useState('')
  const [gameOver, setGameOver] = React.useState(false)

  const currentWord = words[currentIndex]
  const scrambledWord = shuffle(currentWord)

  React.useEffect(() => {
    localStorage.setItem('scrambleGame', JSON.stringify({
      words,
      currentIndex,
      score,
      strikes,
      passesLeft
    }))
  }, [words, currentIndex, score, strikes, passesLeft])

  const handleGuess = (e) => {
    e.preventDefault()
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setMessage('✅ Correct!')
      setScore(prev => prev + 1)
      moveToNextWord()
    } else {
      setMessage('❌ Incorrect!')
      setStrikes(prev => {
        const newStrikes = prev + 1
        if (newStrikes >= MAX_STRIKES) endGame()
        return newStrikes
      })
    }
    setGuess('')
  }

  const moveToNextWord = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= words.length) {
      endGame()
    } else {
      setCurrentIndex(nextIndex)
    }
  }

  const handlePass = () => {
    if (passesLeft > 0) {
      setPassesLeft(passesLeft - 1)
      moveToNextWord()
      setMessage('⏭️ Passed.')
    } else {
      setMessage('🚫 No passes left.')
    }
  }

  const endGame = () => {
    setGameOver(true)
    setMessage('🎮 Game Over.')
    localStorage.removeItem('scrambleGame')
  }

  const resetGame = () => {
    const shuffledWords = shuffle(wordsList)
    setWords(shuffledWords)
    setCurrentIndex(0)
    setScore(0)
    setStrikes(0)
    setPassesLeft(MAX_PASSES)
    setGuess('')
    setMessage('')
    setGameOver(false)
    localStorage.removeItem('scrambleGame')
  }

  return (
    <div className="game">
      <h1>Scramble Game</h1>

      {gameOver ? (
        <>
          <p>Final Score: {score}</p>
          <button onClick={resetGame}>🔄 Play Again</button>
        </>
      ) : (
        <>
          <p>Scrambled Word: <strong>{scrambledWord}</strong></p>
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Enter your guess"
              autoFocus
            />
          </form>
          <button onClick={handlePass}>⏭️ Pass ({passesLeft})</button>
          <p>{message}</p>
          <p>✅ Score: {score} | ❌ Strikes: {strikes}/{MAX_STRIKES}</p>
        </>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.body).render(<App />)
