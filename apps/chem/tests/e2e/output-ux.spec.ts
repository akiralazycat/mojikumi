import { expect, test } from "@playwright/test";

test("ChemのOutput UXは形式・AI・Preview・Copyを一つの階層で扱う", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "化学式・反応式" }).fill("H2 + O2 -> H2O");

  await expect(page.getByRole("heading", { name: "変換してコピー" })).toBeVisible();
  await expect(page.getByText("よく使う", { exact: true })).toBeVisible();
  await expect(page.getByText("詳細", { exact: true })).toBeVisible();
  await expect(page.getByText("Preview", { exact: true })).toBeVisible();

  const aiSwitch = page.getByRole("checkbox", { name: "AIへの依頼文を付ける" });
  await aiSwitch.check();
  await expect(page.getByRole("group", { name: "AIへの依頼" })).toBeVisible();
  await expect(page.getByText("現在の出力: AI用テキスト")).toBeVisible();

  await page.getByRole("tab", { name: "mhchem" }).click();
  await expect(aiSwitch).not.toBeChecked();
  await expect(page.getByText("現在の出力: mhchem")).toBeVisible();
  await expect(page.getByRole("button", { name: "mhchemをコピー" })).toBeEnabled();
});
