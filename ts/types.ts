type Content = {
  word: string;
  children: string[];
  color: string;
};

type Trie = {
  letter: string;
  isWordEnd: boolean;
  children: Record<string, Trie>;
};

export type { Content, Trie };
