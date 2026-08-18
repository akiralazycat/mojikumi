import { expect, test } from "@playwright/test";

test("初回訪問後にオフラインで編集画面を再表示でき、数式をキャッシュしない", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "PWAオフライン検証はdesktopプロジェクトで一度実行する");

  const sentinel = "privateFormulaSentinel987";
  const leakedRequests: string[] = [];
  page.on("request", (request) => {
    const material = `${request.url()} ${request.postData() ?? ""}`;
    if (material.includes(sentinel)) leakedRequests.push(material);
  });

  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.pwaReady === "true");
  await page.getByRole("button", { name: "LaTeX", exact: true }).click();
  await page.getByRole("textbox", { name: "LaTeXソース" }).fill(sentinel);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mojikumi.math.draft.v1"))).toContain(sentinel);

  const cacheContainsFormula = await page.evaluate(async (privateValue) => {
    for (const cacheName of await caches.keys()) {
      const cache = await caches.open(cacheName);
      for (const request of await cache.keys()) {
        const response = await cache.match(request);
        if (response && (await response.clone().text()).includes(privateValue)) return true;
      }
    }
    return false;
  }, sentinel);

  expect(cacheContainsFormula).toBe(false);
  expect(leakedRequests).toEqual([]);

  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: "数式を自然に組み上げる" })).toBeVisible();
    await page.getByRole("button", { name: "LaTeX", exact: true }).click();
    await expect(page.getByRole("textbox", { name: "LaTeXソース" })).toHaveValue(sentinel);
  } finally {
    await context.setOffline(false);
  }
});
