import { readFile, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const mimeTypes = {
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
};

function assetPath(url, parent = dist) {
  if (/^(?:[a-z]+:|\/\/)/i.test(url)) {
    throw new Error(`A prévia precisa de um recurso externo: ${url}`);
  }
  const path = resolve(
    url.startsWith("/") ? dist : parent,
    url.replace(/^\//, ""),
  );
  const pathFromDist = relative(dist, path);
  if (pathFromDist === ".." || pathFromDist.startsWith(`..${sep}`)) {
    throw new Error("O recurso da prévia está fora do diretório de build.");
  }
  return path;
}

async function dataUrl(path) {
  const mime = mimeTypes[extname(path)];
  if (!mime)
    throw new Error(`Tipo de recurso não suportado na prévia: ${path}`);
  return `data:${mime};base64,${(await readFile(path)).toString("base64")}`;
}

async function replaceAsync(input, pattern, replace) {
  const matches = [...input.matchAll(pattern)];
  const replacements = await Promise.all(matches.map(replace));
  let index = 0;
  return input.replace(pattern, () => replacements[index++]);
}

let html = await readFile(resolve(dist, "index.html"), "utf8");

html = await replaceAsync(
  html,
  /<link\b[^>]*rel="stylesheet"[^>]*>/g,
  async ([tag]) => {
    const url = tag.match(/href="([^"]+)"/)?.[1];
    if (!url) throw new Error("Folha de estilo sem URL no build.");
    const path = assetPath(url);
    let css = await readFile(path, "utf8");
    css = await replaceAsync(
      css,
      /url\(([^)]+)\)/g,
      async ([original, value]) => {
        const url = value.trim().replace(/^["']|["']$/g, "");
        if (/^(?:data:|#)/i.test(url)) return original;
        return `url("${await dataUrl(assetPath(url, dirname(path)))}")`;
      },
    );
    return `<style>${css.replace(/<\/style/gi, "<\\/style")}</style>`;
  },
);

html = await replaceAsync(
  html,
  /<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,
  async ([, url]) => {
    const javascript = await readFile(assetPath(url), "utf8");
    return `<script type="module">${javascript.replace(/<\/script/gi, "<\\/script")}</script>`;
  },
);

html = await replaceAsync(
  html,
  /<link\b[^>]*rel="icon"[^>]*>/g,
  async ([tag]) => {
    const url = tag.match(/href="([^"]+)"/)?.[1];
    if (!url) throw new Error("Ícone sem URL no build.");
    return tag.replace(url, await dataUrl(assetPath(url)));
  },
);

const output = resolve(root, "preview.html");
await writeFile(
  output,
  `<!-- Gerado por npm run build. Edite src/, não este arquivo. -->\n${html}`,
);
console.log(
  `Prévia independente: preview.html (${Math.ceil(Buffer.byteLength(html) / 1024)} kB)`,
);
