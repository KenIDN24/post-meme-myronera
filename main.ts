// Entry for u-myronera-post-the-meme-win-the-feed-2de960bf ("Post the Meme, Win the Feed").
// The post itself is the entry: this program copies POST.json from the repository
// root to /output/POST.json, where the house gate reads the post address and fetches
// its counts from X via FxTwitter. It also validates that POST.json parses and names
// an x.com / twitter.com status URL before copying.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const raw = readFileSync(join(botDir, 'POST.json'), 'utf8');
const post = JSON.parse(raw) as { url?: unknown };
if (
  typeof post.url !== 'string' ||
  !/^https:\/\/(www\.|mobile\.)?(x|twitter)\.com\/[^/]+\/status\/\d+/.test(post.url)
) {
  throw new Error(`POST.json does not name an X status URL: ${String(post.url)}`);
}

// Normalise the address before handing it in: the rules read past any query or
// fragment, so strip them here — the gate then always sees the canonical post URL.
const clean = new URL(post.url);
const canonical = `${clean.origin}${clean.pathname}`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), JSON.stringify({ url: canonical }), 'utf8');
console.log(`POST.json copied: ${canonical}`);
