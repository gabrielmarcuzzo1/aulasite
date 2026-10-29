# Agência V3

Landing page em português, com a copy fornecida para a Agência V3 e direção visual monocromática: malha vetorial abstrata, iluminação suave, cards em grafite e animações com Motion for React.

## Desenvolvimento

Requer Node.js 22.12+ ou 24 LTS e npm. O ambiente atual usa Node.js 24.

```bash
cd /workspace/aulasite
npm ci --cache /tmp/aulasite-npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

Use o checkout existente. As tarefas na nuvem já são isoladas; não crie um Git worktree adicional.

## Build e validação

```bash
npm run build
npm test
```

O build executa a verificação de tipos e produz a pasta `dist/`, que pode ser publicada em qualquer hospedagem de arquivos estáticos. Para verificar o build localmente, use `npm run preview -- --port 4175`.

Os testes Playwright cobrem a ordem das seções, CTAs, navegação mobile, FAQ por teclado, validação do formulário, estados de erro e sucesso de uma integração simulada, seis larguras de tela e verificação automática de acessibilidade com axe. Usam o Chromium de `/usr/bin/chromium` quando disponível; em outra máquina, execute `npx playwright install chromium` ou defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Formulário: integração pendente

Conforme solicitado, nenhum CRM, serviço de envio ou calendário está conectado. Sem configuração, a página informa que o agendamento online estará disponível em breve e permite abrir uma mensagem no aplicativo de e-mail. Isso não envia os dados automaticamente nem confirma um horário. Os campos não são persistidos no navegador.

Para conectar depois:

1. Copie `.env.example` para `.env.local`.
2. Defina `VITE_LEAD_ENDPOINT` com a URL pública HTTPS do endpoint ou um caminho relativo como `/api/leads`.
3. Reinicie o servidor ou refaça o build.

O endpoint recebe um `POST` com `Content-Type: application/json`:

```json
{
  "name": "Nome do contato",
  "email": "contato@empresa.com.br",
  "phone": "(11) 99999-9999",
  "company": "Empresa"
}
```

Uma resposta HTTP 2xx confirma o recebimento. Falhas e timeout exibem uma mensagem de erro, preservando os campos para nova tentativa. Um endpoint em outro domínio precisa permitir CORS para o domínio da landing page. Faça a validação e a proteção contra abuso também no servidor ao implementar essa integração. Tokens de CRM devem ficar no servidor: variáveis `VITE_*` são públicas no bundle.

O telefone `(00) 00000-0000` foi mantido conforme a copy e precisa ser atualizado antes da divulgação. Não há botão de WhatsApp com esse número fictício.

## Organização

- `src/App.tsx`: seções e textos, na ordem da copy.
- `src/components/`: navegação, componentes visuais, animações e formulário.
- `src/styles.css`: tokens, layout, estados de interação e responsividade.
- `tests/landing.spec.ts`: testes de navegador.

A fonte Geist é servida localmente. A malha da hero é SVG gerado em código, sem imagem da referência ou dependência de WebGL. As animações respeitam `prefers-reduced-motion`, e as seções permanecem visíveis caso a animação de entrada não seja acionada.
