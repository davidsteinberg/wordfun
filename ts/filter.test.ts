import { assertEquals } from "./test_deps.ts";
import filter from "./filter.ts";

Deno.test("filter excludes subsets of the word", () => {
  const current = ["ab", "bc"];
  const previous: string[] = [];
  const word = "abc";

  const children = filter({
    current,
    previous,
    word,
  });

  const expectedChildren: string[] = [];

  assertEquals(children, expectedChildren);
});

Deno.test("filter excludes subsets of previous subwords", () => {
  const current = ["ab", "bc"];
  const previous: string[] = ["abc"];
  const word = "";

  const children = filter({
    current,
    previous,
    word,
  });

  const expectedChildren: string[] = [];

  assertEquals(children, expectedChildren);
});

Deno.test("filter includes non-subsets of word or previous subwords", () => {
  const current = ["def", "ghi"];
  const previous: string[] = ["jkl", "mno"];
  const word = "abc";

  const children = filter({
    current,
    previous,
    word,
  });

  const expectedChildren = ["def", "ghi"];

  assertEquals(children, expectedChildren);
});
