import { expect, test, type Page } from "@playwright/test";

async function waitForMathfield(page: Page) {
  const field = page.locator("math-field");
  await expect(field).toBeVisible();
  await expect.poll(() => field.evaluate((node: HTMLElement & { value?: string }) => typeof node.value)).toBe("string");
  return field;
}

test("共有URL、形式自動判定、端末履歴を一つの流れで使える", async ({ page }) => {
  const shared = new URLSearchParams({ v: "1", expr: String.raw`\sqrt{x+1}` });
  await page.goto(`/#${shared.toString()}`);
  const field = await waitForMathfield(page);
  const value = () => field.evaluate((node: HTMLElement & { value: string }) => node.value);

  await expect.poll(value).toContain(String.raw`\sqrt`);

  await page.getByRole("button", { name: "新規" }).click();
  await expect.poll(value).toBe("");

  await page.getByRole("button", { name: "読み込む" }).click();
  await page.getByRole("textbox", { name: "貼り付ける" }).fill("1/2");
  await expect(page.getByText("AsciiMathとして認識")).toBeVisible();
  await page.getByRole("button", { name: "この数式を読み込む" }).click();
  await expect.poll(value).toContain(String.raw`\frac`);

  await page.getByRole("button", { name: "共有" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("#v=1&expr=");

  await page.getByRole("button", { name: "新規" }).click();
  await page.getByRole("button", { name: "履歴" }).click();
  await expect(page.getByRole("region", { name: "この端末の数式履歴" })).toContainText(String.raw`\frac`);
  await page.locator(".history-open").first().click();
  await expect.poll(value).toContain(String.raw`\frac`);
});
