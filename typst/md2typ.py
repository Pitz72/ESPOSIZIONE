#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convertitore Markdown -> Typst su misura per i documenti ESPOSIZIONE.
Sottoinsieme supportato: titoli, paragrafi, grassetto/corsivo/codice inline,
tabelle, citazioni (regole), blocchi di codice, elenchi puntati e numerati,
righe orizzontali, callout DEVIAZIONE.

Politica tipografica applicata in conversione (non tocca i sorgenti .md):
  - il grassetto dentro le tabelle viene rimosso: la tabella ha gia' una
    gerarchia propria (colonna guida in sans, filetti, spaziatura);
  - il grassetto dentro i riquadri-regola viene rimosso: il riquadro e' gia'
    l'enfasi;
  - nel corpo, un grassetto lungo (oltre LONG_BOLD caratteri) e' una frase
    intera e diventa corsivo; un grassetto breve e' un termine e resta tale;
  - un titolo di primo livello porta come occhiello la propria prima parola
    quando non e' "PARTE": serve all'appendice, che non e' una parte.
"""
import re, sys, io

LONG_BOLD = 34


def esc(t):
    """Escape dei caratteri speciali Typst nel testo normale."""
    t = t.replace("\\", "\\\\")
    for c in "#$@<>*_`":
        t = t.replace(c, "\\" + c)
    return t


def _parse(t):
    """Albero degli span inline. Gestisce l'annidamento e il caso ***,
    che nel sorgente chiude sempre due marcature aperte."""
    root = ("r", [])
    stack = [root]
    buf = []
    i, n = 0, len(t)

    def flush():
        if buf:
            stack[-1][1].append(("t", "".join(buf)))
            del buf[:]

    def close():
        flush()
        if len(stack) > 1:
            stack.pop()

    while i < n:
        c = t[i]
        if c == "`":
            j = t.find("`", i + 1)
            if j > 0:
                flush()
                stack[-1][1].append(("c", t[i + 1:j]))
                i = j + 1
                continue
        if t.startswith("***", i) and len(stack) > 2:
            close(); close()
            i += 3
            continue
        if t.startswith("**", i):
            if any(k == "b" for k, _ in stack[1:]):
                close()
            else:
                flush()
                node = ("b", [])
                stack[-1][1].append(node)
                stack.append(node)
            i += 2
            continue
        if c == "*":
            if any(k == "i" for k, _ in stack[1:]):
                close()
            else:
                flush()
                node = ("i", [])
                stack[-1][1].append(node)
                stack.append(node)
            i += 1
            continue
        buf.append(c)
        i += 1
    flush()
    return root[1]


def _plain(nodes):
    return "".join(x[1] if x[0] in ("t", "c") else _plain(x[1]) for x in nodes)


def _render(nodes, strip_bold, bold_policy):
    out = []
    for kind, val in nodes:
        if kind == "t":
            out.append(esc(val))
        elif kind == "c":
            out.append("#mono[" + esc(val) + "]")
        elif kind == "i":
            out.append("#emph[" + _render(val, strip_bold, bold_policy) + "]")
        else:
            body = _render(val, strip_bold, bold_policy)
            if strip_bold or bold_policy == "strip":
                out.append(body)
            elif bold_policy == "italic" or (
                    bold_policy == "auto" and len(_plain(val)) > LONG_BOLD):
                out.append("#emph[" + body + "]")
            else:
                out.append("#term[" + body + "]")
    return "".join(out)


def inline(t, strip_bold=False, bold_policy="keep"):
    return _render(_parse(t), strip_bold, bold_policy)


def noenum(t):
    """Impedisce che "1." a inizio contenuto sia letto come elenco numerato."""
    return re.sub(r"^(\s*\d+)\.", r"\1\\.", t)


def cells(row):
    r = row.strip()
    if r.startswith("|"):
        r = r[1:]
    if r.endswith("|"):
        r = r[:-1]
    return [c.strip() for c in r.split("|")]


def convert(md):
    lines = md.split("\n")
    out = []
    i = 0
    n = len(lines)
    while i < n:
        L = lines[i]
        s = L.strip()

        # riga vuota
        if not s:
            i += 1
            continue

        # salto pagina esplicito
        if s == "<!--pagebreak-->":
            out.append("#pagebreak(weak: true)\n")
            i += 1
            continue

        # riga orizzontale
        if re.fullmatch(r"-{3,}", s):
            # doppia --- = stacco di parte, gestito dai titoli: ignorata
            i += 1
            continue

        # blocco di codice
        if s.startswith("```"):
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            body = "\n".join(buf).replace("\\", "\\\\").replace("`", "\\`")
            out.append("#codeblock(```\n" + "\n".join(buf) + "\n```)\n")
            continue

        # titoli
        m = re.match(r"^(#{1,4})\s+(.*)$", s)
        if m:
            lvl = len(m.group(1))
            grezzo = m.group(2)
            txt = noenum(inline(grezzo, strip_bold=True))
            if lvl == 1:
                # "PARTE I - ..." / "APPENDICE A - ...": la prima parola
                # e' l'occhiello, e non e' sempre "PARTE".
                occ = re.match(r"^(PARTE|APPENDICE|PART|APPENDIX)\b", grezzo)
                if occ and occ.group(1) != "PARTE":
                    out.append("#h1(occhiello: \"%s\")[%s]\n" % (occ.group(1), txt))
                else:
                    out.append("#h1[%s]\n" % txt)
            else:
                out.append("#h%d[%s]\n" % (lvl, txt))
            i += 1
            continue

        # tabella
        if s.startswith("|"):
            block = []
            while i < n and lines[i].strip().startswith("|"):
                block.append(lines[i])
                i += 1
            rows = [cells(r) for r in block]
            # riga separatrice
            sep = None
            for k, r in enumerate(rows):
                if all(re.fullmatch(r":?-{2,}:?", c or "-") for c in r) and k > 0:
                    sep = k
                    break
            head = rows[:sep] if sep else []
            body = rows[sep + 1:] if sep else rows
            ncol = max(len(r) for r in rows)
            def fmt(r):
                r = r + [""] * (ncol - len(r))
                return ", ".join("[" + noenum(inline(c, strip_bold=True)) + "]" for c in r)
            hd = ", ".join("[" + inline(c, strip_bold=True) + "]" for c in
                           (head[0] + [""] * (ncol - len(head[0])))) if head else ""
            tail = "," if ncol == 1 else ""
            out.append("#tabella(%d,\n  (%s%s),\n  %s\n)\n" % (
                ncol, hd, tail,
                ",\n  ".join("(" + fmt(r) + tail + ")" for r in body)))
            continue

        # citazione = regola
        if s.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", lines[i]))
                i += 1
            inner = "\n".join(buf).strip()
            # una regola puo' contenere un blocco di codice
            if "```" in inner:
                sub = convert(inner)
                out.append("#regola[\n" + sub + "]\n")
            else:
                paras = [p.strip() for p in re.split(r"\n\s*\n", inner) if p.strip()]
                body = "\n\n".join(
                    inline(p.replace("\n", " "), strip_bold=True) for p in paras)
                out.append("#regola[" + body + "]\n")
            continue

        # elenco puntato
        if re.match(r"^[-*]\s+", s):
            items = []
            while i < n and re.match(r"^\s*[-*]\s+", lines[i]):
                items.append(re.sub(r"^\s*[-*]\s+", "", lines[i]))
                i += 1
            out.append("#elenco(\n  " + ",\n  ".join(
                "[" + inline(x, bold_policy="keep") + "]" for x in items) + "\n)\n")
            continue

        # elenco numerato
        if re.match(r"^\d+\.\s+", s):
            items = []
            while i < n and re.match(r"^\s*\d+\.\s+", lines[i]):
                items.append(re.sub(r"^\s*\d+\.\s+", "", lines[i]))
                i += 1
            out.append("#numerato(\n  " + ",\n  ".join(
                "[" + inline(x, bold_policy="keep") + "]" for x in items) + "\n)\n")
            continue

        # paragrafo: una riga del sorgente = un capoverso
        p = s
        i += 1

        # callout DEVIAZIONE / nota di taratura
        if p.startswith("⚠️"):
            p = p.replace("⚠️", "").strip()
            out.append("#avviso[" + inline(p, bold_policy="auto") + "]\n")
            continue

        out.append("#pgf[" + inline(p, bold_policy="auto") + "]\n")

    return "".join(out)


TIPOGRAFIA = [("'", "\u2019"), ("...", "\u2026")]


def main(argv):
    src = io.open(argv[1], encoding="utf-8").read()
    opts = argv[3:]

    if "--tipografia" in opts:
        for a, b in TIPOGRAFIA:
            src = src.replace(a, b)

    if "--inizia-da" in opts:
        pat = opts[opts.index("--inizia-da") + 1]
        m = re.search(pat, src, re.M)
        if not m:
            raise SystemExit("marcatore non trovato: %s" % pat)
        src = src[m.start():]

    out = convert(src)
    if "--testa" in opts:
        testa = io.open(opts[opts.index("--testa") + 1], encoding="utf-8").read()
        out = testa.rstrip() + "\n\n" + out
    io.open(argv[2], "w", encoding="utf-8").write(out)


if __name__ == "__main__":
    main(sys.argv)
