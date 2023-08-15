import { useState } from "react";

function useRandom(min, max) {
  const [randomNumber, setRandomNumber] = useState(
    generateRandomNumber(min, max)
  );

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateNewRandomNumber() {
    const newRandomNumber = generateRandomNumber(min, max);
    setRandomNumber(newRandomNumber);
  }

  return [randomNumber, generateNewRandomNumber];
}

export default useRandom