#!/usr/bin/env python3
"""Builds one static page per open search (roles/<slug>.html) from searches.json,
with JobPosting structured data for Google for Jobs, and refreshes sitemap.xml.
Run from the repo root after editing searches.json:  python3 tools/build_roles.py
Evergreen (always open) entries get a page but no JobPosting markup."""
import json, html, os, glob
BASE = "https://sferapeople.com"
LOC = {  # slug -> (locality, region, country, employmentType or None)
    "software-engineer-ai-mfc": ("Buenos Aires", "Buenos Aires", "AR", "FULL_TIME"),
    "software-engineer-infra-mfc": ("Buenos Aires", "Buenos Aires", "AR", "FULL_TIME"),
    "software-engineer-backend-nodejs-cocos": ("Vicente Lopez", "Buenos Aires", "AR", None),
}
LISTS = {"What you will do", "What we are looking for"}
src = open("searches.html").read()
head = src[:src.index("</head>")]
body_open = src[src.index("</head>"):src.index('  <section style="position: relative; padding: 48px 24px 112px')]
foot = src[src.index("  <footer"):src.index("</footer>") + len("</footer>")]
data = json.load(open("searches.json"))["searches"]

def blocks(details):
    out, cur, items = [], None, []
    def flush():
        nonlocal items
        if not items: return
        if cur in LISTS:
            out.append("<ul>" + "".join("<li>%s</li>" % html.escape(i) for i in items) + "</ul>")
        else:
            out.extend("<p>%s</p>" % html.escape(i) for i in items)
        items = []
    for ln in details.split("\n"):
        ln = ln.strip()
        if not ln: continue
        if ln.startswith("## "):
            flush(); cur = ln[3:]; out.append("<h2>%s</h2>" % html.escape(cur))
        else:
            items.append(ln)
    flush()
    return "".join(out)

for f in glob.glob("roles/*.html"): os.remove(f)
urls = []
for s in data:
    slug, title = s["slug"], s["title"]
    desc_html = blocks(s.get("details") or s["summary"])
    url = "%s/roles/%s" % (BASE, slug)
    h = head.replace("sfera | Open searches", "%s | sfera" % title)
    a = h.index('<meta name="description" content="') + len('<meta name="description" content="')
    h = h[:a] + html.escape(s["summary"], quote=True) + h[h.index('"', a):]
    h = h.replace("https://sferapeople.com/searches", url)
    ld = ""
    if not s.get("evergreen"):
        loc = LOC[slug]
        j = {"@context": "https://schema.org", "@type": "JobPosting", "title": title,
             "description": desc_html, "datePosted": s["posted"],
             "identifier": {"@type": "PropertyValue", "name": "sfera", "value": slug},
             "hiringOrganization": {"@type": "Organization", "name": "confidential"},
             "jobLocation": {"@type": "Place", "address": {"@type": "PostalAddress",
                 "addressLocality": loc[0], "addressRegion": loc[1], "addressCountry": loc[2]}},
             "industry": s["industry"], "url": url}
        if loc[3]: j["employmentType"] = loc[3]
        if s.get("valid_through"): j["validThrough"] = s["valid_through"] + "T23:59:00-03:00"
        ld = '<script type="application/ld+json">%s</script>\n' % json.dumps(j, ensure_ascii=False).replace("</", "<\\/")
    tags = [s["industry"], "%s · %s" % (s["country"], s["modality"]), s["seniority"]]
    page = h + ld + '''<style>
.role{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
.role h2{margin:22px 0 0;font-size:20px;font-weight:600;letter-spacing:-.02em}
.role p,.role li{font-size:16px;line-height:26px;color:#565075;margin:0}
.role ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px}
.tags{display:flex;flex-wrap:wrap;gap:8px;font:500 11px/14px 'Geist Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#4a3cc9}
.tags span+span::before{content:"/";margin-right:8px;color:#b9b3ee}
.btn{display:inline-block;align-self:flex-start;padding:14px 26px;border-radius:9999px;background:#14112b;color:#fff !important;text-decoration:none;font-size:16px}
</style>
''' + body_open + '''  <section style="position: relative; padding: 48px 24px 112px; background: #f3f1fb;">
    <article class="role">
      <p style="font: 500 12px/16px 'Geist Mono', monospace; letter-spacing: .1em; text-transform: uppercase;"><a href="/searches">Open searches</a></p>
      <h1 style="margin: 0; font-size: clamp(34px, 4.4vw, 52px); line-height: 1.05; font-weight: 500; letter-spacing: -0.04em;">%s</h1>
      <div class="tags">%s</div>
      <p>%s</p>
      <a class="btn" href="/talent?role=%s">Apply for this role</a>
      %s
      <p style="font-size: 14px;">We run this search for one of our clients and share the company name once you are in process.</p>
      <a class="btn" href="/talent?role=%s">Apply for this role</a>
    </article>
  </section>

''' % (html.escape(title), "".join("<span>%s</span>" % html.escape(t) for t in tags),
       html.escape(s["summary"]), slug, desc_html, slug) + foot + "\n</div>\n</body>\n</html>\n"
    open("roles/%s.html" % slug, "w").write(page)
    urls.append(url)

fixed = ["/", "/talent", "/searches", "/privacy"]
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
sm += ["<url><loc>%s%s</loc></url>" % (BASE, p) for p in fixed] + ["<url><loc>%s</loc></url>" % u for u in urls]
open("sitemap.xml", "w").write("\n".join(sm + ["</urlset>"]) + "\n")
print("built", len(urls), "role pages")
