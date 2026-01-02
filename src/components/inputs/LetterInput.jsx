

const LetterInput = ({ inputRef, letter, value, updateLetter, updateClue, updateFocus, isDisabled }) => {

  return (
    <input 
      disabled={isDisabled}
      className="w-10 h-10 border shadow-black rounded-lg text-lg text-center shadow-[0_1px_3px]"
      type="text" 
      value={value}
      name={letter}
      ref={inputRef}
      maxLength={1}
      onChange={updateLetter}
      onPointerEnter={updateClue}
      onFocus={updateClue}
      onKeyDown={updateFocus}
    />
  )
}
 
export default LetterInput;