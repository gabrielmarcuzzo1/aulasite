import { expect, test } from "@playwright/test";
import type { Frame, Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

type ScrollProbe = { done: boolean; points: [number, number][] };
type ProbeWindow = Window & { __scrollProbe: ScrollProbe };

async function checkInertia(page: Page, document: Page | Frame) {
  await document.evaluate(() => {
    const probe: ScrollProbe = { done: false, points: [] };
    (window as ProbeWindow).__scrollProbe = probe;
    window.addEventListener(
      "wheel",
      () => {
        const start = performance.now();
        function sample(now: number) {
          probe.points.push([now - start, window.scrollY]);
          if (now - start < 1400) requestAnimationFrame(sample);
          else probe.done = true;
        }
        requestAnimationFrame(sample);
      },
      { once: true },
    );
  });
  await page.mouse.move(640, 450);
  await page.mouse.wheel(0, 640);
  await expect
    .poll(
      () => document.evaluate(() => (window as ProbeWindow).__scrollProbe.done),
      { timeout: 5000 },
    )
    .toBe(true);
  const points = await document.evaluate(
    () => (window as ProbeWindow).__scrollProbe.points,
  );
  const at = (time: number) => points.find(([elapsed]) => elapsed >= time)![1];
  expect(at(100)).toBeGreaterThan(0);
  expect(at(100)).toBeLessThan(600);
  expect(at(400)).toBeGreaterThan(at(100));
  expect(at(250) - at(100)).toBeGreaterThan((at(750) - at(600)) * 2);
  expect(points.at(-1)![1]).toBeCloseTo(640, 0);
  expect(Math.abs(points.at(-1)![1] - at(1200))).toBeLessThan(2);
}

test.use({
  reducedMotion: "no-preference",
  viewport: { width: 1280, height: 900 },
});

test("os blocos ficam preparados fora da tela e aparecem ao entrar no viewport", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator(".service-grid > .reveal").first();
  await expect(card).toHaveCSS("opacity", "0");
  await page.locator("#solucoes").scrollIntoViewIfNeeded();
  await expect
    .poll(async () => {
      const opacity = await card.evaluate((element) =>
        Number(getComputedStyle(element).opacity),
      );
      return opacity > 0 && opacity < 1;
    })
    .toBe(true);
  await expect(card).toHaveCSS("opacity", "1");
  await expect(card).toHaveCSS("filter", "blur(0px)");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(card).toHaveCSS("opacity", "1");
});

test("a roda do mouse continua o movimento e desacelera até parar", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await checkInertia(page, page);
});

test("os CTAs mantêm navegação suave até o formulário", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.locator(".header-cta").click();
  await expect(page).toHaveURL(/#diagnostico$/);
  await expect(page.getByLabel("Nome", { exact: true })).toBeInViewport();
});

test("a preferência por movimento reduzido desativa a inércia e mostra os blocos", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator(".service-grid > .reveal").first();
  await expect(card).toHaveCSS("opacity", "0");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(card).toHaveCSS("opacity", "1");
  await page.locator(".header-cta").click();
  await expect(page.getByLabel("Nome", { exact: true })).toBeInViewport();
});

test("a prévia HTML isolada também tem inércia e entradas na rolagem", async ({
  page,
}) => {
  await page.setContent(
    '<iframe title="Prévia V3" sandbox="allow-scripts" style="width:100%;height:900px;border:0"></iframe>',
  );
  await page.locator("iframe").evaluate(
    (element, html) => {
      (element as HTMLIFrameElement).srcdoc = html;
    },
    await readFile("preview.html", "utf8"),
  );
  const frame = page.frames().find((frame) => frame.parentFrame())!;
  await expect(frame.locator("html")).toHaveClass(/lenis/);
  const proof = frame.locator(".proof-grid > .reveal").first();
  await expect(proof).toHaveCSS("opacity", "0");
  await checkInertia(page, frame);
  await expect(proof).toHaveCSS("opacity", "1");
  await frame.locator(".header-cta").click();
  await expect(frame.getByLabel("Nome", { exact: true })).toBeInViewport();
});
