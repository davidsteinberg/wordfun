import { assertEquals } from "./test_deps.ts";
import getColor from "./getColor.ts";

Deno.test("getColor calls random color after max retry attempts", () => {
  const random = {
    rgb(_low: number, _high: number) {
      return { r: 10, g: 50, b: 90 };
    },
    color(_low: number, _high: number) {
      return "random color";
    },
  };

  const maxColorRetryCount = 0;
  const minColor = 0;
  const maxColor = 0;
  const minRGBDelta = 0;

  const color = getColor({
    random,
    maxColorRetryCount,
    minColor,
    maxColor,
    minRGBDelta,
  });

  const expectedColor = "random color";

  assertEquals(color, expectedColor);
});

Deno.test("getColor tries again if the red-green delta is too low", () => {
  let rgbCount = 0;

  const random = {
    rgb(_low: number, _high: number) {
      rgbCount += 1;
      if (rgbCount === 2) {
        return { r: 10, g: 12, b: 90 };
      }
      return { r: 10, g: 11, b: 90 };
    },
    color(_low: number, _high: number) {
      return "random color";
    },
  };

  const maxColorRetryCount = 10;
  const minColor = 0;
  const maxColor = 0;
  const minRGBDelta = 2;

  const color = getColor({
    random,
    maxColorRetryCount,
    minColor,
    maxColor,
    minRGBDelta,
  });

  const expectedColor = "rgb(10, 12, 90)";
  const expectedRGBCount = 2;

  assertEquals(color, expectedColor);
  assertEquals(rgbCount, expectedRGBCount);
});

Deno.test("getColor tries again if the red-blue delta is too low", () => {
  let rgbCount = 0;

  const random = {
    rgb(_low: number, _high: number) {
      rgbCount += 1;
      if (rgbCount === 3) {
        return { r: 10, g: 90, b: 12 };
      }
      return { r: 10, g: 90, b: 11 };
    },
    color(_low: number, _high: number) {
      return "random color";
    },
  };

  const maxColorRetryCount = 10;
  const minColor = 0;
  const maxColor = 0;
  const minRGBDelta = 2;

  const color = getColor({
    random,
    maxColorRetryCount,
    minColor,
    maxColor,
    minRGBDelta,
  });

  const expectedColor = "rgb(10, 90, 12)";
  const expectedRGBCount = 3;

  assertEquals(color, expectedColor);
  assertEquals(rgbCount, expectedRGBCount);
});

Deno.test("getColor tries again if the green-blue delta is too low", () => {
  let rgbCount = 0;

  const random = {
    rgb(_low: number, _high: number) {
      rgbCount += 1;
      if (rgbCount === 4) {
        return { r: 90, g: 10, b: 12 };
      }
      return { r: 90, g: 10, b: 11 };
    },
    color(_low: number, _high: number) {
      return "random color";
    },
  };

  const maxColorRetryCount = 10;
  const minColor = 0;
  const maxColor = 0;
  const minRGBDelta = 2;

  const color = getColor({
    random,
    maxColorRetryCount,
    minColor,
    maxColor,
    minRGBDelta,
  });

  const expectedColor = "rgb(90, 10, 12)";
  const expectedRGBCount = 4;

  assertEquals(color, expectedColor);
  assertEquals(rgbCount, expectedRGBCount);
});

Deno.test("getColor returns random rgb if all deltas are over minimum", () => {
  const random = {
    rgb(_low: number, _high: number) {
      return { r: 10, g: 50, b: 90 };
    },
    color(_low: number, _high: number) {
      return "random color";
    },
  };

  const maxColorRetryCount = 1;
  const minColor = 0;
  const maxColor = 0;
  const minRGBDelta = 0;

  const color = getColor({
    random,
    maxColorRetryCount,
    minColor,
    maxColor,
    minRGBDelta,
  });

  const expectedColor = "rgb(10, 50, 90)";

  assertEquals(color, expectedColor);
});
