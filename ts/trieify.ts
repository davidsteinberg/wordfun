import { Trie } from "./types.ts";

const trieify = (words: string[]): Trie => {
  const trie: Trie = {
    letter: "",
    isWordEnd: false,
    children: {},
  };

  // For each word
  for (const word of words) {
    const finalIndex = word.length - 1;
    let pointer = trie;

    // For each letter
    for (const [i, letter] of Object.entries(word)) {
      // Move to the appropriate node
      const { children } = pointer;
      pointer = children[letter];

      // Add a child node if needed
      if (pointer === undefined) {
        const isWordEnd = (Number(i) === finalIndex);
        pointer = {
          letter,
          isWordEnd,
          children: {},
        };

        children[letter] = pointer;
      }
    }
  }

  return trie;
};

export default trieify;
