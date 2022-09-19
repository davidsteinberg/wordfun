import { Trie } from "./types.ts";

type SearchParameters = { node: Trie; letters: string[] };
type Search = (p: SearchParameters) => string[];

const wordRegex = /\w/;

const search: Search = (p: SearchParameters): string[] => {
  const { isWordEnd, children } = p.node;
  const { letters } = p;
  const results: string[] = [];

  if (isWordEnd) {
    results.push("");
  }

  for (const [key, child] of Object.entries(children)) {
    if (wordRegex.test(key)) {
      const i = letters.indexOf(key);
      if (i !== -1) {
        const others = letters.slice(0, i).concat(letters.slice(i + 1));
        const subresults = search({ node: child, letters: others });

        for (const subresult of subresults) {
          const result = `${key}${subresult}`;
          results.push(result);
        }
      }
    } else {
      const subresults = search({ node: child, letters });

      for (const subresult of subresults) {
        const result = `${key}${subresult}`;
        results.push(result);
      }
    }
  }

  return results;
};

export type { Search };
export default search;
