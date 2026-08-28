import { parseChemSegments, splitChemCondition } from "../lib/chemistry";

export function ChemicalDisplay({ value, condition = "" }: { value: string; condition?: string }) {
  const extracted = splitChemCondition(value);
  const visibleCondition = condition || extracted.condition;
  const segments = parseChemSegments(extracted.source);
  if (!segments.length) {
    return <span className="formula-placeholder">化学式を入力すると、ここに組版されます</span>;
  }

  return (
    <span className="chemical-display" role="math" aria-label={value}>
      {segments.map((segment, index) => {
        if (segment.kind === "subscript") return <sub key={index}>{segment.value}</sub>;
        if (segment.kind === "superscript") return <sup key={index}>{segment.value}</sup>;
        if (segment.kind === "arrow") return (
          <span className="formula-arrow" key={index}>
            {visibleCondition && <span className="formula-condition">{visibleCondition}</span>}
            {segment.value}
          </span>
        );
        return <span key={index}>{segment.value}</span>;
      })}
    </span>
  );
}
