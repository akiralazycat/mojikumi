import { normalizeChemInput } from "./normalize";

export type AtomCounts = Record<string, number>;
export type DiagnosticSeverity = "error" | "warning" | "info";

export type ChemDiagnostic = {
  code: string;
  message: string;
  severity: DiagnosticSeverity;
  side?: "reactant" | "product";
  speciesIndex?: number;
};

export type ChemSpecies = {
  atoms: AtomCounts;
  charge: number;
  coefficient: number;
  formula: string;
  source: string;
  state: "s" | "l" | "g" | "aq" | null;
};

export type ChemReaction = {
  arrow: "→" | "←" | "⇌" | "↔";
  condition: string;
  products: ChemSpecies[];
  reactants: ChemSpecies[];
};

export type ChemAnalysis = {
  balanced: boolean | null;
  diagnostics: ChemDiagnostic[];
  elementDelta: AtomCounts;
  kind: "empty" | "formula" | "reaction";
  reaction: ChemReaction | null;
  species: ChemSpecies[];
  valid: boolean;
};

const elementSymbols = new Set(`
H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn
Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce
Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn
Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl
Mc Lv Ts Og
`.trim().split(/\s+/));

const statePattern = /\((aq|s|l|g)\)$/i;
const chargePattern = /\^(?:\{)?(\d*)([+\-−])(?:\})?$/;
const arrowPattern = /[→←⇌↔]/g;

function addCounts(target: AtomCounts, source: AtomCounts, multiplier = 1) {
  for (const [element, count] of Object.entries(source)) {
    target[element] = (target[element] ?? 0) + count * multiplier;
  }
}

function multiplyCounts(counts: AtomCounts, multiplier: number) {
  return Object.fromEntries(Object.entries(counts).map(([element, count]) => [element, count * multiplier]));
}

function readNumber(value: string, start: number) {
  let end = start;
  while (end < value.length && /\d/.test(value[end]!)) end += 1;
  if (end === start) return { value: 1, end };
  return { value: Number(value.slice(start, end)), end };
}

type FormulaParseResult = {
  atoms: AtomCounts;
  diagnostics: ChemDiagnostic[];
};

export function parseMolecularFormula(rawFormula: string): FormulaParseResult {
  const formula = rawFormula.trim();
  const diagnostics: ChemDiagnostic[] = [];
  if (!formula) {
    return { atoms: {}, diagnostics: [{ code: "empty-formula", message: "化学式が空です。", severity: "error" }] };
  }
  if (formula === "e") return { atoms: {}, diagnostics };

  const parseSequence = (value: string, start: number, closing: ")" | "]" | null): { atoms: AtomCounts; end: number } => {
    const atoms: AtomCounts = {};
    let index = start;

    while (index < value.length) {
      const character = value[index]!;
      if (closing && character === closing) return { atoms, end: index + 1 };

      if (character === "(" || character === "[") {
        const expected = character === "(" ? ")" : "]";
        const group = parseSequence(value, index + 1, expected);
        if (group.end <= index + 1 || value[group.end - 1] !== expected) {
          diagnostics.push({ code: "unclosed-group", message: `${character} に対応する ${expected} がありません。`, severity: "error" });
          return { atoms, end: value.length };
        }
        const multiplier = readNumber(value, group.end);
        if (multiplier.value === 0) diagnostics.push({ code: "zero-subscript", message: "原子数に0は指定できません。", severity: "error" });
        addCounts(atoms, group.atoms, multiplier.value);
        index = multiplier.end;
        continue;
      }

      if (character === ")" || character === "]") {
        diagnostics.push({ code: "unexpected-close", message: `対応する開き括弧のない ${character} があります。`, severity: "error" });
        index += 1;
        continue;
      }

      if (/[A-Z]/.test(character)) {
        let symbol = character;
        if (/[a-z]/.test(value[index + 1] ?? "")) symbol += value[index + 1];
        if (!elementSymbols.has(symbol)) {
          diagnostics.push({ code: "unknown-element", message: `${symbol} は元素記号として認識できません。`, severity: "error" });
        }
        index += symbol.length;
        const count = readNumber(value, index);
        if (count.value === 0) diagnostics.push({ code: "zero-subscript", message: "原子数に0は指定できません。", severity: "error" });
        atoms[symbol] = (atoms[symbol] ?? 0) + count.value;
        index = count.end;
        continue;
      }

      if (/\s/.test(character)) {
        index += 1;
        continue;
      }

      diagnostics.push({ code: "unexpected-character", message: `${character} を化学式の一部として認識できません。`, severity: "error" });
      index += 1;
    }

    if (closing) diagnostics.push({ code: "unclosed-group", message: `対応する ${closing} がありません。`, severity: "error" });
    return { atoms, end: index };
  };

  const total: AtomCounts = {};
  const hydrateParts = formula.split(/[·⋅.]/);
  for (const [partIndex, rawPart] of hydrateParts.entries()) {
    if (!rawPart) {
      diagnostics.push({ code: "empty-hydrate", message: "付加物の区切りの前後に化学式が必要です。", severity: "error" });
      continue;
    }
    const leading = rawPart.match(/^(\d+)(.*)$/);
    const multiplier = leading ? Number(leading[1]) : 1;
    const part = leading ? leading[2]! : rawPart;
    if (partIndex === 0 && leading) {
      diagnostics.push({ code: "formula-coefficient", message: "物質の係数は化学式の外側に指定してください。", severity: "warning" });
    }
    const parsed = parseSequence(part, 0, null);
    addCounts(total, parsed.atoms, multiplier);
  }

  return { atoms: total, diagnostics };
}

function splitSpecies(side: string) {
  const parts: string[] = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < side.length; index += 1) {
    const character = side[index]!;
    if (character === "(" || character === "[") depth += 1;
    if (character === ")" || character === "]") depth = Math.max(0, depth - 1);
    const prefix = side.slice(start, index);
    const isChargeSign = /\^(?:\{)?\d*$/.test(prefix.trimEnd());
    if (character === "+" && depth === 0 && !isChargeSign) {
      parts.push(side.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(side.slice(start).trim());
  return parts;
}

function parseSpecies(rawSource: string): { diagnostics: ChemDiagnostic[]; species: ChemSpecies } {
  const diagnostics: ChemDiagnostic[] = [];
  let source = rawSource.trim();
  const coefficientMatch = source.match(/^(\d+)\s*(?=[A-Z(e[])/);
  const coefficient = coefficientMatch ? Number(coefficientMatch[1]) : 1;
  if (coefficientMatch) source = source.slice(coefficientMatch[0].length).trim();
  if (coefficient === 0) diagnostics.push({ code: "zero-coefficient", message: "係数に0は指定できません。", severity: "error" });

  let state: ChemSpecies["state"] = null;
  const stateMatch = source.match(statePattern);
  if (stateMatch) {
    state = stateMatch[1]!.toLowerCase() as ChemSpecies["state"];
    source = source.slice(0, -stateMatch[0].length).trim();
  }

  let charge = 0;
  const chargeMatch = source.match(chargePattern);
  if (chargeMatch) {
    const magnitude = Number(chargeMatch[1] || "1");
    charge = chargeMatch[2] === "+" ? magnitude : -magnitude;
    source = source.slice(0, -chargeMatch[0].length).trim();
  }

  const formula = source;
  const parsed = parseMolecularFormula(formula);
  diagnostics.push(...parsed.diagnostics);

  return {
    diagnostics,
    species: { atoms: parsed.atoms, charge, coefficient, formula, source: rawSource.trim(), state }
  };
}

function sideTotals(species: ChemSpecies[]) {
  const atoms: AtomCounts = {};
  let charge = 0;
  for (const item of species) {
    addCounts(atoms, item.atoms, item.coefficient);
    charge += item.charge * item.coefficient;
  }
  return { atoms, charge };
}

function decorateDiagnostics(
  diagnostics: ChemDiagnostic[],
  side: "reactant" | "product",
  speciesIndex: number
) {
  return diagnostics.map((diagnostic) => ({ ...diagnostic, side, speciesIndex }));
}

export function analyzeChem(value: string, options: { condition?: string } = {}): ChemAnalysis {
  const normalized = normalizeChemInput(value);
  if (!normalized) return { balanced: null, diagnostics: [], elementDelta: {}, kind: "empty", reaction: null, species: [], valid: true };

  const arrows = [...normalized.matchAll(arrowPattern)];
  if (arrows.length === 0) {
    const parsed = parseSpecies(normalized);
    return {
      balanced: null,
      diagnostics: parsed.diagnostics,
      elementDelta: {},
      kind: "formula",
      reaction: null,
      species: [parsed.species],
      valid: !parsed.diagnostics.some((item) => item.severity === "error")
    };
  }

  if (arrows.length > 1) {
    const diagnostic = { code: "multiple-arrows", message: "1つの反応式には反応矢印を1つだけ指定してください。", severity: "error" as const };
    return { balanced: false, diagnostics: [diagnostic], elementDelta: {}, kind: "reaction", reaction: null, species: [], valid: false };
  }

  const arrowMatch = arrows[0]!;
  const arrow = arrowMatch[0] as ChemReaction["arrow"];
  const arrowIndex = arrowMatch.index!;
  const left = normalized.slice(0, arrowIndex).trim();
  let right = normalized.slice(arrowIndex + arrow.length).trim();
  let condition = options.condition?.trim() ?? "";
  const inlineCondition = right.match(/^\[([^\]]*)\]\s*/);
  if (inlineCondition) {
    if (!condition) condition = inlineCondition[1]!.trim();
    right = right.slice(inlineCondition[0].length).trim();
  }

  const diagnostics: ChemDiagnostic[] = [];
  if (!left) diagnostics.push({ code: "missing-reactants", message: "反応矢印の左側に反応物を入力してください。", severity: "error" });
  if (!right) diagnostics.push({ code: "missing-products", message: "反応矢印の右側に生成物を入力してください。", severity: "error" });

  const reactants = left ? splitSpecies(left).map((item, index) => {
    const parsed = parseSpecies(item);
    diagnostics.push(...decorateDiagnostics(parsed.diagnostics, "reactant", index));
    return parsed.species;
  }) : [];
  const products = right ? splitSpecies(right).map((item, index) => {
    const parsed = parseSpecies(item);
    diagnostics.push(...decorateDiagnostics(parsed.diagnostics, "product", index));
    return parsed.species;
  }) : [];

  if ([...reactants, ...products].some((item) => !item.formula)) {
    diagnostics.push({ code: "empty-species", message: "+ の前後に化学式を入力してください。", severity: "error" });
  }

  const leftTotals = sideTotals(reactants);
  const rightTotals = sideTotals(products);
  const elements = new Set([...Object.keys(leftTotals.atoms), ...Object.keys(rightTotals.atoms)]);
  const elementDelta: AtomCounts = {};
  for (const element of elements) {
    const delta = (rightTotals.atoms[element] ?? 0) - (leftTotals.atoms[element] ?? 0);
    if (delta !== 0) elementDelta[element] = delta;
  }
  const chargeDelta = rightTotals.charge - leftTotals.charge;
  const valid = !diagnostics.some((item) => item.severity === "error");
  const balanced = valid && Object.keys(elementDelta).length === 0 && chargeDelta === 0;

  if (valid && !balanced) {
    if (Object.keys(elementDelta).length) diagnostics.push({ code: "atoms-unbalanced", message: "反応式の左右で原子数が一致していません。", severity: "warning" });
    if (chargeDelta !== 0) diagnostics.push({ code: "charge-unbalanced", message: `左右の総電荷が一致していません（差 ${chargeDelta > 0 ? "+" : ""}${chargeDelta}）。`, severity: "warning" });
  }

  return {
    balanced,
    diagnostics,
    elementDelta,
    kind: "reaction",
    reaction: { arrow, condition, products, reactants },
    species: [...reactants, ...products],
    valid
  };
}

type Fraction = { denominator: bigint; numerator: bigint };
const zero: Fraction = { numerator: 0n, denominator: 1n };
const one: Fraction = { numerator: 1n, denominator: 1n };

function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b) [a, b] = [b, a % b];
  return a || 1n;
}

function lcm(left: bigint, right: bigint) {
  return (left / gcd(left, right)) * right;
}

function fraction(numerator: bigint, denominator = 1n): Fraction {
  if (denominator === 0n) throw new Error("Division by zero");
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor * sign, denominator: denominator / divisor * sign };
}

function add(left: Fraction, right: Fraction) {
  return fraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
}

function subtract(left: Fraction, right: Fraction) {
  return add(left, fraction(-right.numerator, right.denominator));
}

function multiply(left: Fraction, right: Fraction) {
  return fraction(left.numerator * right.numerator, left.denominator * right.denominator);
}

function divide(left: Fraction, right: Fraction) {
  return fraction(left.numerator * right.denominator, left.denominator * right.numerator);
}

function solveNullspace(matrix: bigint[][]): bigint[] | null {
  if (!matrix.length || !matrix[0]?.length) return null;
  const rows = matrix.map((row) => row.map((value) => fraction(value)));
  const columnCount = rows[0]!.length;
  const pivotColumns: number[] = [];
  let pivotRow = 0;

  for (let column = 0; column < columnCount && pivotRow < rows.length; column += 1) {
    const candidate = rows.findIndex((row, index) => index >= pivotRow && row[column]!.numerator !== 0n);
    if (candidate === -1) continue;
    [rows[pivotRow], rows[candidate]] = [rows[candidate]!, rows[pivotRow]!];
    const pivot = rows[pivotRow]![column]!;
    rows[pivotRow] = rows[pivotRow]!.map((value) => divide(value, pivot));
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      if (rowIndex === pivotRow) continue;
      const factor = rows[rowIndex]![column]!;
      if (factor.numerator === 0n) continue;
      rows[rowIndex] = rows[rowIndex]!.map((value, index) => subtract(value, multiply(factor, rows[pivotRow]![index]!)));
    }
    pivotColumns.push(column);
    pivotRow += 1;
  }

  const freeColumns = Array.from({ length: columnCount }, (_, index) => index).filter((column) => !pivotColumns.includes(column));
  if (!freeColumns.length || freeColumns.length > 3) return null;

  const buildVector = (freeValues: bigint[]) => {
    const vector = Array.from({ length: columnCount }, () => zero);
    freeColumns.forEach((column, index) => { vector[column] = fraction(freeValues[index]!); });
    for (let rowIndex = pivotColumns.length - 1; rowIndex >= 0; rowIndex -= 1) {
      const pivotColumn = pivotColumns[rowIndex]!;
      let sum = zero;
      for (const freeColumn of freeColumns) sum = add(sum, multiply(rows[rowIndex]![freeColumn]!, vector[freeColumn]!));
      vector[pivotColumn] = fraction(-sum.numerator, sum.denominator);
    }
    return vector;
  };

  let best: bigint[] | null = null;
  const search = (values: bigint[]) => {
    if (values.length === freeColumns.length) {
      const vector = buildVector(values);
      if (vector.some((value) => value.numerator <= 0n)) return;
      let denominatorLcm = 1n;
      for (const value of vector) denominatorLcm = lcm(denominatorLcm, value.denominator);
      let integers = vector.map((value) => value.numerator * (denominatorLcm / value.denominator));
      const divisor = integers.reduce((current, value) => gcd(current, value));
      integers = integers.map((value) => value / divisor);
      if (!best || integers.reduce((sum, value) => sum + value, 0n) < best.reduce((sum, value) => sum + value, 0n)) best = integers;
      return;
    }
    for (let value = 1n; value <= 8n; value += 1n) search([...values, value]);
  };
  search([]);
  return best;
}

function speciesWithoutCoefficient(species: ChemSpecies) {
  const state = species.state ? `(${species.state})` : "";
  const magnitude = Math.abs(species.charge);
  const charge = species.charge === 0 ? "" : `^${magnitude === 1 ? "" : magnitude}${species.charge > 0 ? "+" : "-"}`;
  return `${species.formula}${charge}${state}`;
}

export type BalanceResult = {
  coefficients: number[];
  condition: string;
  source: string;
};

export function balanceChemReaction(value: string, options: { condition?: string } = {}): BalanceResult | null {
  const analysis = analyzeChem(value, options);
  const reaction = analysis.reaction;
  if (!reaction || !analysis.valid) return null;
  const species = [...reaction.reactants, ...reaction.products];
  if (species.length < 2) return null;
  const elements = [...new Set(species.flatMap((item) => Object.keys(item.atoms)))].sort();
  const hasCharge = species.some((item) => item.charge !== 0);
  const matrix: bigint[][] = elements.map((element) => species.map((item, index) => {
    const sign = index < reaction.reactants.length ? 1 : -1;
    return BigInt((item.atoms[element] ?? 0) * sign);
  }));
  if (hasCharge) matrix.push(species.map((item, index) => BigInt(item.charge * (index < reaction.reactants.length ? 1 : -1))));
  const solved = solveNullspace(matrix);
  if (!solved || solved.some((value) => value > BigInt(Number.MAX_SAFE_INTEGER))) return null;
  const coefficients = solved.map(Number);
  const renderSide = (items: ChemSpecies[], offset: number) => items.map((item, index) => {
    const coefficient = coefficients[offset + index]!;
    return `${coefficient === 1 ? "" : coefficient}${speciesWithoutCoefficient(item)}`;
  }).join(" + ");
  const source = `${renderSide(reaction.reactants, 0)} ${reaction.arrow} ${renderSide(reaction.products, reaction.reactants.length)}`;
  return { coefficients, condition: reaction.condition, source };
}

export function summarizeAnalysis(analysis: ChemAnalysis) {
  if (analysis.kind === "empty") return "入力待ち";
  if (!analysis.valid) return "入力を確認";
  if (analysis.kind === "formula") {
    const elements = Object.entries(analysis.species[0]?.atoms ?? {}).map(([element, count]) => `${element}${count === 1 ? "" : count}`);
    return elements.length ? `${elements.length}元素・組成を認識` : "化学式を認識";
  }
  return analysis.balanced ? "原子数と電荷が保存されています" : "係数の調整が必要です";
}
