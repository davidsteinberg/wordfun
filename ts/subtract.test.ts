import { assertEquals, assertThrows } from "./test_deps.ts";
import subtract from "./subtract.ts";

Deno.test("subtract removes one word from another", () => {
  const word = "foo";
  const from = "food";

  const result = subtract({ word, from });
  const expectedResult = "d";

  assertEquals(result, expectedResult);
});

Deno.test("subtract throws if word is not a subset of from", () => {
  const word = "abc";
  const from = "abd";

  const func = () => subtract({ word, from });

  assertThrows(func, Error, 'Letter "c" not found in word "abd"');
});
