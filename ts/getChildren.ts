import { Filter } from "./filter.ts";
import { Random } from "./deps.ts";
import { Search } from "./search.ts";
import { Subtract } from "./subtract.ts";
import { Trie } from "./types.ts";

type GetChildrenParameters = {
  attempts: number;
  count: number;
  filter: Filter;
  random: Random;
  search: Search;
  subtract: Subtract;
  tries: Trie[];
  word: string;
};

type GetChildren = (p: GetChildrenParameters) => string[];

const getChildren: GetChildren = (p: GetChildrenParameters): string[] => {
  const { attempts, count, filter, random, search, subtract, tries } = p;
  const children: string[] = [];
  let { word } = p;
  const starter = word;
  let attempt = 0;

  attemptLoop:
  while (attempt < attempts) {
    let matched = 0;
    word = starter;
    children.length = 0;

    childLoop:
    while (matched < count) {
      const trie = tries[matched];
      const letters = word.split("");
      const subwords = search({ node: trie, letters });

      let filteredSubwords = filter({
        current: subwords,
        previous: children,
        word: starter,
      });

      if (filteredSubwords.length === 0) {
        break childLoop;
      }

      // Sort longest to shortest
      filteredSubwords.sort((w1, w2) => {
        return w1.length < w2.length ? 1 : -1;
      });

      // Make final words as long as possible
      if (matched === count - 1) {
        const { length } = filteredSubwords[0];
        filteredSubwords = filteredSubwords.filter((subword) => {
          return subword.length === length;
        });
      }

      const { length } = filteredSubwords;
      const index = random.coin()
        ? random.int(0, Math.floor(length / 2))
        : random.int(0, length - 1);
      const subword = filteredSubwords[index];
      children.unshift(subword);
      word = subtract({ word: subword, from: word });
      matched += 1;
    }

    attempt += 1;

    if (children.length === count) {
      break attemptLoop;
    }
  }

  return children;
};

export type { GetChildren };
export default getChildren;
