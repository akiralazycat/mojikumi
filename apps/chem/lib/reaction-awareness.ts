import type { ChemReaction, ChemSpecies } from "./chem-model";

export type ReactionSide = "reactant" | "product";

export type SpeciesRef = {
  side: ReactionSide;
  index: number;
};

export type ElementBalanceRow = {
  element: string;
  reactantCount: number;
  productCount: number;
  delta: number;
  balanced: boolean;
  species: SpeciesRef[];
};

function countElement(species: ChemSpecies, element: string) {
  return (species.atoms[element] ?? 0) * species.coefficient;
}

export function speciesRefKey(ref: SpeciesRef) {
  return `${ref.side}:${ref.index}`;
}

export function speciesContainsElement(species: ChemSpecies, element: string) {
  return (species.atoms[element] ?? 0) > 0;
}

export function buildElementBalance(reaction: ChemReaction): ElementBalanceRow[] {
  const elements: string[] = [];
  const seen = new Set<string>();
  for (const species of [...reaction.reactants, ...reaction.products]) {
    for (const element of Object.keys(species.atoms)) {
      if (seen.has(element)) continue;
      seen.add(element);
      elements.push(element);
    }
  }

  return elements.map((element) => {
    const reactantCount = reaction.reactants.reduce(
      (total, species) => total + countElement(species, element),
      0
    );
    const productCount = reaction.products.reduce(
      (total, species) => total + countElement(species, element),
      0
    );
    const species: SpeciesRef[] = [];
    reaction.reactants.forEach((item, index) => {
      if (speciesContainsElement(item, element)) species.push({ side: "reactant", index });
    });
    reaction.products.forEach((item, index) => {
      if (speciesContainsElement(item, element)) species.push({ side: "product", index });
    });
    const delta = productCount - reactantCount;
    return {
      element,
      reactantCount,
      productCount,
      delta,
      balanced: delta === 0,
      species
    };
  }).sort((left, right) => {
    if (left.balanced !== right.balanced) return left.balanced ? 1 : -1;
    return left.element.localeCompare(right.element, "en");
  });
}

export function getSpecies(reaction: ChemReaction, ref: SpeciesRef | null) {
  if (!ref) return null;
  return ref.side === "reactant"
    ? reaction.reactants[ref.index] ?? null
    : reaction.products[ref.index] ?? null;
}
