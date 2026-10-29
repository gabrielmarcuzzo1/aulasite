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

## Publicação na Vercel

`vercel.json` configura `npm ci`, `npm run build` e a saída `dist/`. O projeto da Vercel precisa usar este repositório, a branch `main` e a raiz do checkout. O HTML é revalidado a cada acesso; os recursos com hash continuam usando o cache da plataforma.

Cada build da Vercel inclui uma meta tag `v3-build` com os 12 primeiros caracteres de `VERCEL_GIT_COMMIT_SHA`, permitindo identificar qual commit foi publicado. Builds locais usam o identificador `local`.

Depois do deploy, é possível executar o teste de produção contra o endereço público:

```bash
PUBLISHED_SITE_URL=https://aulasite-mu.vercel.app/ npm test -- tests/production.spec.ts
```

Esse teste verifica o carregamento dos assets compilados, a inicialização da rolagem e a entrada de um card na tela. O ambiente que executa o teste precisa ter acesso de rede ao endereço publicado.

## Prévia sem servidor

Abra `preview.html` para visualizar a landing page diretamente no navegador ou em um visualizador de HTML com JavaScript permitido. Esse arquivo incorpora o JavaScript compilado, o CSS, as fontes e o ícone; não depende do Vite nem de caminhos locais de recursos.

O `index.html` da raiz é a entrada de desenvolvimento do Vite e precisa do servidor para transformar o TypeScript e resolver os módulos. Para a prévia de arquivo, use `preview.html`.

O comando `npm run build` regenera `preview.html` a partir do código atual. O arquivo fica versionado para permitir a visualização logo após clonar o repositório. Edite os arquivos de `src/` e regenere o build, em vez de editar esse HTML gerado manualmente.

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
- `src/components/SmoothScroll.tsx`: rolagem com inércia via Lenis e navegação por âncoras, inclusive na prévia isolada.
- `src/styles.css`: tokens, layout, estados de interação e responsividade.
- `tests/landing.spec.ts`: testes de navegador.

A fonte Geist é servida localmente. A malha da hero é SVG gerado em código, sem imagem da referência ou dependência de WebGL. Títulos e blocos entram uma vez ao chegar à tela, com fade, deslocamento e redução de blur; os grupos usam entradas escalonadas. A rolagem por mouse/trackpad desacelera com Lenis; o toque usa a inércia nativa do dispositivo. Conforme a direção de experiência solicitada, as animações e a inércia iniciam automaticamente, inclusive quando o sistema informa `prefers-reduced-motion`; não há controle de ativação. Sem suporte a IntersectionObserver, os blocos ficam visíveis.
