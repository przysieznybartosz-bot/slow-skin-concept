import fs from "fs";
import path from "path";
import { ARTICLES } from "../src/data";

const SITE_ORIGIN = "https://slow-skin-concept.pl";

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getJpegDimensions(filePath: string): { width: number; height: number } | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const buf = fs.readFileSync(filePath);
    if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
    let offset = 2;
    while (offset + 4 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      offset += 2;
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        continue;
      }
      if (offset + 2 > buf.length) break;
      const segLength = buf.readUInt16BE(offset);
      if (
        marker === 0xc0 ||
        marker === 0xc1 ||
        marker === 0xc2 ||
        marker === 0xc3 ||
        marker === 0xc5 ||
        marker === 0xc6 ||
        marker === 0xc7 ||
        marker === 0xc9 ||
        marker === 0xca ||
        marker === 0xcb ||
        marker === 0xcd ||
        marker === 0xce ||
        marker === 0xcf
      ) {
        if (offset + 7 <= buf.length) {
          const height = buf.readUInt16BE(offset + 3);
          const width = buf.readUInt16BE(offset + 5);
          return { width, height };
        }
      }
      offset += segLength;
    }
  } catch {
    return null;
  }
  return null;
}

function replaceMetaProperty(html: string, property: string, newContent: string): string {
  const safe = escapeHtmlAttr(newContent);
  const regex = new RegExp(`(<meta\\s+property="${property}"\\s+content=")[^"]*("\\s*/?>)`, "i");
  return html.replace(regex, `$1${safe}$2`);
}

function replaceMetaName(html: string, name: string, newContent: string): string {
  const safe = escapeHtmlAttr(newContent);
  const regex = new RegExp(`(<meta\\s+name="${name}"\\s+content=")[^"]*("\\s*/?>)`, "i");
  return html.replace(regex, `$1${safe}$2`);
}

function main() {
  const distDir = path.join(process.cwd(), "dist");
  const baseIndexPath = path.join(distDir, "index.html");

  if (!fs.existsSync(baseIndexPath)) {
    throw new Error(`Missing ${baseIndexPath}. Run vite build first.`);
  }

  const baseHtml = fs.readFileSync(baseIndexPath, "utf-8");
  const outDir = path.join(distDir, "artykuly");
  fs.mkdirSync(outDir, { recursive: true });

  for (const article of ARTICLES) {
    const canonicalUrl = `${SITE_ORIGIN}/artykuly/${article.id}`;
    const pageTitle = `${article.title} | Magazyn Wiedzy Bionomicznej Slow Skin Concept`;
    const rawDesc = `${article.lead || article.title} — ${article.author}, Instytut Zdrowej Skóry Slow Skin Concept.`;
    const pageDesc = rawDesc.length > 260 ? `${rawDesc.slice(0, 257).trim()}...` : rawDesc;

    let imageRel = article.image || "/og-termolifting-rf-1200x630.jpg";
    if (imageRel.endsWith(".webp")) {
      const jpgCandidate = imageRel.replace(/\.webp$/i, ".jpg");
      if (fs.existsSync(path.join(process.cwd(), jpgCandidate.replace(/^\//, "")))) {
        imageRel = jpgCandidate;
      }
    }
    const ogImage = imageRel.startsWith("http") ? imageRel : `${SITE_ORIGIN}${imageRel}`;
    const localImgPath = path.join(process.cwd(), imageRel.replace(/^\//, ""));
    const dims = getJpegDimensions(localImgPath);
    const width = dims ? String(dims.width) : "1376";
    const height = dims ? String(dims.height) : "768";
    const imageType = imageRel.endsWith(".png")
      ? "image/png"
      : imageRel.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

    let html = baseHtml;

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlText(pageTitle)}</title>`);
    html = replaceMetaName(html, "description", pageDesc);
    html = html.replace(
      /(<link\s+rel="canonical"\s+id="canonical-url"\s+href=")[^"]*("\s*\/?>)/i,
      `$1${escapeHtmlAttr(canonicalUrl)}$2`
    );

    html = replaceMetaProperty(html, "og:type", "article");
    html = replaceMetaProperty(html, "og:url", canonicalUrl);
    html = replaceMetaProperty(html, "og:title", pageTitle);
    html = replaceMetaProperty(html, "og:description", pageDesc);
    html = replaceMetaProperty(html, "og:image", ogImage);
    html = replaceMetaProperty(html, "og:image:secure_url", ogImage);
    html = replaceMetaProperty(html, "og:image:type", imageType);
    html = replaceMetaProperty(html, "og:image:width", width);
    html = replaceMetaProperty(html, "og:image:height", height);
    html = replaceMetaProperty(html, "og:image:alt", article.title);

    html = replaceMetaName(html, "twitter:url", canonicalUrl);
    html = replaceMetaName(html, "twitter:title", pageTitle);
    html = replaceMetaName(html, "twitter:description", pageDesc);
    html = replaceMetaName(html, "twitter:image", ogImage);

    const outPath = path.join(outDir, `${article.id}.html`);
    fs.writeFileSync(outPath, html, "utf-8");
  }

  console.log(`[generate-article-pages] Generated ${ARTICLES.length} static article HTML pages in dist/artykuly/`);
}

main();
