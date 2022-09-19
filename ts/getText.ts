import { GetChildren } from "./getChildren.ts";
import { Filter } from "./filter.ts";
import { Random } from "./deps.ts";
import { Search } from "./search.ts";
import { Subtract } from "./subtract.ts";
import { Trie } from "./types.ts";

type GetTextParameters = {
  attempts: number;
  filter: Filter;
  getChildren: GetChildren;
  random: Random;
  search: Search;
  subtract: Subtract;
  tries: {
    adjective: Trie;
    noun: Trie;
    verb: Trie;
    all: Trie;
  };
  words: string[];
};

type GetTextResult = { word: string; children: string[] };

const getText = (p: GetTextParameters): GetTextResult => {
  const {
    attempts,
    filter,
    getChildren,
    random,
    search,
    subtract,
    tries,
    words,
  } = p;
  const count = random.element([1, 2, 2, 2]);

  const orderedTries = [tries.noun];
  if (count === 1) {
    orderedTries[0] = random.element(Object.values(tries));
  } else {
    orderedTries.push(tries.all);
  }

  while (true) {
    const { length } = words;
    if (length === 0) {
      throw Error("No words to choose from");
    }

    // Favor longer words (list is sorted by word length)
    const index = random.coin()
      ? random.int(0, Math.floor(length / 7))
      : random.int(0, length - 1);
    const [word] = words.splice(index, 1);

    const children = getChildren({
      attempts,
      count,
      filter,
      random,
      search,
      subtract,
      tries: orderedTries,
      word,
    });

    if (children.length > 0) {
      return { word, children };
    }
  }
};

export default getText;
