import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

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

  await page.getByRole("button", { name: "x²" }).click();
  await expect.poll(() => field.evaluate((node: HTMLElement & { value: string }) => node.value)).toContain("x");
  await page.getByRole("button", { name: "次の入力欄へ" }).click();

  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  const source = page.getByRole("textbox", { name: "LaTeXソース" });
  await source.fill(String.raw`x^2+5x+6=0`);

  const outputs = ["Ask AI", "Plain", "Strict β", "LaTeX", "Markdown", "MathML", "Embed"];
  for (const name of outputs) {
    await page.getByRole("tab", { name }).click();
    await expect(page.getByRole("tabpanel")).toBeVisible();
  }

  await page.getByRole("tab", { name: "Strict β" }).click();
  await expect(page.getByText("ASCIIMathを基礎にした暫定仕様です。")).toBeVisible();

  await page.getByRole("tab", { name: "Ask AI" }).click();
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
  await expect(page.getByRole("button", { name: "Ask AIをコピー" })).toBeDisabled();
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

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "新規" }).click();
  await expect.poll(value).toBe("");

  await page.getByRole("button", { name: "二次式から始める" }).click();
  await expect.poll(value).toContain("x^2");
  await expect.poll(value).toContain(String.raw`\placeholder`);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "新規" }).click();
  await page.getByRole("button", { name: "定積分から始める" }).click();
  await expect.poll(value).toContain(String.raw`\int`);
  await expect.poll(value).toContain(String.raw`\placeholder`);
});

test("出力タブは矢印キー、Home、Endで移動できる", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);

  const aiTab = page.getByRole("tab", { name: "Ask AI" });
  await aiTab.focus();
  await aiTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Plain" })).toBeFocused();
  await page.getByRole("tab", { name: "Plain" }).press("End");
  await expect(page.getByRole("tab", { name: "Embed" })).toBeFocused();
  await page.getByRole("tab", { name: "Embed" }).press("Home");
  await expect(aiTab).toBeFocused();
});

test("記号バリエーションはフォーカスを管理しEscapeで閉じる", async ({ page }) => {
  await page.goto("/");
  await waitForMathfield(page);
  await page.getByRole("button", { name: "Calculus" }).click();

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
  await page.getByRole("button", { name: "Calculus" }).click();

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
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill(String.raw`a^2+b^2=c^2`);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mojikumi.math.draft.v1"))).toContain("a^2+b^2=c^2");
  await expect(page.locator('[aria-live="polite"]')).toContainText("下書きを保存しました");

  await page.getByRole("button", { name: "ダークテーマ" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await waitForMathfield(page);
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "LaTeXソース" })).toHaveValue(String.raw`a^2+b^2=c^2`);
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
