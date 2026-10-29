import { expect, test } from "@playwright/test";

test.use({
  reducedMotion: "no-preference",
  viewport: { width: 1280, height: 900 },
});

test("o build funciona em /aulademo/ sem buscar arquivos na raiz do domínio", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  const resources: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
    resources.push(new URL(response.url()).pathname);
  });
  expect(
    (await request.get("http://127.0.0.1:4176/assets/missing.js")).status(),
  ).toBe(404);
  await page.goto("http://127.0.0.1:4176/aulademo/", {
    waitUntil: "networkidle",
  });
  await expect(page.locator("h1")).toContainText("Comece a gerar vendas");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.locator(".header-cta").click();
  await expect(page).toHaveURL("http://127.0.0.1:4176/aulademo/#diagnostico");
  await expect(page.getByLabel("Nome", { exact: true })).toBeInViewport();
  await page.locator("#solucoes").scrollIntoViewIfNeeded();
  await expect(page.locator(".service-grid > .reveal").first()).toHaveCSS(
    "opacity",
    "1",
  );
  expect(resources.every((path) => path.startsWith("/aulademo/"))).toBe(true);
  expect(resources.some((path) => path.endsWith(".woff2"))).toBe(true);
  expect(errors).toEqual([]);
});
