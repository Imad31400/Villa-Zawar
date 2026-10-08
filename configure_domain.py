#!/usr/bin/env python3
"""Ajoute les URLs canoniques et génère le sitemap à partir du VRAI domaine.
Utilisation: python3 tools/configure_domain.py https://www.votre-vrai-domaine.ma
Utilise uniquement la bibliothèque standard Python.
"""
from pathlib import Path
import sys, re, html
from urllib.parse import urlparse
from xml.etree import ElementTree as ET
root=Path(__file__).resolve().parent.parent
if len(sys.argv)!=2:
    raise SystemExit('Usage : python3 tools/configure_domain.py https://www.votre-domaine-officiel.ma')
base=sys.argv[1].rstrip('/')
url=urlparse(base)
if url.scheme!='https' or not url.netloc or url.path or url.params or url.query or url.fragment:
    raise SystemExit('Indiquer exclusivement l’origine HTTPS, par exemple : https://www.monsite.ma')
if any(marker in url.netloc.lower() for marker in ('exemple','votre','localhost','test')):
    raise SystemExit('Veuillez fournir un vrai domaine, pas un exemple.')
pages=['index.html','villa.html','suites.html','experiences.html','galerie.html','contact.html','reservation.html','mentions-legales.html','confidentialite.html']
for page in pages:
    file=root/page
    text=file.read_text(encoding='utf-8')
    canonical=base+'/' if page=='index.html' else base+'/'+page
    tag=f'<link rel="canonical" href="{html.escape(canonical,quote=True)}">'
    text=re.sub(r'<link rel="canonical" href="[^"]*">','',text)
    text=text.replace('<!-- Canonical, og:url et URL absolue de l\'image OG : à renseigner dès que le domaine officiel est connu. -->',tag)
    ogurl=f'<meta property="og:url" content="{html.escape(canonical,quote=True)}">'
    text=re.sub(r'<meta property="og:url" content="[^"]*">','',text)
    text=text.replace('<meta property="og:type"',ogurl+'\n<meta property="og:type"',1)
    text=re.sub(r'(<meta property="og:image" content=")assets/images/([^\"]+)(">)',lambda m:m.group(1)+base+'/assets/images/'+m.group(2)+m.group(3),text)
    if page=='index.html':
        # URLs de la fiche schema sont uniquement ajoutées après connaissance du domaine.
        text=text.replace('"@type":"LodgingBusiness","name"',f'"@type":"LodgingBusiness","url":"{canonical}","name"')
    file.write_text(text,encoding='utf-8')
NS='http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('', NS)
root_el=ET.Element(f'{{{NS}}}urlset')
for page in pages[:7]:
    child=ET.SubElement(root_el,f'{{{NS}}}url')
    ET.SubElement(child,f'{{{NS}}}loc').text=base+('/' if page=='index.html' else '/'+page)
ET.indent(root_el,space='  ')
ET.ElementTree(root_el).write(root/'sitemap.xml',xml_declaration=True,encoding='utf-8')
(root/'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n',encoding='utf-8')
print('Domaine configuré :',base)
print('URLs canoniques, Open Graph, sitemap.xml et robots.txt mis à jour.')
