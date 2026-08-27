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

test("主要画面に重大なアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
});
