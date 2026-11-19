#!/usr/bin/env python3
"""
Baut die Website aus den deutschen Quellseiten in _src/:
  Englisch (Standard) -> Hauptordner (index.html, netzwerk.html, ...)
  Deutsch             -> de/
  en/                 -> Weiterleitungen auf die alten /en/-Adressen

  python3 _build/build_pages.py   (deutsche Unterseiten nach _src/)
  python3 _i18n/build_site.py     (diese Datei)
  python3 _i18n/build_site.py --missing   (nur Texte ohne Übersetzung listen)

Übersetzungen: _i18n/en.json ("Deutscher Text": "English text"). Fehlt ein Text, bricht das
Skript ab und nennt ihn. Ordner mit _ werden von GitHub Pages nicht ausgeliefert.
"""
import html, json, os, re, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_src")
DICT = os.path.join(ROOT, "_i18n", "en.json")
SITE = "https://threeapesgroup.com/"
PAGES = sorted(f for f in os.listdir(SRC) if f.endswith(".html"))

TEXT_ATTRS = {"placeholder", "aria-label", "alt", "title", "data-cap", "data-example", "data-ph"}
META_NAMES = {"description", "og:title", "og:description", "twitter:title", "twitter:description"}
SKIP_TAGS = {"script", "style"}
WS = re.compile(r"^(\s*)(.*?)(\s*)$", re.S)


def needs(t):
    """Nur Texte mit Buchstaben übersetzen."""
    return bool(re.search(r"[A-Za-zÄÖÜäöüß]", t))


class Tr(HTMLParser):
    def __init__(self, d, missing):
        super().__init__(convert_charrefs=False)
        self.d, self.missing, self.out, self.skip = d, missing, [], 0

    def tr(self, s):
        if not needs(s):
            return s
        key = html.unescape(s).replace("­", "")
        key = re.sub(r"\s+", " ", key).strip()
        if key in self.d:
            v = self.d[key]
            return html.escape(v, quote=False) if "<" not in s and "&" not in v else v
        # Rohform mit Entities (z. B. &amp;) ebenfalls zulassen
        raw = re.sub(r"\s+", " ", s).strip()
        if raw in self.d:
            return self.d[raw]
        self.missing.add(key)
        return s

    def starttag(self, tag, attrs, text):
        a = dict(attrs)
        def sub_attr(name, val):
            nonlocal text
            new = self.tr(val)
            if new != val:
                text = re.sub(r'(\s%s=")%s(")' % (re.escape(name), re.escape(html.escape(val, quote=True).replace("&#x27;", "'"))),
                              lambda m: m.group(1) + html.escape(new, quote=True).replace("&#x27;", "'") + m.group(2), text, count=1)
                if html.escape(new, quote=True) not in text and new not in text:
                    text = re.sub(r'(\s%s=")[^"]*(")' % re.escape(name), lambda m: m.group(1) + html.escape(new, quote=True).replace("&#x27;", "'") + m.group(2), text, count=1)
        for k, v in attrs:
            if v is None:
                continue
            if k in TEXT_ATTRS:
                sub_attr(k, v)
        if tag == "meta" and (a.get("name") in META_NAMES or a.get("property") in META_NAMES) and a.get("content"):
            sub_attr("content", a["content"])
        return text

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self.skip += 1
        self.out.append(self.starttag(tag, attrs, self.get_starttag_text()))

    def handle_startendtag(self, tag, attrs):
        self.out.append(self.starttag(tag, attrs, self.get_starttag_text()))

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS:
            self.skip -= 1
        self.out.append(f"</{tag}>")

    def handle_data(self, data):
        if self.skip:
            self.out.append(data); return
        m = WS.match(data)
        self.out.append(m.group(1) + self.tr(m.group(2)) + m.group(3) if m.group(2) else data)

    def handle_entityref(self, name):
        self.out.append(f"&{name};")

    def handle_charref(self, name):
        self.out.append(f"&#{name};")

    def handle_comment(self, data):
        self.out.append(f"<!--{data}-->")

    def handle_decl(self, decl):
        self.out.append(f"<!{decl}>")


def merge_inline(src):
    """Text mit Inline-Auszeichnung (b, em, i, a, span.redact, br) als Ganzes übersetzbar machen:
    Absätze, deren innerHTML als Schlüssel im Wörterbuch steht, werden vorab ersetzt."""
    return src


def en_numbers(out):
    """Nur im sichtbaren Text (nicht in Attributen): 2.500 € -> €2,500, 10.000 – 25.000 € -> €10,000 – 25,000."""
    def fix(seg):
        seg = re.sub(r"(?<=\d)\.(?=\d{3}\b)", ",", seg)
        seg = re.sub(r"(\d[\d,]*(?:\s*–\s*\d[\d,]*)?)\s*€", r"€\1", seg)
        return seg
    parts = re.split(r"(<script\b.*?</script>|<style\b.*?</style>|<[^>]+>)", out, flags=re.S)
    return "".join(p if p.startswith("<") else fix(p) for p in parts)


def head_links(name, lang):
    slug = "" if name == "index.html" else name
    en, de = SITE + slug, SITE + "de/" + slug
    return (f'<link rel="canonical" href="{en if lang == "en" else de}" />\n  '
            f'<link rel="alternate" hreflang="en" href="{en}" />\n  '
            f'<link rel="alternate" hreflang="de" href="{de}" />\n  '
            f'<link rel="alternate" hreflang="x-default" href="{en}" />')


def prefix_assets(out):
    out = re.sub(r'((?:src|href)=")(assets/)', r"\1../\2", out)
    return out


REDIRECT = """<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>ThreeApesGroup</title>
<link rel="canonical" href="{url}" />
<meta name="robots" content="noindex" />
<meta http-equiv="refresh" content="0; url=../{slug}" />
<script>location.replace("../{slug}" + location.search + location.hash)</script>
</head><body><a href="../{slug}">ThreeApesGroup</a></body></html>
"""


def main():
    d = json.load(open(DICT, encoding="utf-8"))
    blocks = sorted(((k, v) for k, v in d.items() if "<" in k), key=lambda kv: -len(kv[0]))
    # Texte, die ein Block schon auf Englisch einsetzt, nicht noch einmal übersetzen
    for _, v in blocks:
        for frag in re.split(r"<[^>]+>", v):
            frag = re.sub(r"\s+", " ", html.unescape(frag)).strip()
            if needs(frag):
                d.setdefault(frag, frag)
    only_missing = "--missing" in sys.argv
    missing = {}
    for sub in ("de", "en"):
        os.makedirs(os.path.join(ROOT, sub), exist_ok=True)
    for name in PAGES:
        src = open(os.path.join(SRC, name), encoding="utf-8").read()
        src = src.replace("</title>", "</title>\n  " + "<!--TAGHEAD-->", 1)

        # Deutsch -> de/
        de = src.replace("<!--TAGHEAD-->", head_links(name, "de"))
        de = prefix_assets(de)

        # Englisch -> Hauptordner
        work = src
        for k, v in blocks:
            work = work.replace(k, v)
        miss = set()
        p = Tr(d, miss); p.feed(work); p.close()
        en = "".join(p.out)
        if miss:
            missing[name] = miss
        en = en.replace('<html lang="de">', '<html lang="en">', 1)
        en = en_numbers(en)
        en = en.replace("<!--TAGHEAD-->", head_links(name, "en"))
        en = re.sub(r'(<script src="assets/js/config\.js(\?v=\d+)?"></script>)',
                    lambda m: m.group(1) + f'\n  <script src="assets/js/en.js{m.group(2) or ""}"></script>', en)

        if not only_missing:
            open(os.path.join(ROOT, "de", name), "w", encoding="utf-8").write(de)
            open(os.path.join(ROOT, name), "w", encoding="utf-8").write(en)
            slug = "" if name == "index.html" else name
            open(os.path.join(ROOT, "en", name), "w", encoding="utf-8").write(REDIRECT.format(url=SITE + slug, slug=slug))
    if missing:
        allm = sorted(set().union(*missing.values()))
        print(f"{len(allm)} Texte ohne Übersetzung:")
        print(json.dumps({m: "" for m in allm}, ensure_ascii=False, indent=1))
        sys.exit(1 if not only_missing else 0)
    print(f"ok: {len(PAGES)} Seiten – Englisch im Hauptordner, Deutsch unter de/, Weiterleitungen in en/")


if __name__ == "__main__":
    main()
