import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function fillForm(page: Page) {
  await page.getByLabel("Nome", { exact: true }).fill("Pessoa de Teste");
  await page.getByLabel("E-mail profissional").fill("pessoa@example.com");
  await page.getByLabel("WhatsApp").fill("(11) 99999-1234");
  await page.getByLabel("Empresa", { exact: true }).fill("Empresa de Teste");
}

test("preserva a headline e a sequência das seções da copy", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Pare de gerar curiosos. Comece a gerar vendas para o seu negócio.",
  );
  const headings = await page.locator("h2").allInnerTexts();
  expect(headings.map((text) => text.replace(/\s+/g, " ").trim())).toEqual([
    "Empresas que já crescem com a gente",
    "Você investe em marketing, mas os leads não vendem?",
    "Marketing feito com cabeça de vendas",
    "O que fazemos pela sua empresa",
    "Como funciona",
    "Resultados que aparecem no caixa",
    "O que nossos clientes dizem",
    "Por que a Agência V3",
    "Para quem é",
    "Perguntas frequentes",
    "Vamos transformar marketing em reuniões de vendas?",
  ]);
  await expect(
    page.getByText(
      "Os resultados variam de acordo com o mercado, a oferta e o investimento.",
    ),
  ).toBeVisible();
});

test("os CTAs navegam para o formulário", async ({ page }) => {
  await page.goto("/");
  await page.locator(".hero-action .button").click();
  await expect(page).toHaveURL(/#diagnostico$/);
  await expect(page.getByLabel("Nome", { exact: true })).toBeInViewport();
});

test("menu mobile abre, fecha com Escape e navega para a seção", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Navegação mobile" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Navegação mobile" })
    .getByRole("link", { name: "Resultados", exact: true })
    .click();
  await expect(page).toHaveURL(/#resultados$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("perguntas frequentes expandem por teclado", async ({ page }) => {
  await page.goto("/#perguntas");
  const summary = page
    .locator("summary")
    .filter({ hasText: "Tem contrato de fidelidade?" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      "O contrato inicial é de 3 meses. Depois disso, a renovação é mensal.",
    ),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      "O contrato inicial é de 3 meses. Depois disso, a renovação é mensal.",
    ),
  ).toBeHidden();
});

test("formulário valida dados e informa o estado da integração pendente", async ({
  page,
}) => {
  await page.goto("/#diagnostico");
  const submit = page.getByRole("button", {
    name: "Quero agendar meu diagnóstico",
  });
  await submit.click();
  await expect(page.getByLabel("Nome", { exact: true })).toBeFocused();
  await expect(page.getByRole("status")).toHaveCount(0);
  await fillForm(page);
  await page.getByLabel("WhatsApp").fill("() --- ....");
  await submit.click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByLabel("WhatsApp")).toBeFocused();
  await page.getByLabel("WhatsApp").fill("(11) 99999-1234");
  await submit.click();
  await expect(page.getByRole("status")).toContainText(
    "Agendamento online em breve.",
  );
  await expect(page.getByRole("status")).toBeFocused();
  const href = await page
    .getByRole("link", { name: "Abrir e-mail" })
    .getAttribute("href");
  expect(href).toContain("mailto:contato@agenciav3.com.br?");
  expect(decodeURIComponent(href!)).toContain("Empresa: Empresa de Teste");
  await page.getByRole("button", { name: "Editar meus dados" }).click();
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue(
    "Pessoa de Teste",
  );
  await expect(page.getByLabel("Nome", { exact: true })).toBeFocused();
});

test("integração configurada envia JSON e só confirma após a resposta", async ({
  page,
}) => {
  let submitted: unknown;
  await page.route("**/api/leads", async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  await page.goto("http://127.0.0.1:4174/#diagnostico");
  await fillForm(page);
  await page
    .getByRole("button", { name: "Quero agendar meu diagnóstico" })
    .click();
  await expect(page.getByRole("status")).toContainText("Recebemos seu pedido.");
  expect(submitted).toEqual({
    name: "Pessoa de Teste",
    email: "pessoa@example.com",
    phone: "(11) 99999-1234",
    company: "Empresa de Teste",
  });
});

test("falha do endpoint preserva os dados e permite nova tentativa", async ({
  page,
}) => {
  await page.route("**/api/leads", (route) => route.fulfill({ status: 503 }));
  await page.goto("http://127.0.0.1:4174/#diagnostico");
  await fillForm(page);
  const submit = page.getByRole("button", {
    name: "Quero agendar meu diagnóstico",
  });
  await submit.click();
  await expect(page.getByRole("alert")).toContainText(
    "Não foi possível enviar agora.",
  );
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByLabel("E-mail profissional")).toHaveValue(
    "pessoa@example.com",
  );
  await page.route("**/api/leads", (route) =>
    route.fulfill({ status: 200, body: "{}" }),
  );
  await submit.click();
  await expect(page.getByRole("status")).toContainText("Recebemos seu pedido.");
});

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test(`layout sem overflow horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const selector of [".service-card", ".result-card", ".form-card"]) {
      const boxes = await page.locator(selector).evaluateAll((elements) =>
        elements.map((element) => {
          const { left, right } = element.getBoundingClientRect();
          const paragraph = element.querySelector("p")!.getBoundingClientRect();
          return {
            left,
            right,
            clipped:
              paragraph.bottom > element.getBoundingClientRect().bottom - 15,
          };
        }),
      );
      for (const box of boxes) {
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(width);
        expect(box.clipped).toBe(false);
      }
    }
  });
}

test("não há erros de JavaScript ou recursos locais com falha", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await page.getByLabel("WhatsApp").fill("(11) 99999-1234");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  await expect(page.locator("h1")).toHaveCSS("filter", "blur(0px)");
  expect(errors).toEqual([]);
});

for (const width of [390, 1440]) {
  test(`acessibilidade automática WCAG AA em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

test.describe("animações habilitadas", () => {
  test.use({ reducedMotion: "no-preference" });

  test("a entrada da hero e os reveals terminam com o conteúdo legível", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".hero-action")).toHaveCSS("filter", "blur(0px)");
    await expect(page.locator(".hero-action")).toHaveCSS("opacity", "1");
    await page.locator("#solucoes").scrollIntoViewIfNeeded();
    for (const card of await page.locator(".service-grid > div").all()) {
      await expect(card).toHaveCSS("opacity", "1");
      await expect(card).toHaveCSS("filter", "blur(0px)");
    }
  });
});
