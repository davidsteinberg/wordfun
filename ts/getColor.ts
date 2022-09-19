type GetColorParameters = {
  random: {
    rgb: (low: number, high: number) => { r: number; g: number; b: number };
    color: (low: number, high: number) => string;
  };
  maxColorRetryCount: number;
  minColor: number;
  maxColor: number;
  minRGBDelta: number;
};

const getColor = (p: GetColorParameters): string => {
  const { random, maxColorRetryCount, minColor, maxColor, minRGBDelta } = p;

  for (let i = 0; i < maxColorRetryCount; i += 1) {
    const { r, g, b } = random.rgb(minColor, maxColor);

    if (
      Math.abs(r - g) < minRGBDelta ||
      Math.abs(r - b) < minRGBDelta ||
      Math.abs(g - b) < minRGBDelta
    ) {
      continue;
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  return random.color(minColor, maxColor);
};

export default getColor;
