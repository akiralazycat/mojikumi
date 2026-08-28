import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { typesettingFixtures } from "../../lib/typesetting-fixtures";

async function waitForMathfield(page: Page) {
  const field = page.locator("math-field");
  await expect(field).toBeVisible();
  await expect.poll(() => field.evaluate((node: HTMLElement & { value?: string }) => typeof node.value)).toBe("string");
  return field;
}

test("入力、ソース編集、全出力、コピーを一つの流れで使える", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);

  await expect.poll(() => field.evaluate((node: HTMLElement & { value: string }) => node.value)).toBe("");

  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill("a");
  await page.getByRole("button", { name: "Visual", exact: true }).click();
  await page.getByRole("button", { name: "累乗を挿入" }).click();
  await expect.poll(() => field.evaluate((node: HTMLElement & { value: string }) => node.value)).toContain("a^");
  await page.getByRole("button", { name: "次の入力欄へ" }).click();

  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  const source = page.getByRole("textbox", { name: "LaTeXソース" });
  await source.fill(String.raw`x^2+5x+6=0`);

  const outputs = ["テキスト", "Readable", "Strict β", "LaTeX", "Markdown", "MathML", "Embed"];
  for (const name of outputs) {
    await page.getByRole("tab", { name }).click();
    await expect(page.getByRole("tabpanel")).toBeVisible();
  }

  await page.getByRole("tab", { name: "Strict β" }).click();
  await expect(page.getByText("ASCIIMathを基礎にした暫定仕様です。")).toBeVisible();

  await page.getByRole("tab", { name: "Readable" }).click();
  await expect(page.getByText("Strict βから安全な記号置換だけで生成する")).toBeVisible();
  await expect(page.getByRole("tabpanel")).toContainText("x²");
  await expect(page.getByRole("tabpanel")).not.toContainText("x^2");
  await page.getByRole("button", { name: "Readableをコピー" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("x²");

  await page.getByRole("tab", { name: "テキスト" }).click();
  await page.getByRole("checkbox", { name: "依頼文を付ける" }).check();
  await page.getByRole("button", { name: "解く" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("途中の手順");

  await page.getByRole("tab", { name: "LaTeX" }).click();
  await page.getByRole("button", { name: "LaTeXをコピー" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(String.raw`x^2+5x+6=0`);
});

test("初回は空欄から開始し、開始候補と入力順序を提示する", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);

  await expect.poll(() => field.evaluate((node: HTMLElement & { value: string }) => node.value)).toBe("");
  await expect(page.getByRole("button", { name: "テキストをコピー" })).toBeDisabled();
  await expect(page.getByText("数式を入力すると変換結果が表示されます")).toBeVisible();
  await expect(page.getByRole("button", { name: "分数から始める" })).toBeVisible();
  await expect(page.getByRole("button", { name: "二次式から始める" })).toBeVisible();
  await expect(page.getByRole("button", { name: "定積分から始める" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mojikumi.math.draft.v1"))).not.toContain(String.raw`\int_0^\infty`);

  const workspaceOrder = await page.locator(".workspace").evaluate((workspace) =>
    Array.from(workspace.children)
      .map((child) => child.className)
      .filter((className) => ["workspace-topbar", "canvas-wrap", "keyboard", "output-panel"].includes(className))
  );
  expect(workspaceOrder).toEqual(["workspace-topbar", "canvas-wrap", "keyboard", "output-panel"]);
});

test("開始候補はプレースホルダー付き構造を挿入し、新規作成で戻せる", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  const value = () => field.evaluate((node: HTMLElement & { value: string }) => node.value);

  await page.getByRole("button", { name: "分数から始める" }).click();
  await expect.poll(value).toContain(String.raw`\frac`);
  await expect.poll(value).toContain(String.raw`\placeholder`);
  await expect(field).toBeFocused();
  await expect(page.getByRole("button", { name: "分数から始める" })).toBeHidden();

  await page.getByRole("button", { name: "新規" }).click();
  await expect.poll(value).toBe("");

  await page.getByRole("button", { name: "二次式から始める" }).click();
  await expect.poll(value).toContain("x^2");
  await expect.poll(value).toContain(String.raw`\placeholder`);

  await page.getByRole("button", { name: "新規" }).click();
  await page.getByRole("button", { name: "定積分から始める" }).click();
  await expect.poll(value).toContain(String.raw`\int`);
  await expect.poll(value).toContain(String.raw`\placeholder`);
});

test("新規作成は確認なしで消し、元に戻せる", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  const value = () => field.evaluate((node: HTMLElement & { value: string }) => node.value);

  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill(String.raw`x^2+1`);
  await page.getByRole("button", { name: "Visual", exact: true }).click();

  await page.getByRole("button", { name: "新規" }).click();
  await expect.poll(value).toBe("");
  await page.getByRole("button", { name: "消した数式を戻す" }).click();
  await expect.poll(value).toContain("x^2");
  await expect(page.getByRole("button", { name: "消した数式を戻す" })).toBeHidden();
});

test("未入力の欄は出力にも残る", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);

  await page.getByRole("button", { name: "分数から始める" }).click();
  await expect(page.getByText("未入力の欄は□で示しています。")).toBeVisible();
  await page.getByRole("tab", { name: "LaTeX" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(String.raw`\square`);
  await expect(page.getByRole("tabpanel")).not.toContainText(String.raw`\placeholder`);
});

test("出力タブは矢印キー、Home、Endで移動できる", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);

  const textTab = page.getByRole("tab", { name: "テキスト" });
  await textTab.focus();
  await textTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Readable" })).toBeFocused();
  await page.getByRole("tab", { name: "Readable" }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Strict β" })).toBeFocused();
  await page.getByRole("tab", { name: "Strict β" }).press("End");
  await expect(page.getByRole("tab", { name: "Embed" })).toBeFocused();
  await page.getByRole("tab", { name: "Embed" }).press("Home");
  await expect(textTab).toBeFocused();
});

test("構造キーは入力後も使え、任意の文字へ累乗を追加できる", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  const value = () => field.evaluate((node: HTMLElement & { value: string }) => node.value);

  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill("a");
  await page.getByRole("button", { name: "Visual", exact: true }).click();
  await page.getByRole("button", { name: "累乗を挿入" }).click();
  await expect.poll(value).toContain("a^");
  await expect(page.getByRole("button", { name: "分数を挿入" })).toBeVisible();

  await page.getByRole("button", { name: "新規" }).click();
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill("a+b");
  await page.getByRole("button", { name: "Visual", exact: true }).click();
  await field.evaluate((node: HTMLElement & { select: () => void }) => node.select());
  await page.getByRole("button", { name: "分数を挿入" }).click();
  await expect.poll(value).toContain(String.raw`\frac{a+b}`);
});

test("分数の要素選択から分数全体へ広げ、内側へ戻せる", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);

  await page.getByRole("button", { name: "分数から始める" }).click();
  const navigator = page.getByRole("group", { name: "数式内の要素を選択" });
  await expect(navigator).toBeVisible();

  await navigator.getByRole("button", { name: "要素を選択" }).click();
  await expect(page.locator('[aria-live="polite"]')).toContainText("現在の要素を選択しました");
  await navigator.getByRole("button", { name: "外側へ" }).click();
  await expect(page.locator(".selection-status")).toContainText("分数全体");
  await expect(page.locator(".selection-status")).toContainText("外側 +1");
  await expect(navigator.getByRole("button", { name: "内側へ" })).toBeEnabled();

  await navigator.getByRole("button", { name: "内側へ" }).click();
  await expect(page.locator(".selection-status")).toContainText("現在の要素");
  await expect.poll(() => field.evaluate((node: HTMLElement & { value: string }) => node.value)).toContain(String.raw`\frac`);
});

test("入れ子分数は最も内側から一段ずつ外側へ選択できる", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);

  await page.getByRole("button", { name: "分数から始める" }).click();
  await page.getByRole("button", { name: "次の入力欄へ" }).click();
  await page.getByRole("button", { name: "分数を挿入" }).click();

  const navigator = page.getByRole("group", { name: "数式内の要素を選択" });
  await navigator.getByRole("button", { name: "要素を選択" }).click();
  await navigator.getByRole("button", { name: "外側へ" }).click();
  await expect(page.locator(".selection-status")).toContainText("分数全体");
  await expect(page.locator(".selection-status")).toContainText("外側 +1");

  await navigator.getByRole("button", { name: "外側へ" }).click();
  await expect(page.locator(".selection-status")).toContainText("外側 +2");
  await navigator.getByRole("button", { name: "内側へ" }).click();
  await expect(page.locator(".selection-status")).toContainText("外側 +1");
});

test("MathLiveの記号色をMojikumiの選択トークンで統一する", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  await page.getByRole("button", { name: "分数から始める" }).click();

  const tokens = await field.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      contains: style.getPropertyValue("--contains-highlight-color").trim(),
      ink: style.getPropertyValue("--ink").trim(),
      placeholder: style.getPropertyValue("--placeholder-color").trim(),
      primary: style.getPropertyValue("--primary").trim(),
      selection: style.getPropertyValue("--selection-color").trim(),
      smartFence: style.getPropertyValue("--smart-fence-color").trim()
    };
  });
  expect(tokens.contains).toBe(tokens.ink);
  expect(tokens.selection).toBe(tokens.ink);
  expect(tokens.smartFence).toBe(tokens.ink);
  expect(tokens.placeholder).toContain(tokens.ink);
  expect(tokens.placeholder).toContain(tokens.primary);
});

test("ΣとΠは右側の被演算子まで一つの構造として挿入する", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  await page.getByRole("button", { name: "解析" }).click();
  await page.getByRole("button", { name: "Σ", exact: true }).click();
  const value = await field.evaluate((node: HTMLElement & { value: string }) => node.value);
  expect(value).toContain(String.raw`\sum`);
  expect(value.match(/\\placeholder/g)).toHaveLength(3);
});

test("積分を下限・上限・式・変数の名前で選択できる", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill(String.raw`\int_{0}^{1}x^2\,dx`);
  await page.getByRole("button", { name: "Visual", exact: true }).click();

  const selectedLatex = () => field.evaluate((node: HTMLElement & {
    selection: unknown;
    getValue: (selection: unknown, format: string) => string;
  }) => node.getValue(node.selection, "latex"));
  const cases = [
    ["積分の下限を選択", "0"],
    ["積分の上限を選択", "1"],
    ["積分の式を選択", "x^2"],
    ["積分の変数を選択", "x"]
  ] as const;
  const selectedRanges = new Map<string, [number, number]>();
  for (const [name, expected] of cases) {
    await page.getByRole("button", { name }).click();
    await expect.poll(selectedLatex).toBe(expected);
    selectedRanges.set(name, await field.evaluate((node: HTMLElement & {
      selection: { ranges: Array<[number, number]> };
    }) => node.selection.ranges[0] ?? [0, 0]));
    await expect(page.getByRole("button", { name })).toHaveAttribute("aria-pressed", "true");
  }
  expect(selectedRanges.get("積分の変数を選択")?.[0])
    .toBeGreaterThan(selectedRanges.get("積分の式を選択")?.[1] ?? 0);
  await expect(page.locator(".selection-status")).toContainText("積分・変数");
});

test("空の積分も名前付き要素を順番に埋められる", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  await page.getByRole("button", { name: "解析" }).click();
  await page.getByRole("button", { name: "∫", exact: true }).click();

  const fillSelected = async (name: string, value: string) => {
    await page.getByRole("button", { name }).click();
    await field.evaluate((node: HTMLElement & { insert: (value: string) => void }, content) => {
      node.insert(content);
    }, value);
  };
  await fillSelected("積分の下限を選択", "0");
  await fillSelected("積分の上限を選択", "1");
  await fillSelected("積分の式を選択", "x^2");
  await fillSelected("積分の変数を選択", "x");
  await expect.poll(() => field.evaluate((node: HTMLElement & { value: string }) => node.value))
    .toContain(String.raw`\int_0^1x^2\,dx`);
});

test("入れ子の積分では現在位置に最も近い積分の変数を選ぶ", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" })
    .fill(String.raw`\int_0^1\left(\int_0^x t\,dt\right)\,dx`);
  await page.getByRole("button", { name: "Visual", exact: true }).click();

  await field.evaluate((node: HTMLElement & {
    getValue: (selection: unknown, format: string) => string;
    lastOffset: number;
    position: number;
  }) => {
    const starts: number[] = [];
    let previousOffsetStartsIntegral = false;
    for (let start = 0; start < node.lastOffset; start += 1) {
      let startsIntegral = false;
      for (let end = start + 1; end <= Math.min(node.lastOffset, start + 32); end += 1) {
        const latex = node.getValue({ ranges: [[start, end]], direction: "forward" }, "latex");
        if (!/^\{?\\int/u.test(latex)) continue;
        startsIntegral = true;
        break;
      }
      if (startsIntegral && !previousOffsetStartsIntegral) starts.push(start);
      previousOffsetStartsIntegral = startsIntegral;
    }
    const innerStart = starts.at(-1);
    if (innerStart === undefined || starts.length < 2) throw new Error("inner integral atom was not found");
    node.position = innerStart + 1;
  });

  const selectedLatex = () => field.evaluate((node: HTMLElement & {
    selection: unknown;
    getValue: (selection: unknown, format: string) => string;
  }) => node.getValue(node.selection, "latex"));
  await page.getByRole("button", { name: "積分の変数を選択" }).click();
  await expect.poll(selectedLatex).toBe("t");

  await field.evaluate((node: HTMLElement & { lastOffset: number; position: number }) => {
    node.position = node.lastOffset;
  });
  await page.getByRole("button", { name: "積分の変数を選択" }).click();
  await expect.poll(selectedLatex).toBe("x");
});

test("シグマを下側条件・上限・総和式の名前で選択できる", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill(String.raw`\sum_{i=1}^{n}\,i^2`);
  await page.getByRole("button", { name: "Visual", exact: true }).click();

  const selectedLatex = () => field.evaluate((node: HTMLElement & {
    selection: unknown;
    getValue: (selection: unknown, format: string) => string;
  }) => node.getValue(node.selection, "latex"));
  const cases = [
    ["シグマの下側条件を選択", "i=1"],
    ["シグマの上限を選択", "n"],
    ["シグマの総和式を選択", "i^2"]
  ] as const;
  for (const [name, expected] of cases) {
    await page.getByRole("button", { name }).click();
    await expect.poll(selectedLatex).toBe(expected);
  }
  await expect(page.locator(".selection-status")).toContainText("シグマ・総和式");
});

test("長い数式でも構造要素の選択が操作予算に収まる", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill(
    String.raw`\frac{1}{n}\sum_{i=1}^{n}\frac{x_i-\mu}{\sigma}+\int_{0}^{1}\frac{x^2+3x+2}{1+x^2}\,dx`
  );
  await page.getByRole("button", { name: "Visual", exact: true }).click();

  const timeClick = (name: string) => page.evaluate((label) => {
    const button = document.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);
    if (!button) throw new Error(`${label} was not rendered`);
    const started = performance.now();
    button.click();
    return performance.now() - started;
  }, name);

  const firstIntegral = await timeClick("積分の変数を選択");
  const firstSum = await timeClick("シグマの上限を選択");
  const repeated = await timeClick("積分の変数を選択");

  // The first press of each kind builds the range index for the expression;
  // later presses reuse it until the expression changes.
  expect(firstIntegral, `integral ${firstIntegral}ms`).toBeLessThan(400);
  expect(firstSum, `sum ${firstSum}ms`).toBeLessThan(400);
  expect(repeated, `repeat ${repeated}ms`).toBeLessThan(150);
  console.log(`semantic selection: integral ${firstIntegral.toFixed(1)}ms, sum ${firstSum.toFixed(1)}ms, repeat ${repeated.toFixed(1)}ms`);
});

test("複合数式fixtureは数式キャンバス内で崩れずに表示される", async ({ page }) => {
  await page.goto("/");
  const field = await waitForMathfield(page);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  const source = page.getByRole("textbox", { name: "LaTeXソース" });

  for (const fixture of typesettingFixtures) {
    await source.fill(fixture.latex);
    await page.getByRole("button", { name: "Visual", exact: true }).click();
    await expect.poll(() => field.evaluate((node: HTMLElement & { value: string }) => node.value.length)).toBeGreaterThan(0);
    const geometry = await field.evaluate((node) => {
      const host = node.getBoundingClientRect();
      const content = node.shadowRoot?.querySelector<HTMLElement>(".ML__content");
      const bounds = content?.getBoundingClientRect();
      return {
        horizontalOverflow: content ? content.scrollWidth - content.clientWidth : Infinity,
        containedVertically: Boolean(bounds && bounds.top >= host.top - 1 && bounds.bottom <= host.bottom + 1)
      };
    });
    expect(geometry.horizontalOverflow, fixture.name).toBeLessThanOrEqual(1);
    expect(geometry.containedVertically, fixture.name).toBe(true);
    await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  }
});

test("記号バリエーションはフォーカスを管理しEscapeで閉じる", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);
  await page.getByRole("button", { name: "解析" }).click();

  const trigger = page.getByRole("button", { name: "∫のバリエーションを表示" });
  await trigger.click();
  const firstVariant = page.getByRole("button", { name: "∬" });
  await expect(firstVariant).toBeFocused();
  await firstVariant.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(firstVariant).toBeHidden();
});

test("長押しでも記号バリエーションを開いて選択できる", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "長押し経路はdesktopプロジェクトで一度実行する");
  await page.goto("/");
  await waitForMathfield(page);
  await page.getByRole("button", { name: "解析" }).click();

  const integral = page.getByRole("button", { name: "∫", exact: true });
  await integral.dispatchEvent("pointerdown", { pointerType: "touch" });
  await page.waitForTimeout(460);
  await integral.dispatchEvent("pointerup", { pointerType: "touch" });
  await expect(page.getByRole("button", { name: "∬" })).toBeFocused();
  await page.getByRole("button", { name: "∬" }).click();
});

test("MathLive数式フォントをローカル配信する", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "フォント配信はdesktopプロジェクトで一度実行する");
  const failedFonts: string[] = [];
  page.on("response", (response) => {
    if (response.url().includes("/fonts/") && response.status() >= 400) {
      failedFonts.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto("/");
  await waitForMathfield(page);
  await expect.poll(() => page.evaluate(() => document.fonts.check("16px KaTeX_Main"))).toBe(true);
  expect(failedFonts).toEqual([]);
});

test("下書きとテーマを端末内に復元する", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill(String.raw`\frac{a}{b}`);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mojikumi.math.draft.v1"))).toContain(String.raw`\frac{a}{b}`);
  await expect(page.locator(".save-status")).toContainText("保存済み");

  await page.getByRole("button", { name: "ダークテーマ" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await waitForMathfield(page);
  await expect(page.getByRole("tabpanel")).not.toContainText(String.raw`\frac`);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "LaTeXソース" })).toHaveValue(String.raw`\frac{a}{b}`);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("320px以上で主要UIが横にはみ出さない", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);
  const dimensions = await page.evaluate(() => {
    const canvas = document.querySelector<HTMLElement>(".canvas-wrap")?.getBoundingClientRect();
    const keyboard = document.querySelector<HTMLElement>(".keyboard")?.getBoundingClientRect();
    const output = document.querySelector<HTMLElement>(".output-panel")?.getBoundingClientRect();
    return {
      viewport: window.innerWidth,
      viewportHeight: window.innerHeight,
      document: document.documentElement.scrollWidth,
      workspace: document.querySelector<HTMLElement>(".workspace")?.getBoundingClientRect().width ?? 0,
      canvasTop: canvas?.top ?? Infinity,
      canvasBottom: canvas?.bottom ?? Infinity,
      keyboardTop: keyboard?.top ?? Infinity,
      keyboardBottom: keyboard?.bottom ?? Infinity,
      outputTop: output?.top ?? Infinity,
      undoVisible: Boolean(document.querySelector<HTMLElement>('[aria-label="元に戻す"]')?.offsetParent),
      mathContentOverflow: (() => {
      const field = document.querySelector("math-field");
      const content = field?.shadowRoot?.querySelector<HTMLElement>(".ML__content");
      return content ? content.scrollWidth - content.clientWidth : 0;
      })()
    };
  });
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.workspace).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.mathContentOverflow).toBeLessThanOrEqual(1);
  expect(dimensions.canvasBottom).toBeLessThanOrEqual(dimensions.keyboardTop + 1);
  expect(dimensions.keyboardBottom).toBeLessThanOrEqual(dimensions.outputTop + 1);
  if (dimensions.viewport <= 520) {
    expect(dimensions.canvasTop).toBeLessThan(dimensions.viewportHeight);
    expect(dimensions.keyboardTop).toBeLessThan(dimensions.viewportHeight);
    expect(dimensions.undoVisible).toBe(true);
  }
});

test("主要画面に重大なアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    // MathLive's host and focus sink are one composite editor. Axe treats that
    // shadow-DOM implementation as nested controls even though it has one tab stop.
    .disableRules(["nested-interactive"])
    .analyze();
  expect(results.violations).toEqual([]);

  await page.getByRole("button", { name: "分数から始める" }).click();
  const filledResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .disableRules(["nested-interactive"])
    .analyze();
  expect(filledResults.violations).toEqual([]);
});
