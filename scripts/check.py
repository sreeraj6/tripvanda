"""Dependency-free checks for GitHub Pages output and SEO essentials."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, parse_qs
import json
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
 def __init__(self, file):
  super().__init__(convert_charrefs=True); self.file=file; self.tags=[]; self.ids=set(); self.h1=0; self.script=False; self.schema=''; self.schemas=[]; self.titles=[]; self.in_title=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs); self.tags.append((tag,a))
  if 'id' in a:
   assert a['id'] not in self.ids, f'{self.file}: duplicate ID {a["id"]}'
   self.ids.add(a['id'])
  if tag=='h1': self.h1+=1
  if tag=='title': self.in_title=True
  if tag=='script' and a.get('type')=='application/ld+json': self.script=True; self.schema=''
  if tag=='img': assert 'alt' in a and a.get('width') and a.get('height'), f'{self.file}: image missing alt or dimensions'
 def handle_data(self,data):
  if self.script: self.schema+=data
  if self.in_title: self.titles.append(data)
 def handle_endtag(self,tag):
  if tag=='title': self.in_title=False
  if tag=='script' and self.script: self.schemas.append(json.loads(self.schema)); self.script=False
pages={}
for f in ROOT.glob('*.html'):
 p=Page(f.name); p.feed(f.read_text()); pages[f.name]=p
 assert p.h1==1, f'{f.name}: expected one H1'
 assert p.titles and p.schemas, f'{f.name}: missing title or schema'
 assert any(t=='html' and a.get('lang')=='en-IN' for t,a in p.tags), f'{f.name}: language missing'
 assert any(t=='meta' and a.get('name')=='description' and len(a.get('content',''))>40 for t,a in p.tags), f'{f.name}: missing description'
 assert any(t=='link' and a.get('rel')=='canonical' and a.get('href','').startswith('https://tripvanda.com/') for t,a in p.tags), f'{f.name}: canonical missing'
 assert any(t=='meta' and a.get('property')=='og:image' for t,a in p.tags), f'{f.name}: social image missing'
for f,p in pages.items():
 for tag,a in p.tags:
  for attr in ['href','src']:
   raw=a.get(attr,''); u=urlsplit(raw)
   if u.scheme or u.netloc or not raw: continue
   target=ROOT/unquote(u.path.lstrip('/')) if u.path else ROOT/f
   assert target.exists(), f'{f}: broken {attr} {raw}'
   if u.fragment and target.suffix=='.html': assert u.fragment in pages[target.name].ids, f'{f}: broken fragment {raw}'
  if a.get('href','').startswith('https://wa.me/'):
   u=urlsplit(a['href']); assert u.path=='/918129422113', f'{f}: wrong WhatsApp number'
   assert parse_qs(u.query).get('text'), f'{f}: WhatsApp message missing'
 assert all('8129422113' in json.dumps(s) for s in p.schemas), f'{f}: schema telephone missing'
sitemap=ET.parse(ROOT/'sitemap.xml'); urls=[x.text for x in sitemap.findall('.//{*}loc')]
assert len(urls)==len(pages)-1 and len(set(urls))==len(urls), 'Sitemap coverage mismatch'
for url in urls:
 assert url.startswith('https://tripvanda.com/') and '404' not in url
 assert (ROOT/(url.removeprefix('https://tripvanda.com/') or 'index.html')).exists()
assert 'Sitemap: https://tripvanda.com/sitemap.xml' in (ROOT/'robots.txt').read_text()
assert (ROOT/'CNAME').read_text().strip()=='tripvanda.com'
assert (ROOT/'assets/social-card.jpg').exists()
assert len(set(''.join(p.titles) for p in pages.values()))==len(pages), 'Duplicate page titles'
print(f'PASS: {len(pages)} HTML pages, internal links and anchors, JSON-LD, unique titles, metadata, WhatsApp links, crawler files and sitemap.')
