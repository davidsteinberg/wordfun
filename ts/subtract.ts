type SubTractParameters = { word: string; from: string };
type Subtract = (p: SubTractParameters) => string;

// Throws is a word is provided that is not a subset
const subtract: Subtract = (p: SubTractParameters): string => {
  const { word, from } = p;
  const letters = from.split("");
  const lettersToRemove = word.split("");

  outer:
  for (const letter of lettersToRemove) {
    for (let i = 0; i < letters.length; i += 1) {
      if (letters[i] === letter) {
        // Remove letter and continue with next letter to remove
        letters.splice(i, 1);
        continue outer;
      }
    }

    throw Error(`Letter "${letter}" not found in word "${from}"`);
  }

  return letters.join("");
};

export type { Subtract };
export default subtract;
