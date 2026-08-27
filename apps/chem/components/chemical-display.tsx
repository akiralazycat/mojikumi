import { parseChemSegments } from "../lib/chemistry";

export function ChemicalDisplay({ value }: { value: string }) {
  const segments = parseChemSegments(value);
  if (!segments.length) {
    return <span className="formula-placeholder">化学式を入力すると、ここに組版されます</span>;
  }

  return (
    <span className="chemical-display" role="math" aria-label={value}>
      {segments.map((segment, index) => {
        if (segment.kind === "subscript") return <sub key={index}>{segment.value}</sub>;
        if (segment.kind === "superscript") return <sup key={index}>{segment.value}</sup>;
        if (segment.kind === "arrow") return <span className="formula-arrow" key={index}>{segment.value}</span>;
        return <span key={index}>{segment.value}</span>;
      })}
    </span>
  );
}
