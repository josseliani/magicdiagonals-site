#!/usr/bin/env python3
"""Builds the weekly NASDAQ review pages from tools/reviews/*.txt.

Review file format (plain text):
  title: ...
  slug: nasdaq-2026-11-16-20
  dates: November 16–20, 2026
  date: 2026-11-22                (publication date, ISO)
  result: +7.2R
  tv: https://www.tradingview.com/chart/...
  cover: img/....jpg
  summary: one-line teaser for the archive and search engines
  ---
  Body. Blank line = new paragraph.
  ## Heading            -> section heading
  ### Day title | img/day.jpg   -> day block with its card image
  - item                -> list item
  > note                -> small grey note
"""
import html, re, pathlib, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'tools' / 'reviews'
OUT = ROOT / 'reviews'
TV_INDICATOR = 'https://www.tradingview.com/script/oN62W2RT-NASDAQ-Pre-Market-Range-Sweep-josseliani/'

CSS = """
*{box-sizing:border-box}body{margin:0;background:#0c1110;color:#f0f0e9;font:17px/1.7 Arial,sans-serif;--accent:#d9bc78;--muted:#a5afa9}
a{color:inherit;text-decoration:none}img{max-width:100%;display:block}
header{height:72px;border-bottom:1px solid #303a34;display:flex;align-items:center;justify-content:space-between;padding:0 5%;gap:16px}
.brand{font-size:12px;letter-spacing:3px;font-weight:bold;line-height:1.4}
.nav{display:flex;gap:22px;font-size:13px;color:#d6dbd7}
.outline,.button{display:inline-flex;padding:11px 19px;border:1px solid #657060;align-items:center;justify-content:center;font-size:14px;white-space:nowrap}
.button{background:var(--accent);color:#101715;border-color:var(--accent);font-weight:bold}
main{max-width:780px;margin:0 auto;padding:46px 22px 30px}
.eyebrow{color:var(--accent);letter-spacing:2.3px;text-transform:uppercase;font-size:11px;margin:0 0 14px}
h1{font-weight:400;font-size:clamp(30px,5vw,46px);letter-spacing:-1.2px;line-height:1.12;margin:0 0 14px}
h1 em,h2 em{font-family:Georgia,serif;color:var(--accent)}
.meta{color:var(--muted);font-size:14px;margin-bottom:26px;display:flex;flex-wrap:wrap;gap:6px 16px}
.result{color:var(--accent);font-weight:bold}
h2{font-weight:400;font-size:27px;letter-spacing:-.5px;margin:44px 0 12px;line-height:1.25}
h3{font-size:19px;margin:0 0 8px;color:var(--accent);letter-spacing:.3px}
p{margin:0 0 16px;color:#dfe4e0}ul{margin:0 0 18px;padding-left:22px;color:#dfe4e0}li{margin:4px 0}
.note{font-size:13.5px;color:var(--muted);border-left:2px solid #3a463f;padding-left:12px}
figure{margin:22px 0 26px}figure img{border-radius:14px;border:1px solid #2c3430;width:100%}
.day{border-top:1px solid #2c3430;padding-top:30px;margin-top:34px}
.day-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:26px;align-items:start}
.day-grid figure{margin:4px 0 0}
@media(max-width:760px){.day-grid{grid-template-columns:1fr}.nav{display:none}}
.cta{margin:46px 0 10px;padding:26px;border:1px solid #2f3b35;border-radius:18px;background:#121816}
.cta h2{margin-top:0;font-size:24px}.cta-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.more{margin-top:40px}.more a{display:block;padding:14px 0;border-top:1px solid #2c3430}.more a:hover{color:var(--accent)}
.card{display:grid;grid-template-columns:150px 1fr;gap:20px;padding:22px 0;border-top:1px solid #2c3430;align-items:center}
.card img{border-radius:10px;border:1px solid #2c3430}.card h3{color:#f0f0e9;font-size:18px;margin:0 0 6px}
.card p{font-size:15px;color:var(--muted);margin:0}.card:hover h3{color:var(--accent)}
@media(max-width:520px){.card{grid-template-columns:96px 1fr;gap:14px}}
footer{border-top:1px solid #303a34;padding:26px 5%;display:flex;flex-wrap:wrap;gap:14px 24px;justify-content:space-between;font-size:13px;color:var(--muted)}
footer div{display:flex;gap:18px;flex-wrap:wrap}
"""

def head(title, desc, url, image):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title><meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article"><meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{image}"><meta name="twitter:card" content="summary_large_image">
<style>{CSS}</style></head><body>
<header><a class="brand" href="/">MAGIC<br>DIAGONALS</a><nav class="nav"><a href="/#products">Indicators</a><a href="/reviews/">Weekly reviews</a><a href="/risk-calculator/">Risk calculator</a></nav><a class="outline" href="/#access">See plans ↓</a></header>"""

FOOT = """<footer><span>© Magic Diagonals · josseliani</span><div><a href="https://t.me/magicdiagonals">Telegram ↗︎</a><a href="https://www.instagram.com/magicdiagonals/">Instagram ↗︎</a><a href="https://www.youtube.com/@magicdiagonals" target="_blank" rel="noopener">YouTube ↗︎</a><a href="/">Main page</a></div></footer>
<script defer src="/umami-site.js"></script></body></html>"""

def inline(s):
    s = html.escape(s)
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)

def parse(path):
    raw = path.read_text(encoding='utf-8')
    meta_txt, body = raw.split('\n---\n', 1)
    meta = {}
    for line in meta_txt.strip().splitlines():
        k, v = line.split(':', 1)
        meta[k.strip()] = v.strip()
    return meta, body

def render_body(body):
    out, para, items = [], [], []
    day_open = False
    def flush():
        nonlocal para, items
        if para: out.append('<p>' + inline(' '.join(para)) + '</p>'); para = []
        if items: out.append('<ul>' + ''.join(f'<li>{inline(i)}</li>' for i in items) + '</ul>'); items = []
    def close_day():
        nonlocal day_open
        if day_open: out.append('</div>' + day_img + '</div></section>'); day_open = False
    day_img = ''
    for line in body.splitlines():
        t = line.strip()
        if not t: flush(); continue
        if t.startswith('### '):
            flush(); close_day()
            title, _, img = t[4:].partition('|')
            day_img = f'<figure><a href="img/{img.strip()}"><img loading="lazy" src="img/{img.strip()}" alt="{html.escape(title.strip())} — signal review card"></a></figure>' if img.strip() else ''
            out.append(f'<section class="day"><div class="day-grid"><div><h3>{inline(title.strip())}</h3>')
            day_open = True
        elif t.startswith('## '):
            flush(); close_day(); out.append(f'<h2>{inline(t[3:])}</h2>')
        elif t.startswith('- '):
            if para: flush()
            items.append(t[2:])
        elif t.startswith('> '):
            flush(); out.append(f'<p class="note">{inline(t[2:])}</p>')
        else:
            if items: flush()
            para.append(t)
    flush(); close_day()
    return '\n'.join(out)

def cta(tv):
    return f"""<div class="cta"><p class="eyebrow">Free indicator</p><h2>NASDAQ Pre-Market Range Sweep</h2>
<p>Range → Sweep → Return or Expansion → Structural confirmation → Target. The indicator from this review is free on TradingView.</p>
<div class="cta-row"><a class="button" href="{TV_INDICATOR}" target="_blank" rel="noopener">Get the free indicator ↗</a><a class="outline" href="{tv}" target="_blank" rel="noopener">Discuss on TradingView ↗</a><a class="outline" href="https://t.me/magicdiagonals">Telegram ↗</a></div>
<p class="note" style="margin-top:18px">Looking for more? Our Pro indicators RCC Pro and RSI Retest Pro: <a href="/#access" style="color:var(--accent)">see plans</a>.</p></div>"""

def build():
    OUT.mkdir(exist_ok=True)
    reviews = []
    for p in sorted(SRC.glob('*.txt')):
        meta, body = parse(p)
        reviews.append((meta, body))
    reviews.sort(key=lambda r: r[0]['date'], reverse=True)
    base = 'https://magicdiagonals.com/reviews/'
    for i, (m, body) in enumerate(reviews):
        url = base + m['slug'] + '.html'
        img = base + m['cover']
        d = datetime.date.fromisoformat(m['date']).strftime('%B %-d, %Y')
        others = [r for r in reviews if r[0]['slug'] != m['slug']][:4]
        more = ''.join(f'<a href="{o["slug"]}.html">{html.escape(o["dates"])} · <span class="result">{html.escape(o["result"])}</span> — {html.escape(o["title"])}</a>' for o, _ in others)
        page = head(m['title'] + ' | Magic Diagonals', m['summary'], url, img) + f"""
<main><p class="eyebrow"><a href="/reviews/">Weekly NASDAQ reviews</a> · Education</p>
<h1>{html.escape(m['title'])}</h1>
<div class="meta"><span>{html.escape(m['dates'])}</span><span>Week result: <span class="result">{html.escape(m['result'])}</span></span><span>Published {d} by josseliani</span></div>
<figure><img src="{m['cover']}" alt="Weekly result chart, {html.escape(m['dates'])}"></figure>
{render_body(body)}
{cta(m['tv'])}
{'<div class="more"><p class="eyebrow">More weekly reviews</p>' + more + '</div>' if more else ''}
</main>""" + FOOT
        (OUT / (m['slug'] + '.html')).write_text(page, encoding='utf-8')
    cards = ''.join(f'<a class="card" href="{m["slug"]}.html"><img loading="lazy" src="{m["cover"]}" alt=""><div><h3>{html.escape(m["dates"])} · <span class="result">{html.escape(m["result"])}</span></h3><p>{html.escape(m["summary"])}</p></div></a>' for m, _ in reviews)
    index = head('Weekly NASDAQ Pre-Market Range Sweep reviews | Magic Diagonals',
                 'Every week we review how the free NASDAQ Pre-Market Range Sweep indicator performed: every signal, stop and target, counted honestly in R.',
                 base, base + reviews[0][0]['cover'] if reviews else '') + f"""
<main><p class="eyebrow">Education · Weekly reviews</p><h1>NASDAQ Pre-Market Range Sweep: <em>weekly reviews</em></h1>
<p>Every week we go through the real signals of the free NASDAQ Pre-Market Range Sweep indicator: which setups worked, which hit the stop, which ones we don't count and why. Results are given in R (risk units).</p>
{cards}{cta('https://www.tradingview.com/u/josseliani/')}</main>""" + FOOT
    (OUT / 'index.html').write_text(index, encoding='utf-8')
    # sitemap
    urls = ['/', '/ru.html', '/de.html', '/es.html', '/ja.html', '/zh.html', '/risk-calculator/', '/reviews/'] + [f'/reviews/{m["slug"]}.html' for m, _ in reviews]
    today = datetime.date.today().isoformat()
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>https://magicdiagonals.com{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n'
    (ROOT / 'sitemap.xml').write_text(sm, encoding='utf-8')
    print('built', len(reviews), 'reviews')

if __name__ == '__main__':
    build()
