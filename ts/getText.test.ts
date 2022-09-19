import { assertEquals, assertThrows } from "./test_deps.ts";
import getText from "./getText.ts";

Deno.test("getText throws when no words remain", () => {
  const attempts = 10;
  const filter = () => [];
  const getChildren = () => [];
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
  const tries = {
    adjective: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    noun: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    verb: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    all: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
  };
  const words = [""];

  const func = () =>
    getText({
      attempts,
      filter,
      getChildren,
      random,
      search,
      subtract,
      tries,
      words,
    });

  assertThrows(func);
});

Deno.test("getText returns word and children with 1 or more children", () => {
  const attempts = 10;
  const filter = () => [];
  const getChildren = () => ["child"];
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
  const tries = {
    adjective: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    noun: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    verb: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    all: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
  };
  const words = ["word"];

  const text = getText({
    attempts,
    filter,
    getChildren,
    random,
    search,
    subtract,
    tries,
    words,
  });

  const expectedText = {
    word: "word",
    children: ["child"],
  };

  assertEquals(text, expectedText);
});

Deno.test("getText splices words that are passed in", () => {
  const attempts = 10;
  const filter = () => [];
  const getChildren = () => ["child"];
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
  const tries = {
    adjective: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    noun: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    verb: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
    all: {
      letter: "",
      isWordEnd: false,
      children: {},
    },
  };
  const words = ["word"];

  getText({
    attempts,
    filter,
    getChildren,
    random,
    search,
    subtract,
    tries,
    words,
  });

  assertEquals(words.length, 0);
});
