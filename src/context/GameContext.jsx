import { createContext, useContext, useState, useRef, useEffect } from "react";
import games from '../data/db.json';

export const GameContext = createContext();


export function GameProvider({children}) {

  const [error, setError] = useState(null);
  const [gameId, setGameId] = useState(1);
  // const [wordLengths, setWordLengths] = useState([3, 4, 5, 6, 7]);
  const [wordLengths, setWordLengths] = useState([]);
  const [words, setWords] = useState([]);
  const [clues, setClues] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [guesses, setGuesses] = useState({});
  const [answerStatuses, setAnswerStatuses] = useState({});
  const [clueShown, setClueShown] = useState(null);
  const [answer, setAnswer] = useState({});

  const letterInputRefs = useRef({});


  useEffect(() => {
    console.log(gameId);

    const setupGame = (game) => {

      const gameLengths = game["lengths"];
      const gameWords = game["words"];
      const gameClues = Object.fromEntries(
        gameLengths.map(function(numLetters, i) {
          return [numLetters, game["clues"][i]];
      }))

      setWordLengths(gameLengths);
      setWords(gameWords);
      setClues(gameClues);

      console.log(`initial wordLengths: ${JSON.stringify(gameLengths)}`)
      console.log(`initial Words: ${JSON.stringify(gameWords)}`)
      console.log(`initial Clues: ${JSON.stringify(gameClues)}`)
      console.log("Game now set up.");

      const initialGuesses =  Object.fromEntries(gameLengths.map(function(numLetters, i) {
        return [numLetters, Array.from({ length: numLetters }, (_, i) => "")];
      }));
      setGuesses(initialGuesses);
      console.log(`Initial Guesses: ${JSON.stringify(initialGuesses)}`);

      const initialAnswerStatuses = Object.fromEntries(gameLengths.map(function(numLetters) {
        return [numLetters, 0];
      }));
      console.log(`Initial Answer Statuses: ${JSON.stringify(initialAnswerStatuses)}`);
      setAnswerStatuses(initialAnswerStatuses);

      const answer = Object.fromEntries(
        gameLengths.map(function(numLetters, i) {
          return [numLetters, gameWords[i]];
      }));
      setAnswer(answer);
      setShowResults(false)


    };


    const fetchGames = () => {
      try {
        // We don't need to fetch the whole data every time?
        // const data = fetch('api/games');
        // if(!res.ok) throw new Error('Failed to fetch games');
        // const data = res.json();
        const data = games;
        let gameObj;
        try {
          gameObj = data["games"].find(o => o.id === gameId);
          let game = gameObj["game"];
          setupGame(game);
        } catch { 
          console.log(gameObj);
          setGameId(1);
          console.log(gameId);
        }
      } catch (err) {
        console.log(`Error: ${err.message}`);
        setError(err.message);
      }
    };

    fetchGames();

  }, [gameId]);





  const handleLetterChange = (numLetters, letterIndex, letterValue) => {

    const guess = guesses[numLetters];
      
    const newGuess = guess.map((l, i) => {
        if (i === letterIndex) {
            return letterValue.toUpperCase();
        } else {
            return l;
        }
    });

    const newGuesses = {...guesses};
    newGuesses[numLetters] = newGuess;

    setGuesses(newGuesses);

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
      letterInputRefs.current[newFocusLetter[0]][newFocusLetter[1]].focus();

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
      letterInputRefs.current[newFocusLetter[0]][newFocusLetter[1]].focus();
    }
  };

  const checkAnswer = () => {

    wordLengths.forEach((length) => {
      const wordString = guesses[length].toString().replaceAll(",", "");
      console.log(`For ${length} letters, the match is: `, wordString === answer[length]);
    })

    const newAnswerStatuses = Object.fromEntries(
      wordLengths.map(function(numLetters, i) {
        const wordString = guesses[numLetters].toString().replaceAll(",", "");
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
    console.log("Game finished!");
    setGameId((prevGameId) => prevGameId + 1);
    // setClueShown(null);
    // setGuesses(Object.fromEntries(wordLengths.map(function(numLetters, i) {
    //   return [numLetters, Array.from({ length: numLetters }, (_,  i) => "")];
    // })));
    // setAnswerStatuses(Object.fromEntries(wordLengths.map(function(numLetters, i) {
    //   return [numLetters, 0];
    // })));
    // setWords(Object.fromEntries(wordLengths.map(function(numLetters, i) {
    //   return [numLetters, Array.from({ length: numLetters }, (_,  i) => "")];
    // })));
    // setShowResults(false)
  }

  return (
    <GameContext.Provider value={{
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
    }}>
        {children}
    </GameContext.Provider>
  );

}



export function useGame() {
  return useContext(GameContext);
}
