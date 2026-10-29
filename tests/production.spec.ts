import { expect, test } from "@playwright/test";

test.use({
  reducedMotion: "no-preference",
  viewport: { width: 1280, height: 900 },
});

test("o site de produção carrega a versão compilada com os efeitos ativos", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  const response = await page.goto(
    process.env.PUBLISHED_SITE_URL || "http://127.0.0.1:4175/",
    { waitUntil: "networkidle" },
  );
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="v3-build"]')).toHaveAttribute(
    "content",
    /^(local|[a-f0-9]{12})$/,
  );
  await expect(page.locator("script[src]")).toHaveAttribute(
    "src",
    /^(?:\.\/|\/)assets\/.+\.js$/,
  );
  await expect(page.locator("html")).toHaveClass(/lenis/);
  const card = page.locator(".service-grid > .reveal").first();
  await expect(card).toHaveCSS("opacity", "0");

  await page.mouse.move(640, 450);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(500);
  await page.locator("#solucoes").scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS("opacity", "1");
  await expect(card).toHaveCSS("filter", "blur(0px)");
  expect(errors).toEqual([]);
});
