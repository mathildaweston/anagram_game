import { createContext, useContext, useState, useRef } from "react";

export const GameContext = createContext();


export function GameProvider({children}) {

  const wordLengths = [3, 4, 5, 6, 7];

  const answerWords = [
    "ARC",
    "CARE",
    "TRACE",
    "RACKET",
    "TRACKER"
  ];

  const clues = {
    "3": "A part of a circle.",
    "4": "To show concern.",
    "5": "A small amount of something.",
    "6": "A loud, unpleasant noise.",
    "7": "Device used to monitor location over time." 
  };

  const [showResults, setShowResults] = useState(false);
  const [words, setWords] = useState(
    Object.fromEntries(wordLengths.map(function(numLetters, i) {
      return [numLetters, Array.from({ length: numLetters }, (_,  i) => "")];
    }))
  );
  const [answerStatuses, setAnswerStatuses] = useState(
    Object.fromEntries(wordLengths.map(function(numLetters, i) {
      return [numLetters, 0];
    }))
  );
  const [clueShown, setClueShown] = useState(clues[wordLengths[0]]);


  const letterInputRefs = Object.fromEntries(wordLengths.map(function(numLetters) {
    return [numLetters, Array.from({ length: numLetters }, (_,  i) => useRef(null))];
  }));


  const answer = Object.fromEntries(
    wordLengths.map(function(numLetters, i) {
      return [numLetters, answerWords[i]];
  }));


  const handleLetterChange = (numLetters, letterIndex, letterValue) => {

    const word = words[numLetters];
      
    const newWord = word.map((l, i) => {
        if (i === letterIndex) {
            return letterValue.toUpperCase();
        } else {
            return l;
        }
    });

    const newWords = {...words};
    newWords[numLetters] = newWord;

    setWords(newWords);

    //Reset the answer statuses to get rid of the red bubbles
    resetAnswerStatuses();

    //Move focus to the next input
    if (letterValue) {
      const getNextFocusLetter = (n, l) => {
        const l_ = l + 1;
        if (l_ < n) {
          return [n, l_];
        } else if (n === l_  && n < wordLengths[wordLengths.length - 1]) {
          return [n + 1, 0];
        } else {
          return [wordLengths[0], 0];
        }
      };

      const newFocusLetter = getNextFocusLetter(numLetters, letterIndex);
      letterInputRefs[newFocusLetter[0]][newFocusLetter[1]].current.focus();

    } 
  }

  const handleClueChange = (numLetters) => {
    setClueShown(clues[numLetters])
  };

  const handleFocusChange = (e, numLetters, letterIndex) => {
    if (e.key === "Backspace" && e.target.value == "") {

      //Move focus to the previous input
      const getPrevFocusLetter = (n, l) => {
        if (n === wordLengths[0] && l === 0) {
          return [wordLengths[wordLengths.length - 1], wordLengths[wordLengths.length - 1] - 1]
        } else if (l === 0) {
          return [n - 1, n - 2];
        } else {
          return [n, l - 1];
        }
      };

      const newFocusLetter = getPrevFocusLetter(numLetters, letterIndex);
      letterInputRefs[newFocusLetter[0]][newFocusLetter[1]].current.focus();
    }
  };

  const checkAnswer = () => {

    wordLengths.forEach((length) => {
      const wordString = words[length].toString().replaceAll(",", "");
      console.log(`For ${length} letters, the match is: `, wordString === answer[length]);
    })

    const newAnswerStatuses = Object.fromEntries(
      wordLengths.map(function(numLetters, i) {
        const wordString = words[numLetters].toString().replaceAll(",", "");
        const answerStatus = wordString === answer[numLetters] ? 1 : -1;
        return [numLetters, answerStatus];
      })
    );

    setAnswerStatuses(newAnswerStatuses);

    //Check if all answers are correct
    if (Object.values(newAnswerStatuses).reduce((sum, val) => sum + val, 0) === 5) {
      setShowResults(true);
    }
    
  }

  const resetAnswerStatuses = () => {
    const newAnswerStatuses = Object.fromEntries(
      wordLengths.map(function(numLetters, i) {
        if (answerStatuses[numLetters] === -1) {
        //   console.log(`This ones was wrong: ${numLetters}`);
          return [numLetters, 0];
        } else {
          return [numLetters, answerStatuses[numLetters]]
        }
      })
    );
    setAnswerStatuses(newAnswerStatuses);
  }

  const finishGame = () => {
    setAnswerStatuses(Object.fromEntries(wordLengths.map(function(numLetters, i) {
      return [numLetters, 0];
    })));
    setWords(Object.fromEntries(wordLengths.map(function(numLetters, i) {
      return [numLetters, Array.from({ length: numLetters }, (_,  i) => "")];
    })));
    setShowResults(false)
  }

  return (
    <GameContext.Provider value={{
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
    }}>
        {children}
    </GameContext.Provider>
  );

}



export function useGame() {
  return useContext(GameContext)
}
