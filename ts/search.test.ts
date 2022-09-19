import { assertEquals } from "./test_deps.ts";
import search from "./search.ts";

Deno.test("search returns a complete word", () => {
  const node = {
    letter: "",
    isWordEnd: false,
    children: {
      a: {
        letter: "a",
        isWordEnd: true,
        children: {},
      },
    },
  };

  const letters = ["a", "b", "c"];
  const children = search({ node, letters });
  const expectedChildren = ["a"];

  assertEquals(children, expectedChildren);
});

Deno.test("search returns an empty array when nothing matches", () => {
  const node = {
    letter: "",
    isWordEnd: false,
    children: {},
  };

  const letters = ["a", "b", "c"];
  const children = search({ node, letters });
  const expectedChildren: string[] = [];

  assertEquals(children, expectedChildren);
});

Deno.test("search returns complete words", () => {
  const node = {
    letter: "",
    isWordEnd: false,
    children: {
      a: {
        letter: "a",
        isWordEnd: true,
        children: {
          b: {
            letter: "b",
            isWordEnd: true,
            children: {},
          },
        },
      },
    },
  };

  const letters = ["a", "b", "c"];
  const children = search({ node, letters });
  const expectedChildren = ["a", "ab"];

  assertEquals(children, expectedChildren);
});

Deno.test("search returns an empty array when no complete words match", () => {
  const node = {
    letter: "",
    isWordEnd: false,
    children: {
      a: {
        letter: "a",
        isWordEnd: false,
        children: {
          b: {
            letter: "b",
            isWordEnd: false,
            children: {},
          },
        },
      },
    },
  };

  const letters = ["a", "b", "c"];
  const children = search({ node, letters });
  const expectedChildren: string[] = [];

  assertEquals(children, expectedChildren);
});

Deno.test("search ignores (but returns) non-word letters in the trie", () => {
  const node = {
    letter: "",
    isWordEnd: false,
    children: {
      a: {
        letter: "a",
        isWordEnd: true,
        children: {
          "-": {
            letter: "-",
            isWordEnd: false,
            children: {
              b: {
                letter: "b",
                isWordEnd: true,
                children: {},
              },
            },
          },
        },
      },
    },
  };

  const letters = ["a", "b", "c"];
  const children = search({ node, letters });
  const expectedChildren = ["a", "a-b"];

  assertEquals(children, expectedChildren);
});
