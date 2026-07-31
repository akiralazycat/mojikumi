import type { Dictionary } from "../../content";
import { Playground } from "../playground/playground";

export function PlaygroundPage({ dictionary }: { dictionary: Dictionary }) {
  return (
    <main className="page-shell page-shell-wide">
      <header className="page-intro page-intro-compact">
        <p className="eyebrow">{dictionary.playground.eyebrow}</p>
        <h1>{dictionary.playground.heading}</h1>
        <p>{dictionary.playground.lead}</p>
      </header>
      <Playground dictionary={dictionary} />
    </main>
  );
}
