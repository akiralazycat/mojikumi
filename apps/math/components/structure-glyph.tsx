/**
 * Drawn previews for the structure keys and starters.
 *
 * These stand for shapes, not for text: a fraction has a real numerator above
 * its rule, an exponent really sits above the baseline. Composing them from
 * characters made them read as a line of prose instead of a form to fill in.
 */

export type GlyphName =
  | "fraction"
  | "square"
  | "power"
  | "root"
  | "paren"
  | "quadratic"
  | "integral";

type SlotProps = { x: number; y: number; size?: number };

function Slot({ x, y, size = 8 }: SlotProps) {
  return (
    <rect
      x={x}
      y={y}
      width={size}
      height={size}
      rx={2}
      className="glyph-slot"
    />
  );
}

function Glyph({
  width,
  height,
  children
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <svg
      className="structure-glyph"
      viewBox={`0 0 ${width} ${height}`}
      role="presentation"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const glyphs: Record<GlyphName, () => React.ReactElement> = {
  fraction: () => (
    <Glyph width={30} height={22}>
      <Slot x={11} y={1} />
      <line x1={6} y1={11} x2={24} y2={11} />
      <Slot x={11} y={13} />
    </Glyph>
  ),
  square: () => (
    <Glyph width={30} height={22}>
      <Slot x={7} y={8} />
      <text className="glyph-label" x={18} y={9.5} fontSize={9}>2</text>
    </Glyph>
  ),
  power: () => (
    <Glyph width={30} height={22}>
      <Slot x={7} y={8} />
      <text className="glyph-label" x={18} y={9.5} fontSize={9}>n</text>
    </Glyph>
  ),
  root: () => (
    <Glyph width={30} height={22}>
      <path d="M4 12.5 H7 L10.4 19 L13.8 3.5 H24.5" />
      <Slot x={15} y={7} />
    </Glyph>
  ),
  paren: () => (
    <Glyph width={30} height={22}>
      <path d="M11 2.5 C7.4 6 7.4 16 11 19.5" />
      <Slot x={13} y={7} />
      <path d="M23 2.5 C26.6 6 26.6 16 23 19.5" />
    </Glyph>
  ),
  quadratic: () => (
    <Glyph width={88} height={22}>
      <Slot x={2} y={7} />
      <text className="glyph-label" x={12} y={15} fontSize={11}>x</text>
      <text className="glyph-label" x={19} y={9.5} fontSize={7.5}>2</text>
      <text className="glyph-label" x={25} y={15} fontSize={11}>+</text>
      <Slot x={35} y={7} />
      <text className="glyph-label" x={45} y={15} fontSize={11}>x</text>
      <text className="glyph-label" x={53} y={15} fontSize={11}>+</text>
      <Slot x={63} y={7} />
      <text className="glyph-label" x={73} y={15} fontSize={11}>=</text>
      <text className="glyph-label" x={81} y={15} fontSize={11}>0</text>
    </Glyph>
  ),
  integral: () => (
    <Glyph width={88} height={22}>
      <path
        d="M16.2 20.6 C17.8 21.8 19.2 20.9 19.6 17.8 C20.2 13.2 22 9 22.8 5.4 C23.3 3 25.2 1.6 26.8 2.8"
        strokeWidth={1.5}
      />
      <Slot x={29} y={1} size={7} />
      <Slot x={29} y={14} size={7} />
      <Slot x={41} y={7} />
      <text className="glyph-label" x={53} y={15} fontSize={11}>d</text>
      <Slot x={61} y={7} />
    </Glyph>
  )
};

export function StructureGlyph({ name }: { name: GlyphName }) {
  return glyphs[name]();
}
