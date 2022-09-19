import { Content, Trie } from "./types.ts";
import { random } from "./deps.ts";
import filter from "./filter.ts";
import getChildren from "./getChildren.ts";
import getColor from "./getColor.ts";
import getText from "./getText.ts";
import search from "./search.ts";
import subtract from "./subtract.ts";
import trieify from "./trieify.ts";

// Constants
const adjectivesURL = "data/adjectives.txt";
const nounsPluralURL = "data/nouns_plural.txt";
const nounsSingularURL = "data/nouns_singular.txt";
const verbsURL = "data/verbs.txt";

const minStarterLength = 0;

const minColor = 130;
const maxColor = 180;
const minRGBDelta = 15;
const maxColorRetryCount = 10;
const maxChildrenRetryCount = 10;

// UI
const select = <T extends HTMLElement>(s: string) =>
  document.querySelector(s) as T;

const ui = {
  root: select(":root"),
  main: select("#main"),
  word: select("#word"),
  children: select("#children"),
  leftArrow: select("#left-arrow"),
  rightArrow: select("#right-arrow"),
  about: select("#about"),
  aboutClose: select("#about > .content > .close"),
};

// Word banks
let starters: string[] = [];
const unchosenStarters: string[] = [];

let adjectiveTrie: Trie | undefined;
let nounTrie: Trie | undefined;
let verbTrie: Trie | undefined;
let allTrie: Trie | undefined;

// Load word lists asynchronously
const load = async () => {
  // Fetch the word lists
  const urls = [adjectivesURL, nounsPluralURL, nounsSingularURL, verbsURL];
  const promises = urls.map((url) =>
    fetch(url)
      .then((response) => response.text())
      .then((text) => text.trim().split("\n"))
  );

  const [adjectives, nounsPlural, nounsSingular, verbs] = await Promise.all(
    promises,
  );

  const words = [...adjectives, ...nounsPlural, ...nounsSingular, ...verbs];
  words.sort((word1, word2) => word2.length - word1.length);

  starters = words.filter((starter) => {
    return starter.length >= minStarterLength;
  });

  adjectiveTrie = trieify(adjectives);
  nounTrie = trieify([...nounsPlural, ...nounsSingular]);
  verbTrie = trieify(verbs);
  allTrie = trieify([...adjectives, ...nounsSingular, ...verbs]);
};

// Color
const newColor = () => {
  return getColor({
    random,
    maxColorRetryCount,
    minColor,
    maxColor,
    minRGBDelta,
  });
};

const startColor = newColor();

// History
const history: { index: number; stack: Content[] } = {
  index: 0,
  stack: [{
    word: "wonderful",
    children: ["word", "fun"],
    color: startColor,
  }],
};

const show = (index: number) => {
  const content = history.stack[index];

  // Apply conrext text and color
  ui.word.textContent = content.word;
  ui.children.textContent = content.children.join(" ");
  ui.root.style.setProperty("--parameter-color", content.color);

  history.index = index;
};

const back = () => {
  const { index } = history;

  if (index === 0) {
    // Show about
    ui.main.classList.add("hidden");
    ui.about.classList.remove("hidden");
  } else {
    show(index - 1);
  }
};

const forward = () => {
  const { index, stack } = history;

  // If we're at the last content, generate more
  if (index === stack.length - 1) {
    // Don't do anything if we can't generate
    if (starters.length === 0) {
      return;
    }

    // Refill the list when all have been chosen
    if (unchosenStarters.length === 0) {
      unchosenStarters.push(...starters);
    }

    // Pick a color and default to failure text
    const color = newColor();
    let text = {
      word: "uh oh! something went wrong",
      children: ["please reload the page"],
    };

    try {
      // Get a new word and children
      text = getText({
        attempts: maxChildrenRetryCount,
        filter,
        getChildren,
        random,
        search,
        subtract,
        tries: {
          adjective: adjectiveTrie!,
          noun: nounTrie!,
          verb: verbTrie!,
          all: allTrie!,
        },
        words: unchosenStarters,
      });
    } catch (error) {
      // Disable action and log when errors occur
      ui.leftArrow.classList.add("hidden");
      ui.rightArrow.classList.add("hidden");
      console.error(error);
    }

    history.stack.push({ color, ...text });
  }

  show(index + 1);
};

// Event handlers
const pressed = (element: HTMLElement) => {
  element.classList.add("pressed");
};

const unpressed = (element: HTMLElement) => {
  element.classList.remove("pressed");
};

const leftDown = () => pressed(ui.leftArrow);
const leftUp = () => {
  unpressed(ui.leftArrow);
  back();
};

const rightDown = () => pressed(ui.rightArrow);
const rightUp = () => {
  unpressed(ui.rightArrow);
  forward();
};

const main = async () => {
  ui.root.style.setProperty("--parameter-color", startColor);

  ui.aboutClose.onpointerup = () => {
    ui.about.classList.add("hidden");
    ui.main.classList.remove("hidden");
  };

  // Left arrow is allowed to get to About before loading
  ui.leftArrow.onpointerdown = leftDown;
  ui.leftArrow.onpointerup = leftUp;

  // Users can generate new content once words are loaded
  await load();

  ui.rightArrow.classList.remove("disabled");
  ui.rightArrow.onpointerdown = rightDown;
  ui.rightArrow.onpointerup = rightUp;
};

main();
