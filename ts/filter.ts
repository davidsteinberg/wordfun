type FilterParameters = { current: string[]; previous: string[]; word: string };
type Filter = (p: FilterParameters) => string[];

// Filter the subwords, so they are:
// 1. not a part of the word we started with
// 2. not a part of the other children
const filter: Filter = (p: FilterParameters): string[] => {
  const { current, previous, word } = p;

  return current.filter((subword) => {
    if (word.includes(subword)) {
      return false;
    }

    for (const child of previous) {
      if (child.includes(subword)) {
        return false;
      }
    }

    return true;
  });
};

export type { Filter };
export default filter;
