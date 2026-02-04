import Addagram from "./components/Addagram";
import { useGame } from "./context/GameContext";


const App = () => {

  const { 
    wordLengths,
    showResults, 
    words, 
    letterInputRefs,
    answerStatuses, 
    clueShown,
    handleLetterChange,
    handleClueChange,
    handleFocusChange,
    checkAnswer,
    finishGame
  } = useGame();


  return ( 
    <div>
      <div className="page-title">  
        Addagrams
      </div>
      <p className="mt-10 mb-1" hidden={showResults}>
        {clueShown}
      </p>
      <div className="addagrams-container" hidden={showResults}>
        {wordLengths.map((length) => (
          <Addagram 
            key={length}
            value={words[length]}
            numLetters={length}
            inputRefs={letterInputRefs[length]}
            letterChange={handleLetterChange}
            isCorrect={answerStatuses[length]}
            clueChange={handleClueChange}
            focusChange={handleFocusChange}
          />
        ))}
        <div className="submit-btn-container">
          <button onClick={() => checkAnswer()} className="mt-3 w-25 rounded border-1 font-bold bg-green-500 text-black py-2 cursor-pointer transition hover:bg-green-300">
              Submit
          </button>
        </div>
      </div>
      <div className="results-container" hidden={!showResults}>
        <p className="mt-4 mb-1">
          Well done! You have completed the game.
        </p>
        <div className="finish-btn-container">
          <button onClick={finishGame} className="mt-3 mb-3 w-25 rounded border-1 border-gray-500 font-bold bg-gray-400 text-black py-2 cursor-pointer transition hover:bg-gray-300">
              Next
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default App;