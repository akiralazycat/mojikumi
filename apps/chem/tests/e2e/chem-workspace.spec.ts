import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("化学式を組版し、各形式へ変換してコピーできる", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "化学式・反応式" });
  await input.fill("SO4^2- + 2H^+ -> H2SO4");

  const preview = page.getByRole("math").first();
  await expect(preview.locator("sub").first()).toHaveText("4");
  await expect(preview.locator("sup").first()).toHaveText("2-");
  await expect(preview).toContainText("→");

  await page.getByRole("tab", { name: "mhchem" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(String.raw`\ce{SO4^2- + 2H^+ -> H2SO4}`);
  await page.getByRole("button", { name: "mhchemをコピー" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(String.raw`\ce{`);

  await page.getByRole("checkbox", { name: "AIへの依頼文を付ける" }).check();
  await page.getByRole("button", { name: "係数を整える" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("最小の整数比");
});

test("開始例、記号キー、端末内保存を一つの流れで使える", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /中和反応/ }).click();
  const input = page.getByRole("textbox", { name: "化学式・反応式" });
  await expect(input).toHaveValue("CH3COOH + NaOH → CH3COONa + H2O");
  await input.press("End");
  await page.getByRole("button", { name: "水溶液" }).click();
  await expect(input).toHaveValue(/\(aq\)$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mojikumi.chem.draft.v1"))).toContain("CH3COOH");
});

test("反応式を検証し、係数を整えてUndoできる", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "化学式・反応式" });
  await input.fill("H2 + O2 -> H2O");
  await expect(page.getByText("係数の調整が必要です")).toBeVisible();
  await expect(page.locator(".delta-list")).toContainText("O反応物に 1 多い");

  await page.locator(".analysis-panel").getByRole("button", { name: "係数を整える" }).click();
  await expect(input).toHaveValue("2H2 + O2 → 2H2O");
  await expect(page.getByText("原子数と電荷が保存されています")).toBeVisible();

  await page.getByRole("button", { name: "元に戻す" }).click();
  await expect(input).toHaveValue("H2 + O2 -> H2O");
  await page.getByRole("button", { name: "やり直す" }).click();
  await expect(input).toHaveValue("2H2 + O2 → 2H2O");
});

test("反応条件を表示とmhchem出力へ反映する", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "化学式・反応式" });
  await input.fill("N2 + 3H2 <=> 2NH3");
  await page.getByRole("textbox", { name: /反応条件/ }).fill("Fe, 450 °C");
  await expect(page.locator(".formula-condition")).toHaveText("Fe, 450 °C");
  await page.getByRole("tab", { name: "mhchem" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("<=>[Fe, 450 °C]");
});

test("主要画面に重大なアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
});
