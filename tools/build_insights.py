#!/usr/bin/env python3
"""Builds /insights (index) and insights/<slug>.html from tools/insights/*.md.
Each .md has a front matter block (title, slug, description, date, read) and a small
markdown body (## headings, paragraphs, - and 1. lists, tables, **bold**, [links](url)).
Run from the repo root:  python3 tools/build_insights.py   then   python3 tools/build_roles.py
(build_roles.py refreshes sitemap.xml and includes the insights pages)."""
import re, json, html, os, glob
BASE = "https://sferapeople.com"
src = open("searches.html").read()
head = src[:src.index("</head>")]
body_open = src[src.index("</head>"):src.index('  <section style="position: relative; padding: 48px 24px 112px')]
foot = src[src.index("  <footer"):src.index("</footer>") + len("</footer>")]

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", lambda m: '<a href="%s"%s>%s</a>' % (
        m.group(2), ' target="_blank" rel="noopener"' if m.group(2).startswith("http") else "", m.group(1)), t)
    return t

def render(md):
    out, lines, i = [], md.strip().split("\n"), 0
    while i < len(lines):
        ln = lines[i].rstrip()
        if not ln: i += 1; continue
        if ln.startswith("### "):
            out.append("<h3>%s</h3>" % inline(ln[4:])); i += 1
        elif ln.startswith("## "):
            out.append("<h2>%s</h2>" % inline(ln[3:])); i += 1
        elif ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            hdr, body = rows[0], [r for r in rows[2:]]
            out.append('<div class="tw"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>' % (
                "".join("<th>%s</th>" % inline(c) for c in hdr),
                "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % inline(c) for c in r) for r in body)))
        elif ln.startswith("- ") or re.match(r"\d+\. ", ln):
            tag = "ul" if ln.startswith("- ") else "ol"
            items = []
            while i < len(lines) and (lines[i].startswith("- ") or re.match(r"\d+\. ", lines[i])):
                items.append(re.sub(r"^(- |\d+\. )", "", lines[i].rstrip())); i += 1
            out.append("<%s>%s</%s>" % (tag, "".join("<li>%s</li>" % inline(x) for x in items), tag))
        else:
            para = [ln]; i += 1
            while i < len(lines) and lines[i].strip() and not re.match(r"(### |## |\||- |\d+\. )", lines[i]):
                para.append(lines[i].rstrip()); i += 1
            out.append("<p>%s</p>" % inline(" ".join(para)))
    return "\n".join(out)

def parse(path):
    raw = open(path).read()
    _, fm, body = raw.split("---\n", 2)
    meta = dict(l.split(": ", 1) for l in fm.strip().split("\n"))
    return meta, body

def set_head(h, title, desc, url, og_type):
    h = h.replace("sfera | Open searches", html.escape(title, quote=True))
    a = h.index('<meta name="description" content="') + len('<meta name="description" content="')
    h = h[:a] + html.escape(desc, quote=True) + h[h.index('"', a):]
    h = h.replace('<meta property="og:description" content="Roles we are hiring for right now.">',
                  '<meta property="og:description" content="%s">' % html.escape(desc, quote=True))
    h = h.replace('content="website"', 'content="%s"' % og_type)
    h = h.replace("https://sferapeople.com/searches", url)
    return h.replace('<link rel="icon"', '<link rel="canonical" href="%s">\n<link rel="icon"' % url, 1)

STYLE = '''<style>
.art{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
.art h1{margin:0;font-size:clamp(32px,4.4vw,48px);line-height:1.08;font-weight:500;letter-spacing:-.04em}
.art h2{margin:26px 0 0;font-size:22px;line-height:30px;font-weight:600;letter-spacing:-.02em}
.art h3{margin:14px 0 0;font-size:18px;line-height:26px;font-weight:600;letter-spacing:-.01em}
.art p,.art li{font-size:17px;line-height:28px;color:#3a3560;margin:0}
.art ul,.art ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:8px}
.art strong{color:#14112b}
.kick{margin:0;font:500 12px/16px 'Geist Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:#565075}
.kick a{color:#4a3cc9;text-decoration:none}
.tw{overflow-x:auto;border:1px solid #d8d3f0;border-radius:16px;background:rgba(255,255,255,.65)}
.tw table{width:100%;border-collapse:collapse;font-size:16px}
.tw th,.tw td{text-align:left;padding:12px 18px;border-bottom:1px solid #d8d3f0}
.tw th{font:500 11px/14px 'Geist Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#565075}
.tw tr:last-child td{border-bottom:0}
.tw td:last-child{font-weight:600;color:#4a3cc9;white-space:nowrap}
.cta{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;margin-top:18px;padding:26px 28px;border-radius:24px;background:#0d0b24;color:#fff}
.cta h2{margin:0;font-size:22px;color:#fff}
.cta p{margin:6px 0 0;color:#cfcaf5;font-size:16px;line-height:24px}
.btn{display:inline-block;padding:13px 24px;border-radius:9999px;background:#fff;color:#14112b !important;text-decoration:none;font-size:15px;white-space:nowrap}
.ic{display:flex;flex-direction:column;gap:8px;padding:24px 26px;border-radius:20px;background:rgba(255,255,255,.65);border:1px solid #d8d3f0;text-decoration:none;color:#14112b !important}
.ic:hover{border-color:#8f86e8;background:#fff}
.ic h2{margin:0;font-size:22px;line-height:28px;font-weight:600;letter-spacing:-.02em}
.ic p{margin:0;font-size:16px;line-height:25px;color:#565075}
.ic span{font:500 11px/14px 'Geist Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#4a3cc9}
</style>
'''
def cta():
    return '<div class="cta"><div><h2>Planning a hire in LATAM?</h2><p>Tell us about the role and we will tell you honestly how we can help.</p></div><a class="btn" href="https://cal.com/sofia-suarez-ms4fk6/intro" target="_blank" rel="noopener">Book a call</a></div>'

os.makedirs("insights", exist_ok=True)
for f in glob.glob("insights/*.html"): os.remove(f)
arts = []
ORDER = ["what-latam-engineers-want-from-us-jobs", "latam-senior-engineer-salary-poll", "contractor-vs-employee-eor-latam-engineers", "how-to-hire-senior-engineers-in-latam"]
for p in sorted(glob.glob("tools/insights/*.md"), key=lambda x: ORDER.index(os.path.basename(x)[:-3]) if os.path.basename(x)[:-3] in ORDER else 99):
    m, body = parse(p); arts.append(m)
    url = "%s/insights/%s" % (BASE, m["slug"])
    ld = {"@context": "https://schema.org", "@type": "Article", "headline": m["title"],
          "description": m["description"], "datePublished": m["date"], "dateModified": m["date"],
          "mainEntityOfPage": url, "author": {"@type": "Organization", "name": "sfera", "url": BASE},
          "publisher": {"@type": "Organization", "name": "sfera", "url": BASE}}
    page = (set_head(head, m["title"] + " | sfera", m["description"], url, "article")
            + '<script type="application/ld+json">%s</script>\n' % json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")
            + STYLE + body_open
            + '''  <section style="position: relative; padding: 48px 24px 112px; background: #f3f1fb;">
    <article class="art">
      <p class="kick"><a href="/insights">Insights</a> / %s / %s</p>
      <h1>%s</h1>
%s
      %s
    </article>
  </section>

''' % (m["date"], html.escape(m["read"]), html.escape(m["title"]), render(body), cta())
            + foot + "\n</div>\n</body>\n</html>\n")
    open("insights/%s.html" % m["slug"], "w").write(page)

url = BASE + "/insights"
cards = "".join('<a class="ic" href="/insights/%s"><span>%s / %s</span><h2>%s</h2><p>%s</p></a>' % (
    m["slug"], m["date"], html.escape(m["read"]), html.escape(m["title"]), html.escape(m["description"])) for m in arts)
idx = (set_head(head, "Insights | sfera", "Data and practical guides on hiring in Latin America, from polls of our LinkedIn network and from the searches we run.", url, "website")
       + STYLE + body_open + '''  <section style="position: relative; padding: 48px 24px 112px; background: #f3f1fb;">
    <div class="art" style="max-width:1000px">
      <p class="kick">Insights</p>
      <h1 style="font-size:clamp(40px,5vw,60px);line-height:1">What we are <em style="font-family:'Instrument Serif',Georgia,serif;font-weight:400;color:#4a3cc9;">learning</em></h1>
      <p style="max-width:560px;font-size:18px;line-height:28px;color:#565075">Polls of our LinkedIn network and practical guides on hiring in Latin America. These are pulse checks from our community, not market benchmarks.</p>
      <div style="display:flex;flex-direction:column;gap:14px;margin-top:8px">%s</div>
      %s
    </div>
  </section>

''' % (cards, cta()) + foot + "\n</div>\n</body>\n</html>\n")
open("insights.html", "w").write(idx)
print("built", len(arts), "articles + index")
