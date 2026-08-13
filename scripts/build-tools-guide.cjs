#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

let marked;
try {
  ({ marked } = require('marked'));
} catch {
  console.error('Missing dependency: install `marked` or provide it through NODE_PATH.');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const inputPath = path.join(root, 'TBILISI-FPV-TOOLS-BUYING-GUIDE.md');
const outputPath = path.join(root, 'tbilisi-fpv-tools-buying-guide.html');
const markdown = fs.readFileSync(inputPath, 'utf8');

const slugCounts = new Map();
const slugify = (value) => {
  const base = value
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
  const count = slugCounts.get(base) || 0;
  slugCounts.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
};

const headings = [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => ({
  level: match[1].length,
  label: match[2].replace(/[`*_]/g, '').trim(),
  id: slugify(match[2]),
}));

let headingIndex = 0;
let content = marked.parse(markdown, { gfm: true });
content = content.replace(/<h1>.*?<\/h1>\s*/s, '');
content = content.replace(/<h([23])>(.*?)<\/h\1>/gs, (_match, level, inner) => {
  const heading = headings[headingIndex++];
  return `<h${level} id="${heading.id}">${inner}<a class="heading-link" href="#${heading.id}" aria-label="Link to this section">#</a></h${level}>`;
});
content = content
  .replace(/<table>/g, '<div class="table-wrap"><table>')
  .replace(/<\/table>/g, '</table></div>')
  .replace(/<a href="(https?:\/\/[^\"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');

const toc = headings
  .filter((heading) => heading.level === 2)
  .map((heading) => `<a href="#${heading.id}">${heading.label}</a>`)
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="A researched, phased FPV workshop and solder-learning tool buying guide for Tbilisi, Georgia.">
  <meta name="theme-color" content="#18231f">
  <title>Tbilisi FPV Tool Buying Guide</title>
  <style>
    :root{--paper:#f4f0e7;--paper-2:#e9e1d3;--panel:#fffdf8;--ink:#18201d;--muted:#65706a;--line:#d5cdc0;--accent:#c8512c;--green:#174f46;--safe:#246b54;--warn:#9b5d12;--danger:#9a372c;--shadow:0 18px 54px rgba(31,38,34,.11);--radius:18px}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.65 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:var(--green);text-underline-offset:3px}a:focus-visible{outline:3px solid #e99b6c;outline-offset:3px}.topbar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:13px clamp(18px,4vw,58px);background:#18231ff2;color:#fff;border-bottom:1px solid #ffffff20;backdrop-filter:blur(14px)}.brand{color:#fff;text-decoration:none;font-size:13px;font-weight:850;letter-spacing:.08em}.toplinks{display:flex;gap:8px;flex-wrap:wrap}.toplinks a{color:#e9efec;text-decoration:none;border:1px solid #52615b;border-radius:9px;padding:7px 10px;font-size:12px}.toplinks a:hover{background:#27352f}.hero{padding:clamp(64px,9vw,118px) clamp(20px,7vw,100px) 68px;background:#1e2b26;color:#fff;overflow:hidden;position:relative}.hero:after{content:"";position:absolute;width:520px;height:520px;border-radius:50%;right:-170px;top:-260px;border:85px solid #c8512c22}.eyebrow{margin:0 0 14px;color:#e98b66;font-size:12px;font-weight:850;letter-spacing:.14em;text-transform:uppercase}.hero h1{max-width:900px;margin:0;font:500 clamp(44px,7vw,82px)/.98 Georgia,"Times New Roman",serif;letter-spacing:-.045em}.hero .lede{max-width:760px;color:#c9d4cf;font-size:clamp(17px,2vw,21px);margin:26px 0 34px}.metrics{display:grid;grid-template-columns:repeat(3,minmax(150px,220px));gap:10px}.metric{padding:16px 17px;border:1px solid #52615b;border-radius:13px;background:#ffffff08}.metric strong{display:block;color:#fff;font:500 28px/1 Georgia,serif}.metric span{display:block;color:#aebcb5;font-size:11px;margin-top:7px}.layout{display:grid;grid-template-columns:260px minmax(0,880px);gap:60px;max-width:1260px;margin:0 auto;padding:55px 28px 100px}.toc{position:sticky;top:82px;align-self:start;max-height:calc(100vh - 105px);overflow:auto;padding-right:16px}.toc strong{display:block;margin-bottom:12px;color:var(--accent);font-size:11px;letter-spacing:.1em;text-transform:uppercase}.toc a{display:block;padding:7px 0;color:#53605a;text-decoration:none;border-bottom:1px solid #ddd5c8;font-size:12px;line-height:1.35}.toc a:hover{color:var(--accent)}main{min-width:0}main>p:first-child{font-size:18px;color:#43504a}.notice{padding:18px 20px;margin:0 0 32px;border-left:4px solid var(--accent);border-radius:0 12px 12px 0;background:#f5e7de}.notice strong{display:block;margin-bottom:3px}.prose h2{font:500 clamp(30px,4vw,46px)/1.1 Georgia,"Times New Roman",serif;letter-spacing:-.025em;margin:72px 0 18px;padding-top:4px}.prose h3{font-size:21px;line-height:1.25;margin:36px 0 10px}.heading-link{opacity:0;margin-left:9px;text-decoration:none;font:600 16px/1 ui-sans-serif,system-ui;color:var(--accent)}h2:hover .heading-link,h3:hover .heading-link,.heading-link:focus{opacity:1}.prose p{margin:12px 0}.prose blockquote{margin:20px 0;padding:17px 20px;border-left:4px solid var(--green);background:#e5ede9;border-radius:0 12px 12px 0}.prose blockquote p{margin:0}.prose ul,.prose ol{padding-left:24px}.prose li{margin:6px 0}.prose code{font-size:.88em;background:#e8e1d6;border-radius:5px;padding:2px 5px}.table-wrap{overflow:auto;margin:20px 0 32px;border:1px solid var(--line);border-radius:14px;background:var(--panel);box-shadow:0 6px 24px rgba(31,38,34,.04)}table{width:100%;border-collapse:collapse;min-width:720px}th,td{text-align:left;vertical-align:top;padding:13px 14px;border-bottom:1px solid var(--line);font-size:12px}th{position:sticky;top:0;background:#26342e;color:#fff;font-size:10px;letter-spacing:.055em;text-transform:uppercase}tr:last-child td{border-bottom:0}tbody tr:hover{background:#faf5ec}td:first-child{font-weight:700}.prose input[type=checkbox]{width:16px;height:16px;vertical-align:-2px;margin-right:7px;accent-color:var(--green)}.prose hr{border:0;border-top:1px solid var(--line);margin:46px 0}.page-footer{padding:32px clamp(20px,7vw,100px);background:#18231f;color:#aebcb5;font-size:12px}.page-footer a{color:#fff}.back-top{display:inline-block;margin-top:20px;font-weight:750}.mobile-toc{display:none;width:100%;border:1px solid var(--line);background:var(--panel);padding:12px;border-radius:10px;color:var(--ink)}@media(max-width:900px){.layout{grid-template-columns:1fr;gap:20px}.toc{position:static;max-height:none;padding:0}.toc strong,.toc a{display:none}.mobile-toc{display:block}.metrics{grid-template-columns:1fr}.hero:after{opacity:.5}}@media(max-width:620px){.topbar{align-items:flex-start}.toplinks a:first-child{display:none}.hero{padding-top:54px}.layout{padding:34px 16px 72px}.prose h2{margin-top:58px}.table-wrap{border-radius:10px}th,td{padding:11px 12px}.heading-link{opacity:1}}
  </style>
</head>
<body id="top">
  <header class="topbar">
    <a class="brand" href="index.html">DRONE ANATOMY</a>
    <nav class="toplinks" aria-label="Site navigation">
      <a href="index.html">All guides</a>
      <a href="drone-engineering-manufacturing-course.html">Engineering course</a>
    </nav>
  </header>
  <section class="hero">
    <p class="eyebrow">Local purchasing plan · Checked 12 August 2026</p>
    <h1>Tbilisi FPV Tool Buying Guide</h1>
    <p class="lede">A complete, phased workshop setup for learning soldering, assembling safely, checking first power, and measuring the prototype—without quietly mixing drone parts into the tool budget.</p>
    <div class="metrics" aria-label="Guide totals">
      <div class="metric"><strong>₾1,148</strong><span>Immediate solder-learning workshop</span></div>
      <div class="metric"><strong>₾1,336.50</strong><span>Known total through assembly-ready</span></div>
      <div class="metric"><strong>3 gaps</strong><span>Explicit local sourcing stop-points</span></div>
    </div>
  </section>
  <div class="layout">
    <aside class="toc" aria-label="Guide contents">
      <strong>Contents</strong>
      <select class="mobile-toc" aria-label="Jump to section" onchange="if(this.value) location.hash=this.value">
        <option value="">Jump to a section…</option>
        ${headings.filter((heading) => heading.level === 2).map((heading) => `<option value="#${heading.id}">${heading.label}</option>`).join('\n')}
      </select>
      ${toc}
    </aside>
    <main class="prose">
      <div class="notice"><strong>Stock is a snapshot, not a reservation.</strong>Call before travelling. A smoke stopper/current limiter remains a hard stop before first aircraft power.</div>
      ${content}
      <a class="back-top" href="#top">Back to top ↑</a>
    </main>
  </div>
  <footer class="page-footer">Source edition: <a href="TBILISI-FPV-TOOLS-BUYING-GUIDE.md">Markdown buying guide</a>. Local retail stock does not prove availability at manufacturing scale.</footer>
</body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log(`Built ${path.relative(root, outputPath)}`);
