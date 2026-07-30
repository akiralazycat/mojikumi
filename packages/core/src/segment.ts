export interface GraphemeSegment {
  value: string;
  offset: number;
}

export function segmentGraphemes(
  input: string,
  locale = "ja"
): GraphemeSegment[] {
  if (typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
    return [...segmenter.segment(input)].map(({ segment, index }) => ({
      value: segment,
      offset: index
    }));
  }

  let offset = 0;
  return Array.from(input, (value) => {
    const segment = { value, offset };
    offset += value.length;
    return segment;
  });
}
