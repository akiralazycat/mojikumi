import { expect, test } from "@playwright/test";

test("MathのOutput UXは形式・AI・Preview・Copyを一つの階層で扱う", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("math-field")).toBeVisible();

  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill("x+1");

  await expect(page.getByRole("heading", { name: "変換してコピー" })).toBeVisible();
  await expect(page.getByText("よく使う", { exact: true })).toBeVisible();
  await expect(page.getByText("詳細", { exact: true })).toBeVisible();
  await expect(page.getByText("Preview", { exact: true })).toBeVisible();

  const aiSwitch = page.getByRole("checkbox", { name: "AIへの依頼文を付ける" });
  await aiSwitch.check();
  await expect(page.getByRole("group", { name: "AIへの依頼" })).toBeVisible();
  await expect(page.getByText("現在の出力: AI用テキスト")).toBeVisible();

  await page.getByRole("tab", { name: "LaTeX" }).click();
  await expect(aiSwitch).not.toBeChecked();
  await expect(page.getByText("現在の出力: LaTeX")).toBeVisible();

  const copyButton = page.getByRole("button", { name: "LaTeXをコピー" });
  await expect(copyButton).toBeEnabled();
  await copyButton.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("x+1");
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem("mojikumi.math.history.v1") ?? "")).toContain("x+1");

  // Output copy feedback must not create a second explicit polite live region.
  await expect(page.locator('[aria-live="polite"]')).toHaveCount(1);
});
