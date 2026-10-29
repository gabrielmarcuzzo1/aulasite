import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const previewPath = resolve("preview.html");

test("o HTML independente renderiza sem servidor ou recursos externos", async ({
  page,
}) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (/^https?:/.test(request.url())) externalRequests.push(request.url());
  });
  await page.setContent(await readFile(previewPath, "utf8"));
  await expect(page.locator("h1")).toContainText("Comece a gerar vendas");
  await page.locator(".hero-action .button").click();
  await expect(page.getByLabel("Nome", { exact: true })).toBeInViewport();
  await page
    .locator("summary")
    .filter({ hasText: "Tem contrato de fidelidade?" })
    .click();
  await expect(
    page.getByText(
      "O contrato inicial é de 3 meses. Depois disso, a renovação é mensal.",
    ),
  ).toBeVisible();
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("a prévia renderiza em iframe isolado com JavaScript permitido", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setContent(
    '<iframe title="Prévia V3" sandbox="allow-scripts" style="width:100%;height:900px;border:0"></iframe>',
  );
  await page.locator("iframe").evaluate(
    (iframe, html) => {
      (iframe as HTMLIFrameElement).srcdoc = html;
    },
    await readFile(previewPath, "utf8"),
  );
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("h1")).toContainText("Comece a gerar vendas");
  await frame.locator(".hero-action .button").click();
  await expect(frame.getByLabel("Nome", { exact: true })).toBeInViewport();
  expect(errors).toEqual([]);
});
