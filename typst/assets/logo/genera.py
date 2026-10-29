# -*- coding: utf-8 -*-
"""
ESPOSIZIONE - il logotipo: i due punti. Scelto il 29 ottobre 2026.

La parola in minuscolo, con due dadi a sei facce al posto dei puntini delle i.
Il primo dado mostra 3 ed è terracotta, il secondo mostra 4 ed è d'inchiostro:
sette, il tiro più probabile. Le lettere sono TeX Gyre Pagella, convertite in
tracciati: i file non dipendono da nessun font installato. I puntini dei dadi
sono fori nel tracciato (regola evenodd), non maschere: un file si stampa a un
colore, si incide e si importa in un motore di gioco così com'è.

Uso:  python genera.py            le forme in SVG (serve fonttools)
      python genera.py --cuoio    anche la prova sulla copertina di cuoio
                                  (servono anche PyMuPDF, numpy e Pillow)
"""
import math
import os
import sys

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

QUI = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(QUI, "..", "..", "fonts")

INK, CARTA = "#17150f", "#f4f1e8"
PALETTE = {
    #            inchiostro, primo dado, fondo dell'icona
    "positivo": (INK, "#7d2b1a", CARTA),
    "negativo": (CARTA, "#c4573c", "#12141a"),
    "runtime": (CARTA, "#FE5200", "#005057"),
    "unatinta": (INK, INK, None),
}


def num(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


class Faccia(object):
    def __init__(self, file):
        self.f = TTFont(os.path.join(FONTS, file))
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()

    def nomi(self, testo):
        return [self.cmap[ord(ch)] for ch in testo]

    def avanzo(self, nome):
        return self.gs[nome].width

    def tracciato(self, nome, t):
        pen = SVGPathPen(self.gs, ntos=num)
        self.gs[nome].draw(TransformPen(pen, t))
        return pen.getCommands()

    def ingombro(self, nome, t):
        pen = BoundsPen(self.gs)
        self.gs[nome].draw(TransformPen(pen, t))
        return pen.bounds


PAG = Faccia("texgyrepagella-regular.otf")
PAGB = Faccia("texgyrepagella-bold.otf")
PAGI = Faccia("texgyrepagella-italic.otf")


class Riga(object):
    """Una riga di glifi: corpo in unità, spazio fra le lettere in em."""

    def __init__(self, faccia, nomi, corpo, spazio=0.0, x=0.0, y=0.0):
        s = corpo / 1000.0
        pezzi, self.pos, cx = [], [], x
        x0 = y0 = 1e9
        x1 = y1 = -1e9
        for i, n in enumerate(nomi):
            t = Transform(s, 0, 0, -s, cx, y)
            pezzi.append(faccia.tracciato(n, t))
            b = faccia.ingombro(n, t)
            if b:
                x0, y0, x1, y1 = min(x0, b[0]), min(y0, b[1]), max(x1, b[2]), max(y1, b[3])
            self.pos.append(cx)
            cx += faccia.avanzo(n) * s
            if i < len(nomi) - 1:
                cx += spazio * corpo
        self.d = " ".join(pezzi)
        self.box = (x0, y0, x1, y1)


def cerchio(x, y, r):
    return f"M{num(x - r)} {num(y)}a{num(r)} {num(r)} 0 1 0 {num(2 * r)} 0a{num(r)} {num(r)} 0 1 0 {num(-2 * r)} 0Z"


def dado(cx, cy, lato, angolo, faccia, pieno=False):
    """Un dado a sei facce visto di fronte, con i puntini come fori."""
    r = lato * 0.17
    h = lato / 2
    t = Transform().translate(cx, cy).rotate(math.radians(angolo))

    def p(x, y):
        return t.transformPoint((x, y))

    d = []
    for i, (ax, ay) in enumerate([(-h, -h), (h, -h), (h, h), (-h, h)]):
        sx = 1 if ax < 0 else -1
        sy = 1 if ay < 0 else -1
        a = p(ax, ay + sy * r) if i % 2 == 0 else p(ax + sx * r, ay)
        b = p(ax + sx * r, ay) if i % 2 == 0 else p(ax, ay + sy * r)
        c = p(ax, ay)
        d.append(("M" if i == 0 else "L") + f"{num(a[0])} {num(a[1])}Q{num(c[0])} {num(c[1])} {num(b[0])} {num(b[1])}")
    d.append("Z")
    if not pieno:
        q = lato * 0.27
        posti = {3: [(-q, -q), (0, 0), (q, q)], 4: [(-q, -q), (q, -q), (-q, q), (q, q)]}[faccia]
        for x, y in posti:
            d.append(cerchio(*p(x, y), lato * 0.095))
    return "".join(d)


def ingombro_dado(cx, cy, lato, angolo):
    e = lato / 2 * (math.cos(math.radians(angolo)) + abs(math.sin(math.radians(angolo))))
    return (cx - e, cy - e, cx + e, cy + e)


def unione(*box):
    return (min(b[0] for b in box), min(b[1] for b in box), max(b[2] for b in box), max(b[3] for b in box))


# ---------------------------------------------------------------------------
# La parola con i due dadi
# ---------------------------------------------------------------------------

CORPO = 120          # la parola, in unità del disegno
LATO = 160           # il lato del dado, in millesimi del corpo (il puntino della i ne misura 100)
STACCO = 58          # dalla cima della i allo spigolo più basso del dado, in millesimi
ANGOLI = (17, -11)   # come cadono i due dadi
PUNTINO_X = 146      # il centro del puntino della i di Pagella, in millesimi
OCCHIO = 469         # l'altezza della x di Pagella


def parola(spazio=0.005, lato=LATO, stacco=STACCO, pieno=False):
    """Ritorna (tracciato delle lettere, [dado uno, dado due], ingombro)."""
    s = CORPO / 1000.0
    nomi = ["dotlessi" if n == "i" else n for n in PAG.nomi("esposizione")]
    r = Riga(PAG, nomi, CORPO, spazio)
    dadi, box = [], [r.box]
    for k, faccia, ang in ((5, 3, ANGOLI[0]), (7, 4, ANGOLI[1])):
        e = lato / 2 * (math.cos(math.radians(ang)) + abs(math.sin(math.radians(ang))))
        cx = r.pos[k] + PUNTINO_X * s
        cy = -(OCCHIO + stacco + e) * s
        dadi.append(dado(cx, cy, lato * s, ang, faccia, pieno))
        box.append(ingombro_dado(cx, cy, lato * s, ang))
    return r.d, dadi, unione(*box)


def descrittore(testo, corpo, box_parola, allinea, linea):
    nomi = PAGI.nomi(testo)
    prova = Riga(PAGI, nomi, corpo, 0.02)
    w = prova.box[2] - prova.box[0]
    if allinea == "destra":
        x = box_parola[2] - w - prova.box[0]
    else:
        x = (box_parola[0] + box_parola[2]) / 2 - w / 2 - prova.box[0]
    return Riga(PAGI, nomi, corpo, 0.02, x, linea)


def svg(box, corpo, titolo, margine, fondo=None):
    x, y = box[0] - margine, box[1] - margine
    w, h = box[2] - box[0] + 2 * margine, box[3] - box[1] + 2 * margine
    f = fondo or ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{num(x)} {num(y)} {num(w)} {num(h)}" '
            f'width="{num(w)}" height="{num(h)}" role="img" aria-label="{titolo}">'
            f'<title>{titolo}</title>{f}{corpo}</svg>\n')


def scrivi(nome, testo):
    with open(os.path.join(QUI, nome), "w", encoding="utf-8", newline="\n") as f:
        f.write(testo)


def disegno(lettere, dadi, altro, ink, punto):
    return (f'<g fill-rule="evenodd"><path d="{lettere}" fill="{ink}"/>'
            f'<path d="{dadi[0]}" fill="{punto}"/><path d="{dadi[1]}" fill="{ink}"/>'
            + "".join(f'<path d="{d}" fill="{ink}"/>' for d in altro) + "</g>")


def forme():
    lettere, dadi, box = parola()
    margine = 0.1 * CORPO
    righe = {
        "inlinea": ("ESPOSIZIONE: Narrative RPG Engine",
                    [descrittore("narrative rpg engine", 26, box, "destra", 62)]),
        "centrata": ("ESPOSIZIONE: Narrative RPG Engine",
                     [descrittore("narrative rpg engine", 26, box, "centro", 66)]),
        "studio-inlinea": ("ESPOSIZIONE Studio",
                           [descrittore("studio", 42, box, "destra", 70)]),
    }
    for forma, (titolo, sotto) in righe.items():
        tutto = unione(box, *(r.box for r in sotto))
        for nome, (ink, punto, _) in PALETTE.items():
            scrivi(f"esposizione-{forma}-{nome}.svg",
                   svg(tutto, disegno(lettere, dadi, [r.d for r in sotto], ink, punto), titolo, margine))

    # la forma piccola: lettere più aperte, dadi più grandi e pieni
    p_lettere, p_dadi, p_box = parola(spazio=0.03, lato=185, stacco=62, pieno=True)
    for nome, (ink, punto, _) in PALETTE.items():
        scrivi(f"esposizione-piccola-{nome}.svg",
               svg(p_box, disegno(p_lettere, p_dadi, [], ink, punto), "ESPOSIZIONE", margine))

    # l'icona: una i in neretto, con il dado per puntino
    k = 0.1
    stelo = Riga(PAGB, ["dotlessi"], k * 1000, 0, 50 - 166 * k, 92)
    ang, lato = 15, 31
    e = lato / 2 * (math.cos(math.radians(ang)) + math.sin(math.radians(ang)))
    di = dado(50, stelo.box[1] - 4.5 - e, lato, ang, 3)
    for nome, (ink, punto, fondo) in PALETTE.items():
        if fondo is None:
            continue
        corpo = (f'<rect width="100" height="100" rx="18" fill="{fondo}"/>'
                 f'<g fill-rule="evenodd"><path d="{stelo.d}" fill="{ink}"/><path d="{di}" fill="{punto}"/></g>')
        scrivi(f"esposizione-icona-{nome}.svg", svg((0, 0, 100, 100), corpo, "ESPOSIZIONE", 0))

    animato(lettere, dadi, box, righe["inlinea"][1][0], margine)
    return lettere, dadi, box, righe["centrata"][1][0]


# ---------------------------------------------------------------------------
# Il logo animato: i dadi cadono, rimbalzano e diventano i puntini
# ---------------------------------------------------------------------------

def animato(lettere, dadi, box, desc, margine):
    ink, punto, fondo = PALETTE["negativo"]
    tutto = unione(box, desc.box)
    x, y = tutto[0] - margine, tutto[1] - margine
    w, h = tutto[2] - tutto[0] + 2 * margine, tutto[3] - tutto[1] + 2 * margine
    stile = (
        "#dado-tre,#dado-quattro{transform-box:fill-box;transform-origin:center}"
        "#parola{animation:parola .7s ease-out both}"
        "#dado-tre{animation:dado-tre 1.5s .35s ease-in-out both}"
        "#dado-quattro{animation:dado-quattro 1.5s .6s ease-in-out both}"
        "#descrittore{animation:descrittore .8s 1.9s ease-out both}"
        "@keyframes parola{from{opacity:0}to{opacity:1}}"
        "@keyframes dado-tre{0%{opacity:0;transform:translateY(-130px) rotate(-280deg)}"
        "4%{opacity:1}36%{transform:translateY(0) rotate(0)}48%{transform:translateY(-13px) rotate(14deg)}"
        "60%{transform:translateY(0) rotate(0)}68%{transform:translateY(-4px) rotate(-4deg)}"
        "76%,100%{opacity:1;transform:none}}"
        "@keyframes dado-quattro{0%{opacity:0;transform:translateY(-130px) rotate(260deg)}"
        "4%{opacity:1}36%{transform:translateY(0) rotate(0)}48%{transform:translateY(-13px) rotate(-12deg)}"
        "60%{transform:translateY(0) rotate(0)}68%{transform:translateY(-4px) rotate(4deg)}"
        "76%,100%{opacity:1;transform:none}}"
        "@keyframes descrittore{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}"
        "@media (prefers-reduced-motion:reduce){#parola,#dado-tre,#dado-quattro,#descrittore{animation:none}}"
    )
    corpo = (f'<style>{stile}</style><rect x="{num(x)}" y="{num(y)}" width="{num(w)}" height="{num(h)}" fill="{fondo}"/>'
             f'<g fill-rule="evenodd"><path id="parola" d="{lettere}" fill="{ink}"/>'
             f'<path id="dado-tre" d="{dadi[0]}" fill="{punto}"/><path id="dado-quattro" d="{dadi[1]}" fill="{ink}"/>'
             f'<path id="descrittore" d="{desc.d}" fill="{ink}"/></g>')
    scrivi("esposizione-animato.svg", svg(tutto, corpo, "ESPOSIZIONE: Narrative RPG Engine", margine))


# ---------------------------------------------------------------------------
# La prova sul cuoio: una copertina marrone antica, con l'oro a caldo
# ---------------------------------------------------------------------------

CW, CH = 900, 1200


def cuoio(lettere, dadi, box, desc):
    import fitz
    import numpy as np
    from PIL import Image, ImageFilter

    def maschera(frammento, vb, centro, larg):
        x, y, w, h = vb
        k = larg / w
        dx, dy = centro[0] - (x + w / 2) * k, centro[1] - (y + h / 2) * k
        doc = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}">'
               f'<g transform="translate({num(dx)} {num(dy)}) scale({k:.5f})" fill="#000" fill-rule="evenodd">{frammento}</g></svg>')
        pagina = fitz.open(stream=doc.encode("utf-8"), filetype="svg")[0]
        pix = pagina.get_pixmap(alpha=True)
        a = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, pix.n)[..., 3]
        return a[:CH, :CW].astype(np.float32) / 255.0

    def rumore(rng, scala):
        sh, sw = CH // scala + 3, CW // scala + 3
        a = (rng.random((sh, sw)) * 255).astype(np.uint8)
        im = Image.fromarray(a).resize((sw * scala, sh * scala), Image.BICUBIC)
        return np.asarray(im, np.float32)[:CH, :CW] / 255.0

    def sfoca(a, r):
        im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
        return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255.0

    def sposta(a, dx, dy):
        return np.roll(np.roll(a, dy, axis=0), dx, axis=1)

    def pelle(rng):
        fine = rumore(rng, 2) * 0.5 + rumore(rng, 3) * 0.5
        grana = rumore(rng, 5)
        pieghe = ((1 - np.abs(rumore(rng, 46) * 2 - 1)) ** 12 + (1 - np.abs(rumore(rng, 23) * 2 - 1)) ** 18 * 0.6) * 0.45
        macchie = sfoca(rumore(rng, 180), 30)
        altezza = fine * 0.35 + grana * 0.45 - pieghe * 0.5
        gy, gx = np.gradient(altezza)
        luce = np.clip(1 + (-gx - gy) * 4.2, 0.72, 1.3)
        chiaro = np.array([122, 72, 42], np.float32) / 255
        scuro = np.array([78, 43, 24], np.float32) / 255
        t = np.clip(macchie * 1.3 - 0.1, 0, 1)[..., None]
        col = scuro * (1 - t) + chiaro * t
        col = col * (0.86 + 0.2 * grana[..., None]) * luce[..., None]
        col = col * (1 - 0.35 * pieghe[..., None])
        yy, xx = np.mgrid[0:CH, 0:CW]
        d = np.maximum(np.abs(xx / CW - 0.5) / 0.5, np.abs(yy / CH - 0.5) / 0.5)
        col *= (1 - 0.42 * np.clip((d - 0.8) / 0.2, 0, 1) ** 1.6)[..., None]
        return col

    def impressione(col, m, forza):
        mb = sfoca(m, 1.4)
        ombra = np.clip(m - sposta(mb, 3, 3), 0, 1)
        luce = np.clip(m - sposta(mb, -2, -2), 0, 1)
        out = col * (1 - 0.30 * forza * m[..., None])
        return out * (1 - 0.6 * forza * ombra[..., None]) + 0.08 * forza * luce[..., None]

    def oro(rng):
        yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
        t = (0.5 + 0.5 * np.sin((xx * 0.55 + yy) / CW * 6.5 + sfoca(rumore(rng, 40), 6) * 4))[..., None]
        scuro = np.array([158, 112, 42], np.float32) / 255
        chiaro = np.array([252, 226, 156], np.float32) / 255
        return (scuro * (1 - t) + chiaro * t) * (0.88 + 0.22 * rumore(rng, 1)[..., None])

    rng = np.random.default_rng(11)
    col = pelle(rng)
    cornice = np.zeros((CH, CW), np.float32)
    for inset, sp in ((54, 3), (66, 1.5)):
        a, b = int(inset), int(inset + sp)
        cornice[a:CH - a, a:b] = 1
        cornice[a:CH - a, CW - b:CW - a] = 1
        cornice[a:b, a:CW - a] = 1
        cornice[CH - b:CH - a, a:CW - a] = 1
    col = impressione(col, sfoca(cornice, 0.6), 1.0)

    tutto = unione(box, desc.box)
    vb = (tutto[0], tutto[1], tutto[2] - tutto[0], tutto[3] - tutto[1])
    frammento = "".join(f'<path d="{d}"/>' for d in (lettere, dadi[0], dadi[1], desc.d))
    oro_m = maschera(frammento, vb, (CW / 2, 500), 640)
    usura = np.clip((sfoca(rumore(rng, 2), 0.6) - 0.74) * 5, 0, 1) * 0.35
    g = oro_m * (1 - usura)
    col = impressione(col, oro_m, 0.7)
    foglia = impressione(oro(rng), oro_m, 0.25)
    col = col * (1 - g[..., None]) + foglia * g[..., None]
    Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)).save(
        os.path.join(QUI, "prova-cuoio.jpg"), quality=86, optimize=True)


if __name__ == "__main__":
    lettere, dadi, box, desc = forme()
    if "--cuoio" in sys.argv:
        cuoio(lettere, dadi, box, desc)
    print("forme rigenerate")
