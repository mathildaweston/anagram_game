import { useGame } from "../../context/GameContext";


//Do we need the following props or can we get them from context? : updateLetter, updateClue, updateFocus, isDisabled (bring in answerStatuses)
const LetterInput = ({ numLetters, letter, updateLetter, updateClue, updateFocus, isDisabled }) => {

  const {
    letterInputRefs,
    guesses
  } = useGame();

  return (
    <input 
      disabled={isDisabled}
      className="w-10 h-10 border shadow-black rounded-lg text-lg text-center shadow-[0_1px_3px]"
      type="text" 
      value={guesses[numLetters][letter]}
      name={letter}
      ref={(el) => {
        if (!letterInputRefs.current[numLetters]) {
          letterInputRefs.current[numLetters] = {};
        }
        letterInputRefs.current[numLetters][letter] = el;
      }}
      maxLength={1}
      onChange={updateLetter}
      onPointerEnter={updateClue}
      onFocus={updateClue}
      onKeyDown={updateFocus}
    />
  )
}
 
export default LetterInput;