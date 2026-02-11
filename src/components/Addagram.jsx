import LetterInput from "./inputs/LetterInput";

const Addagram = ({ numLetters, letterChange, isCorrect, clueChange, focusChange }) => {

    const letters = Array.from({ length: numLetters }, (_,  i) => i);

    return (
        <div className='addagram-container'>
            <div className={isCorrect > 0 ? "letters correct" : isCorrect < 0 ? "letters incorrect" : "letters"}>
                {letters.map((letterIndex) => (
                    <LetterInput    
                        key={`${numLetters}-${letterIndex}`}
                        // inputRef={inputRefs[letterIndex]}
                        // letterInputRefs={letterInputRefs}
                        numLetters={numLetters}
                        letter={letterIndex} 
                        // value={value[letterIndex]}
                        updateLetter={(e) => letterChange(
                            numLetters,
                            letterIndex,
                            e.target.value
                        )}
                        updateClue={(e) => clueChange(numLetters)}
                        updateFocus={(e) => focusChange(e, numLetters, letterIndex)}
                        isDisabled={isCorrect === 1 ? true : false}
                    />
                ))}
            </div>
        </div>
    )
}
 
export default Addagram;