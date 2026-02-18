import Addagram from "./components/Addagram";
import { useGame } from "./context/GameContext";


const App = () => {

  const { 
    error,
    wordLengths,
    showResults, 
    guesses, 
    answerStatuses, 
    clueShown,
    letterInputRefs,
    handleLetterChange,
    handleClueChange,
    handleFocusChange,
    checkAnswer,
    finishGame
  } = useGame();


  return ( 
    <div>
      {error ? <div className="error">{error}</div> : <div className="page-title">Anagram Ladders</div>}
      <p className="mt-10 mb-1" hidden={showResults}>
        {clueShown ? clueShown : "\u00A0"}
      </p>
      <div className="addagrams-container" hidden={showResults}>
        {wordLengths.map((length) => (
          <Addagram 
            key={length}
            // value={guesses[length]}
            numLetters={length}
            // letterInputRefs={letterInputRefs}
            letterChange={handleLetterChange}
            isCorrect={answerStatuses[length]}
            clueChange={handleClueChange}
            focusChange={handleFocusChange}
          />
        ))}
        <div className="submit-btn-container">
          <button onClick={() => checkAnswer()} className="mt-3 w-30 rounded border-1 font-bold bg-green-500 text-black py-2 cursor-pointer transition hover:bg-green-300">
              Check Answer
          </button>
        </div>
      </div>
      <div className="results-container" hidden={!showResults}>
        <p className="mt-4 mb-1">
          Well done! You have completed the game.
        </p>
        <div className="finish-btn-container">
          <button onClick={finishGame} className="mt-3 mb-3 w-25 rounded border-1 border-gray-500 font-bold bg-gray-400 text-black py-2 cursor-pointer transition hover:bg-gray-300">
              Next puzzle
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default App;