import { assertEquals } from "./test_deps.ts";
import { Trie } from "./types.ts";
import getChildren from "./getChildren.ts";

Deno.test("getChildren does nothing if count is 0", () => {
  const attempts = 10;
  const count = 0;
  const filter = () => [];
  const random = {
    coin() {
      return true;
    },
    int(_low: number, _high: number) {
      return 0;
    },
    element<T>(array: T[]) {
      return array[1];
    },
  };
  const search = () => [];
  const subtract = () => "";
  const tries: Trie[] = [];
  const word = "";

  const children = getChildren({
    attempts,
    count,
    filter,
    random,
    search,
    subtract,
    tries,
    word,
  });

  const expectedChildren: string[] = [];

  assertEquals(children, expectedChildren);
});

Deno.test("getChildren stops looking once filter returns no subwords", () => {
  const attempts = 10;
  const count = 1;
  const filter = () => [];
  const random = {
    coin() {
      return true;
    },
    int(_low: number, _high: number) {
      return 0;
    },
    element<T>(array: T[]) {
      return array[1];
    },
  };
  const search = () => [];
  const subtract = () => "";
  const tries: Trie[] = [];
  const word = "";

  const children = getChildren({
    attempts,
    count,
    filter,
    random,
    search,
    subtract,
    tries,
    word,
  });

  const expectedChildren: string[] = [];

  assertEquals(children, expectedChildren);
});

Deno.test("getChildren stops looking once matched is count", () => {
  const attempts = 10;
  const count = 1;
  const filter = () => ["abc"];
  const random = {
    coin() {
      return true;
    },
    int(_low: number, _high: number) {
      return 0;
    },
    element<T>(array: T[]) {
      return array[0];
    },
  };
  const search = () => [];
  const subtract = () => "";
  const tries: Trie[] = [];
  const word = "abdcef";

  const children = getChildren({
    attempts,
    count,
    filter,
    random,
    search,
    subtract,
    tries,
    word,
  });

  const expectedChildren = ["abc"];

  assertEquals(children, expectedChildren);
});

Deno.test("getChildren uses longest words for final words", () => {
  const attempts = 10;
  const count = 1;
  const filter = () => ["abc", "koala", "oh"];
  const random = {
    coin() {
      return false;
    },
    int(_low: number, _high: number) {
      return 0;
    },
    element<T>(array: T[]) {
      return array[0];
    },
  };
  const search = () => [];
  const subtract = () => "";
  const tries: Trie[] = [];
  const word = "abdcef";

  const children = getChildren({
    attempts,
    count,
    filter,
    random,
    search,
    subtract,
    tries,
    word,
  });

  const expectedChildren = ["koala"];

  assertEquals(children, expectedChildren);
});
