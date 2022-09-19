import { assertEquals } from "./test_deps.ts";
import trieify from "./trieify.ts";

Deno.test("trieify turns a word list into a trie", () => {
  const words = [
    "ape",
    "and",
    "ant",
    "bat",
  ];

  const expectedResult = {
    letter: "",
    isWordEnd: false,
    children: {
      "a": {
        letter: "a",
        isWordEnd: false,
        children: {
          "p": {
            letter: "p",
            isWordEnd: false,
            children: {
              "e": {
                letter: "e",
                isWordEnd: true,
                children: {},
              },
            },
          },
          "n": {
            letter: "n",
            isWordEnd: false,
            children: {
              "d": {
                letter: "d",
                isWordEnd: true,
                children: {},
              },
              "t": {
                letter: "t",
                isWordEnd: true,
                children: {},
              },
            },
          },
        },
      },
      "b": {
        letter: "b",
        isWordEnd: false,
        children: {
          "a": {
            letter: "a",
            isWordEnd: false,
            children: {
              "t": {
                letter: "t",
                isWordEnd: true,
                children: {},
              },
            },
          },
        },
      },
    },
  };

  const result = trieify(words);

  assertEquals(result, expectedResult);
});
