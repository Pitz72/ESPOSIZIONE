# -*- coding: utf-8 -*-
"""
ESPOSIZIONE - quattro proposte di logotipo, 29 ottobre 2026.

Per ogni proposta escono: la forma piatta su chiaro e su scuro, l'icona, la
prova su una copertina di cuoio (oro a caldo e impressione a secco) e i livelli
per l'animazione. Le lettere sono TeX Gyre Pagella, convertite in tracciati:
i file non dipendono da nessun font installato.

Uso:  python genera.py
Serve: fonttools, PyMuPDF, numpy, Pillow.
"""
import json
import math
import os

import fitz
import numpy as np
from PIL import Image, ImageFilter
from fontTools.misc.transform import Transform
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

QUI = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(QUI, "..", "..", "..", "fonts")

INK, CARTA, TERRA = "#17150f", "#f4f1e8", "#7d2b1a"
TERRA_SCURO = "#c4573c"
COLORI = {
    "positivo": {"ink": INK, "punto": TERRA, "fondo": CARTA},
    "negativo": {"ink": CARTA, "punto": TERRA_SCURO, "fondo": "#12141a"},
}


def num(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


class Faccia(object):
    def __init__(self, file):
        self.f = TTFont(os.path.join(FONTS, file))
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()

    def nomi(self, testo, maiuscoletto=False):
        out = []
        for ch in testo:
            if maiuscoletto and ch.isalpha():
                out.append(ch.lower() + ".sc")
            else:
                out.append(self.cmap[ord(ch)])
        return out

    def avanzo(self, nome):
        return self.gs[nome].width

    def tracciato(self, nome, t):
        pen = SVGPathPen(self.gs, ntos=num)
        self.gs[nome].draw(TransformPen(pen, t))
        return pen.getCommands()


PAG = Faccia("texgyrepagella-regular.otf")
PAGI = Faccia("texgyrepagella-italic.otf")


def riga(faccia, nomi, corpo, spazio=0.0, x=0.0, y=0.0):
    """Una riga di glifi. Corpo in unità, spazio fra le lettere in em.
    Ritorna (tracciato, larghezza, posizioni) con le posizioni (x, avanzo)."""
    s = corpo / 1000.0
    pezzi, pos, cx = [], [], x
    for i, n in enumerate(nomi):
        pezzi.append(faccia.tracciato(n, Transform(s, 0, 0, -s, cx, y)))
        pos.append((cx, faccia.avanzo(n) * s))
        cx += faccia.avanzo(n) * s
        if i < len(nomi) - 1:
            cx += spazio * corpo
    return " ".join(pezzi), cx - x, pos


def larghezza(faccia, nomi, corpo, spazio=0.0):
    return riga(faccia, nomi, corpo, spazio)[1]


def punti(lista):
    return " ".join(f"{num(x)},{num(y)}" for x, y in lista)


def svg(vb, corpo, titolo, fondo=None):
    x, y, w, h = vb
    f = f'<rect x="{num(x)}" y="{num(y)}" width="{num(w)}" height="{num(h)}" fill="{fondo}"/>' if fondo else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{num(x)} {num(y)} {num(w)} {num(h)}" '
            f'width="{num(w)}" height="{num(h)}" role="img" aria-label="{titolo}">{f}{corpo}</svg>\n')


def scrivi(nome, testo):
    with open(os.path.join(QUI, nome), "w", encoding="utf-8", newline="\n") as f:
        f.write(testo)


def dado(cx, cy, lato, angolo, faccia):
    """Un dado a sei facce visto di fronte: (contorno, puntini) come tracciati."""
    r = lato * 0.17
    h = lato / 2
    t = Transform().translate(cx, cy).rotate(math.radians(angolo))

    def p(x, y):
        return t.transformPoint((x, y))

    # quadrato con gli angoli arrotondati, approssimati con curve quadratiche
    angoli = [(-h, -h), (h, -h), (h, h), (-h, h)]
    d = []
    for i, (ax, ay) in enumerate(angoli):
        sx = 1 if ax < 0 else -1
        sy = 1 if ay < 0 else -1
        a = p(ax, ay + sy * r) if i % 2 == 0 else p(ax + sx * r, ay)
        b = p(ax + sx * r, ay) if i % 2 == 0 else p(ax, ay + sy * r)
        c = p(ax, ay)
        d.append(("M" if i == 0 else "L") + f"{num(a[0])} {num(a[1])}Q{num(c[0])} {num(c[1])} {num(b[0])} {num(b[1])}")
    contorno = "".join(d) + "Z"
    q = lato * 0.27
    posti = {
        1: [(0, 0)], 2: [(-q, -q), (q, q)], 3: [(-q, -q), (0, 0), (q, q)],
        4: [(-q, -q), (q, -q), (-q, q), (q, q)], 5: [(-q, -q), (q, -q), (0, 0), (-q, q), (q, q)],
        6: [(-q, -q), (q, -q), (-q, 0), (q, 0), (-q, q), (q, q)],
    }[faccia]
    rp = lato * 0.095
    puntini = [(p(x, y), rp) for x, y in posti]
    return contorno, puntini


def cerchi(lista):
    return "".join(f'<circle cx="{num(c[0])}" cy="{num(c[1])}" r="{num(r)}"/>' for c, r in lista)


# ---------------------------------------------------------------------------
# 1. Il fascio: la parola attraversata da un cono di luce
# ---------------------------------------------------------------------------

def fascio():
    """Le lettere nel fascio della lanterna sono piene; le altre, al buio, solo contorno."""
    nomi = PAG.nomi("ESPOSIZIONE")
    parola, W, pos = riga(PAG, nomi, 100, 0.10)
    desc_n = PAG.nomi("NARRATIVE RPG ENGINE", maiuscoletto=True)
    dw = larghezza(PAG, desc_n, 25, 0.24)
    desc = riga(PAG, desc_n, 25, 0.24, (W - dw) / 2, 76)[0]
    apice = (W * 0.40, -158)
    cono = [apice, (W * 0.22, 40), (W * 0.74, 40)]
    vb = (-14, -176, W + 28, 270)
    x, y, w, h = vb
    box = f'maskUnits="userSpaceOnUse" x="{num(x)}" y="{num(y)}" width="{num(w)}" height="{num(h)}"'

    def lungo(p, q, fino):
        t = (fino - p[1]) / (q[1] - p[1])
        return (p[0] + (q[0] - p[0]) * t, fino)
    raggi = [lungo(apice, cono[1], -92), lungo(apice, cono[2], -92)]

    def forma(c, ident, tratto=1.9, raggio=1.1):
        return (f'<defs><mask id="{ident}d" {box}><polygon points="{punti(cono)}" fill="#fff"/></mask>'
                f'<mask id="{ident}f" {box}><rect x="{num(x)}" y="{num(y)}" width="{num(w)}" height="{num(h)}" fill="#fff"/>'
                f'<polygon points="{punti(cono)}" fill="#000"/></mask></defs>'
                f'<path d="{parola}" fill="none" stroke="{c["ink"]}" stroke-width="{tratto}" mask="url(#{ident}f)"/>'
                f'<path d="{parola}" fill="{c["ink"]}" mask="url(#{ident}d)"/>'
                f'<g stroke="{c["ink"]}" stroke-width="{raggio}" stroke-linecap="round">'
                f'<line x1="{num(apice[0])}" y1="{num(apice[1])}" x2="{num(raggi[0][0])}" y2="{num(raggi[0][1])}"/>'
                f'<line x1="{num(apice[0])}" y1="{num(apice[1])}" x2="{num(raggi[1][0])}" y2="{num(raggi[1][1])}"/></g>'
                f'<circle cx="{num(apice[0])}" cy="{num(apice[1])}" r="8.5" fill="{c["punto"]}"/>'
                f'<path d="{desc}" fill="{c["ink"]}"/>')

    for nome, c in COLORI.items():
        scrivi(f"p1-fascio-{nome}.svg", svg(vb, forma(c, "f"), "ESPOSIZIONE: Narrative RPG Engine"))

    # icona: la E sola, mezza nella luce
    e, _, _ = riga(PAG, ["E"], 112, 0, 22, 90)
    icono = [(30, 6), (44, 130), (150, 130)]
    for nome, c in COLORI.items():
        corpo = (f'<defs><clipPath id="ic"><rect width="100" height="100" rx="14"/></clipPath>'
                 f'<mask id="id" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><polygon points="{punti(icono)}" fill="#fff"/></mask>'
                 f'<mask id="if" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><polygon points="{punti(icono)}" fill="#000"/></mask></defs>'
                 f'<g clip-path="url(#ic)"><rect width="100" height="100" fill="{c["fondo"]}"/>'
                 f'<path d="{e}" fill="none" stroke="{c["ink"]}" stroke-width="2.6" mask="url(#if)"/>'
                 f'<path d="{e}" fill="{c["ink"]}" mask="url(#id)"/>'
                 f'<circle cx="30" cy="9" r="5.5" fill="{c["punto"]}"/></g>')
        scrivi(f"p1-fascio-icona-{nome}.svg", svg((0, 0, 100, 100), corpo, "ESPOSIZIONE"))

    # animazione: il contorno resta, il pieno e la luce li ritaglia il cono che si muove
    scrivi("p1-anim-contorno.svg", svg(vb, f'<path d="{parola}" fill="none" stroke="{CARTA}" stroke-opacity="0.55" stroke-width="1.6"/>', "ESPOSIZIONE"))
    scrivi("p1-anim-pieno.svg", svg(vb, f'<path d="{parola}" fill="{CARTA}"/>', "ESPOSIZIONE"))
    scrivi("p1-anim-luce.svg", svg(vb, f'<rect x="{num(x)}" y="{num(y)}" width="{num(w)}" height="{num(h)}" fill="{CARTA}" fill-opacity="0.07"/>', ""))
    scrivi("p1-anim-descrittore.svg", svg(vb, f'<path d="{desc}" fill="{CARTA}"/>', "Narrative RPG Engine"))

    def pc(p):
        return [round((p[0] - x) / w * 100, 2), round((p[1] - y) / h * 100, 2)]
    misure = {"cono": [pc(p) for p in cono], "larghezza": round(w, 1), "altezza": h}

    strati = {"cono": f'<polygon points="{punti(cono)}"/>', "parola": f'<path d="{parola}"/>',
              "luce": (f'<circle cx="{num(apice[0])}" cy="{num(apice[1])}" r="8.5"/>'
                       f'<g stroke="#000" stroke-width="1.6"><line x1="{num(apice[0])}" y1="{num(apice[1])}" x2="{num(raggi[0][0])}" y2="{num(raggi[0][1])}"/>'
                       f'<line x1="{num(apice[0])}" y1="{num(apice[1])}" x2="{num(raggi[1][0])}" y2="{num(raggi[1][1])}"/></g>'),
              "desc": f'<path d="{desc}"/>'}
    return vb, strati, misure


# ---------------------------------------------------------------------------
# 2. I tre gradi: una E con tre bracci, vuoto, mezzo, pieno
# ---------------------------------------------------------------------------

ALTO = 130


def bracci():
    """Il monogramma, alto 130: l'asta e i tre bracci, con la punta tagliata."""
    asta = [(0, -ALTO), (20, -ALTO), (20, 0), (0, 0)]

    def braccio(y0, lun):
        return [(26, y0), (26 + lun + 7, y0), (26 + lun, y0 + 18), (26, y0 + 18)]
    b1, b2, b3 = braccio(-ALTO, 56), braccio(-74, 46), braccio(-18, 60)
    meta = [(26, -65), (b2[1][0] - 3.5, -65), b2[2], b2[3]]
    return asta, b1, b2, b3, meta


def gradi():
    asta, b1, b2, b3, meta = bracci()
    tratto = 3.4
    clip = (f'<clipPath id="C"><polygon points="{punti(b1)}"/><polygon points="{punti(b2)}"/>'
            f'<polygon points="{punti(b3)}"/></clipPath>')

    def vuoto(b):
        return f'<polygon points="{punti(b)}" fill="none" stroke-width="{tratto * 2}" clip-path="url(#C)"/>'

    def mono(c):
        return (f'<g stroke="{c}" fill="{c}"><polygon points="{punti(asta)}" stroke="none"/>{vuoto(b1)}{vuoto(b2)}'
                f'<polygon points="{punti(meta)}" stroke="none"/><polygon points="{punti(b3)}" stroke="none"/></g>')

    nomi = PAG.nomi("ESPOSIZIONE")
    gx = 128
    parola, W, _ = riga(PAG, nomi, 66, 0.13, gx, -60)
    desc_n = PAG.nomi("NARRATIVE RPG ENGINE", maiuscoletto=True)
    desc = riga(PAG, desc_n, 21, 0.31, gx + 1, -4)[0]
    vb = (-16, -148, gx + W + 30, 164)
    filetto = f'<rect x="{gx - 22}" y="-124" width="1.4" height="120"/>'

    for nome, c in COLORI.items():
        corpo = (f'<defs>{clip}</defs>{mono(c["ink"])}'
                 f'<g fill="{c["ink"]}"><path d="{parola}"/><path d="{desc}"/>{filetto}</g>')
        scrivi(f"p2-gradi-{nome}.svg", svg(vb, corpo, "ESPOSIZIONE: Narrative RPG Engine"))
        icona = (f'<defs><clipPath id="ic"><rect width="100" height="100" rx="14"/></clipPath>{clip}</defs>'
                 f'<g clip-path="url(#ic)"><rect width="100" height="100" fill="{c["fondo"]}"/></g>'
                 f'<g transform="translate(23 82.5) scale(0.5)">{mono(c["ink"])}</g>')
        scrivi(f"p2-gradi-icona-{nome}.svg", svg((0, 0, 100, 100), icona, "ESPOSIZIONE"))

    # animazione: tutti i bracci vuoti, poi il mezzo si riempie a metà e l'ultimo tutto
    base = (f'<defs>{clip}</defs><g stroke="{CARTA}" fill="{CARTA}"><polygon points="{punti(asta)}" stroke="none"/>'
            f'{vuoto(b1)}{vuoto(b2)}{vuoto(b3)}</g>')
    scrivi("p2-anim-base.svg", svg(vb, base, "ESPOSIZIONE"))
    scrivi("p2-anim-meta.svg", svg(vb, f'<polygon points="{punti(meta)}" fill="{TERRA_SCURO}"/>', ""))
    scrivi("p2-anim-pieno.svg", svg(vb, f'<polygon points="{punti(b3)}" fill="{CARTA}"/>', ""))
    scrivi("p2-anim-parola.svg", svg(vb, f'<g fill="{CARTA}"><path d="{parola}"/><path d="{desc}"/>{filetto}</g>', "ESPOSIZIONE"))

    x, y, w, h = vb
    misure = {"larghezza": round(w, 1), "altezza": h,
              "meta": [round((26 - x) / w * 100, 2), round((b2[1][0] - x) / w * 100, 2)],
              "pieno": [round((26 - x) / w * 100, 2), round((b3[1][0] - x) / w * 100, 2)]}

    # per il cuoio: il monogramma e la parola si impilano
    cw = larghezza(PAG, nomi, 66, 0.16)
    cparola = riga(PAG, nomi, 66, 0.16, -cw / 2, 0)[0]
    dw = larghezza(PAG, desc_n, 21, 0.31)
    cdesc = riga(PAG, desc_n, 21, 0.31, -dw / 2, 44)[0]
    strati = {"asta": f'<polygon points="{punti(asta)}"/>',
              "b1": f'<polygon points="{punti(b1)}"/>', "b2": f'<polygon points="{punti(b2)}"/>',
              "b3": f'<polygon points="{punti(b3)}"/>', "meta": f'<polygon points="{punti(meta)}"/>',
              "tratto": tratto, "parola": f'<path d="{cparola}"/><path d="{cdesc}"/>',
              "vb_mono": (0, -ALTO, b3[1][0], ALTO), "vb_parola": (-cw / 2, -50, cw, 100)}
    return vb, strati, misure


# ---------------------------------------------------------------------------
# 3. La marca: un sigillo con le quattro domande e due dadi
# ---------------------------------------------------------------------------

def sigillo_testo(r=77.0, corpo=17.0):
    nomi = []
    for i, parola in enumerate(["PUOI", "RIESCI", "COSTA", "DOPO"]):
        nomi += PAG.nomi(parola) + ["space", "periodcentered", "space"]
    s = corpo / 1000.0
    larg = [PAG.avanzo(n) * s for n in nomi]
    giro = 2 * math.pi * r
    extra = (giro - sum(larg)) / len(nomi)
    pezzi, a = [], 0.0
    for n, lw in zip(nomi, larg):
        centro = (a + (lw + extra) / 2) / giro * 2 * math.pi
        if n != "space":
            t = Transform().rotate(centro).translate(-lw / 2, -r).scale(s, -s)
            pezzi.append(PAG.tracciato(n, t))
        a += lw + extra
    return " ".join(pezzi)


def marca():
    testo = sigillo_testo()
    d1 = dado(-25, -1, 44, -15, 3)
    d2 = dado(26, 5, 44, 11, 4)
    anelli = ('<circle r="99" fill="none" stroke-width="3"/><circle r="94" fill="none" stroke-width="1"/>'
              '<circle r="70" fill="none" stroke-width="1.6"/>')

    def dadi(c, punto, ident):
        out = ""
        for k, (cont, pt) in enumerate((d1, d2)):
            out += (f'<mask id="{ident}{k}" maskUnits="userSpaceOnUse" x="-100" y="-100" width="200" height="200">'
                    f'<path d="{cont}" fill="#fff"/><g fill="#000">{cerchi(pt)}</g></mask>')
        out = f"<defs>{out}</defs>"
        out += f'<path d="{d1[0]}" fill="{c}" mask="url(#{ident}0)"/><path d="{d2[0]}" fill="{c}" mask="url(#{ident}1)"/>'
        out += f'<circle cx="{num(d1[1][1][0][0])}" cy="{num(d1[1][1][0][1])}" r="{num(d1[1][1][1])}" fill="{punto}"/>'
        return out

    nomi = PAG.nomi("ESPOSIZIONE")
    W = larghezza(PAG, nomi, 50, 0.16)
    parola = riga(PAG, nomi, 50, 0.16, -W / 2, 170)[0]
    desc_n = PAG.nomi("NARRATIVE RPG ENGINE", maiuscoletto=True)
    dw = larghezza(PAG, desc_n, 17, 0.30)
    desc = riga(PAG, desc_n, 17, 0.30, -dw / 2, 206)[0]
    vb = (-W / 2 - 16, -116, W + 32, 340)

    for nome, c in COLORI.items():
        corpo = (f'<g stroke="{c["ink"]}">{anelli}</g><path d="{testo}" fill="{c["ink"]}"/>{dadi(c["ink"], c["punto"], "m")}'
                 f'<g fill="{c["ink"]}"><path d="{parola}"/><path d="{desc}"/></g>')
        scrivi(f"p3-marca-{nome}.svg", svg(vb, corpo, "ESPOSIZIONE: Narrative RPG Engine"))
        icona = (f'<defs><clipPath id="ic"><rect width="100" height="100" rx="14"/></clipPath></defs>'
                 f'<g clip-path="url(#ic)"><rect width="100" height="100" fill="{c["fondo"]}"/></g>'
                 f'<g transform="translate(50 50) scale(0.44)"><circle r="99" fill="none" stroke="{c["ink"]}" stroke-width="7"/>'
                 f'{dadi(c["ink"], c["punto"], "i")}</g>')
        scrivi(f"p3-marca-icona-{nome}.svg", svg((0, 0, 100, 100), icona, "ESPOSIZIONE"))

    scrivi("p3-anim-anello.svg", svg(vb, f'<g stroke="{CARTA}">{anelli}</g><path d="{testo}" fill="{CARTA}"/>', ""))
    for k, (cont, pt) in enumerate((d1, d2)):
        m = (f'<defs><mask id="d" maskUnits="userSpaceOnUse" x="-100" y="-100" width="200" height="200">'
             f'<path d="{cont}" fill="#fff"/><g fill="#000">{cerchi(pt)}</g></mask></defs>'
             f'<path d="{cont}" fill="{CARTA}" mask="url(#d)"/>')
        if k == 0:
            m += f'<circle cx="{num(pt[1][0][0])}" cy="{num(pt[1][0][1])}" r="{num(pt[1][1])}" fill="{TERRA_SCURO}"/>'
        scrivi(f"p3-anim-dado{k + 1}.svg", svg(vb, m, ""))
    scrivi("p3-anim-parola.svg", svg(vb, f'<g fill="{CARTA}"><path d="{parola}"/><path d="{desc}"/></g>', "ESPOSIZIONE"))

    x, y, w, h = vb
    misure = {"larghezza": w, "altezza": h, "centro": [round(-x / w * 100, 2), round(-y / h * 100, 2)],
              "dado1": [round((-25 - x) / w * 100, 2), round((-1 - y) / h * 100, 2)],
              "dado2": [round((26 - x) / w * 100, 2), round((5 - y) / h * 100, 2)]}
    strati = {"anelli": f'<g fill="none" stroke="#000">{anelli}</g><path d="{testo}"/>',
              "dadi": f'<path d="{d1[0]}"/><path d="{d2[0]}"/>', "puntini": cerchi(d1[1]) + cerchi(d2[1]),
              "parola": f'<path d="{parola}"/>', "desc": f'<path d="{desc}"/>'}
    return vb, strati, misure


# ---------------------------------------------------------------------------
# 4. I due punti: in minuscolo, con due dadi al posto dei puntini delle i
# ---------------------------------------------------------------------------

def punti_i():
    corpo = 120
    s = corpo / 1000.0
    nomi = PAG.nomi("esposizione")
    nomi = ["dotlessi" if n == "i" else n for n in nomi]
    parola, W, pos = riga(PAG, nomi, corpo, 0.005)
    centri = [(pos[k][0] + 146 * s, -592 * s) for k in (5, 7)]
    lato = 100 * s * 1.45
    d1 = dado(centri[0][0], centri[0][1] - 2, lato, 17, 3)
    d2 = dado(centri[1][0], centri[1][1] - 2, lato, -11, 4)
    desc_n = PAGI.nomi("narrative rpg engine")
    dw = larghezza(PAGI, desc_n, 26, 0.02)
    desc = riga(PAGI, desc_n, 26, 0.02, W - dw - 4, 62)[0]
    vb = (-14, -112, W + 28, 196)

    def due(c1, c2, ident):
        out = ""
        for k, (cont, pt) in enumerate((d1, d2)):
            out += (f'<mask id="{ident}{k}" maskUnits="userSpaceOnUse" x="-20" y="-120" width="{num(W + 40)}" height="200">'
                    f'<path d="{cont}" fill="#fff"/><g fill="#000">{cerchi(pt)}</g></mask>')
        return (f'<defs>{out}</defs><path d="{d1[0]}" fill="{c1}" mask="url(#{ident}0)"/>'
                f'<path d="{d2[0]}" fill="{c2}" mask="url(#{ident}1)"/>')

    for nome, c in COLORI.items():
        corpo_svg = f'<path d="{parola}" fill="{c["ink"]}"/>{due(c["punto"], c["ink"], "p")}<path d="{desc}" fill="{c["ink"]}"/>'
        scrivi(f"p4-punti-{nome}.svg", svg(vb, corpo_svg, "esposizione: narrative rpg engine"))
        # icona: una i sola, con il dado per puntino
        ic = 0.112
        i_sola, _, _ = riga(PAG, ["dotlessi"], ic * 1000, 0, 50 - 146 * ic, 88)
        di = dado(50, 88 - 592 * ic - 6, 100 * ic * 1.7, 17, 3)
        icona = (f'<defs><clipPath id="ic"><rect width="100" height="100" rx="14"/></clipPath>'
                 f'<mask id="im" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><path d="{di[0]}" fill="#fff"/><g fill="#000">{cerchi(di[1])}</g></mask></defs>'
                 f'<g clip-path="url(#ic)"><rect width="100" height="100" fill="{c["fondo"]}"/></g>'
                 f'<path d="{i_sola}" fill="{c["ink"]}"/><path d="{di[0]}" fill="{c["punto"]}" mask="url(#im)"/>')
        scrivi(f"p4-punti-icona-{nome}.svg", svg((0, 0, 100, 100), icona, "ESPOSIZIONE"))

    scrivi("p4-anim-parola.svg", svg(vb, f'<g fill="{CARTA}"><path d="{parola}"/><path d="{desc}"/></g>', "esposizione"))
    for k, (cont, pt) in enumerate((d1, d2)):
        colore = TERRA_SCURO if k == 0 else CARTA
        m = (f'<defs><mask id="d" maskUnits="userSpaceOnUse" x="-20" y="-120" width="{num(W + 40)}" height="200">'
             f'<path d="{cont}" fill="#fff"/><g fill="#000">{cerchi(pt)}</g></mask></defs>'
             f'<path d="{cont}" fill="{colore}" mask="url(#d)"/>')
        scrivi(f"p4-anim-dado{k + 1}.svg", svg(vb, m, ""))

    x, y, w, h = vb
    misure = {"larghezza": w, "altezza": h,
              "dado1": [round((centri[0][0] - x) / w * 100, 2), round((centri[0][1] - 2 - y) / h * 100, 2)],
              "dado2": [round((centri[1][0] - x) / w * 100, 2), round((centri[1][1] - 2 - y) / h * 100, 2)]}
    strati = {"parola": f'<path d="{parola}"/>', "dadi": f'<path d="{d1[0]}"/><path d="{d2[0]}"/>',
              "puntini": cerchi(d1[1]) + cerchi(d2[1]), "desc": f'<path d="{desc}"/>'}
    return vb, strati, misure


# ---------------------------------------------------------------------------
# Il cuoio: una copertina marrone antica, con l'oro a caldo e l'impressione a secco
# ---------------------------------------------------------------------------

CW, CH = 900, 1200


def maschera(frammento, vb, centro, larg, stroke=None):
    """Rasterizza un frammento nero alla posizione voluta della copertina. Ritorna alfa 0..1."""
    x, y, w, h = vb
    k = larg / w
    dx, dy = centro[0] - (x + w / 2) * k, centro[1] - (y + h / 2) * k
    extra = f' stroke="#000" stroke-width="{stroke}" fill="none"' if stroke else ' fill="#000"'
    doc = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}">'
           f'<g transform="translate({num(dx)} {num(dy)}) scale({k:.5f})"{extra}>{frammento}</g></svg>')
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
    out = out * (1 - 0.6 * forza * ombra[..., None]) + 0.08 * forza * luce[..., None]
    return out


def oro(rng):
    yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
    t = 0.5 + 0.5 * np.sin((xx * 0.55 + yy) / CW * 6.5 + sfoca(rumore(rng, 40), 6) * 4)
    t = t[..., None]
    scuro = np.array([158, 112, 42], np.float32) / 255
    chiaro = np.array([252, 226, 156], np.float32) / 255
    c = scuro * (1 - t) + chiaro * t
    return c * (0.88 + 0.22 * rumore(rng, 1)[..., None])


def copertina(nome, oro_m, secco_m, seme=11):
    rng = np.random.default_rng(seme)
    col = pelle(rng)
    # la cornice a secco, due filetti
    cornice = np.zeros((CH, CW), np.float32)
    for inset, sp in ((54, 3), (66, 1.5)):
        f = np.zeros((CH, CW), np.float32)
        a, b = int(inset), int(inset + sp)
        f[a:CH - a, a:b] = 1
        f[a:CH - a, CW - b:CW - a] = 1
        f[a:b, a:CW - a] = 1
        f[CH - b:CH - a, a:CW - a] = 1
        cornice = np.maximum(cornice, f)
    cornice = sfoca(cornice, 0.6)
    secco = np.maximum(secco_m, cornice)
    col = impressione(col, secco, 1.0)
    usura = np.clip((sfoca(rumore(rng, 2), 0.6) - 0.74) * 5, 0, 1) * 0.35
    g = oro_m * (1 - usura)
    col = impressione(col, oro_m, 0.7)
    foglia = impressione(oro(rng), oro_m, 0.25)
    col = col * (1 - g[..., None]) + foglia * g[..., None]
    img = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8))
    img.save(os.path.join(QUI, nome), quality=86, optimize=True)


def cuoio_fascio(vb, s):
    m = lambda f: maschera(f, vb, (CW / 2, 500), 680)
    cono, parola = m(s["cono"]), m(s["parola"])
    oro_m = np.clip(parola * cono + m(s["luce"]) + m(s["desc"]), 0, 1)
    secco_m = parola * (1 - cono)
    copertina("p1-fascio-cuoio.jpg", oro_m, secco_m)


def cuoio_gradi(vb, s):
    vm = s["vb_mono"]
    m = lambda f, st=None: maschera(f, vm, (CW / 2, 470), 236, st)

    def vuoto(n):
        return np.clip(m(s[n]) * m(s[n], s["tratto"] * 2), 0, 1)
    mono = m(s["asta"]) + vuoto("b1") + vuoto("b2") + m(s["meta"]) + m(s["b3"])
    parola = maschera(s["parola"], s["vb_parola"], (CW / 2, 760), 560)
    oro_m = np.clip(mono + parola, 0, 1)
    copertina("p2-gradi-cuoio.jpg", oro_m, np.zeros_like(oro_m))


def cuoio_marca(vb, s):
    m = lambda f: maschera(f, vb, (CW / 2, 590), 660)
    anelli = maschera(s["anelli"], vb, (CW / 2, 590), 660)
    dadi = m(s["dadi"]) * (1 - m(s["puntini"]))
    oro_m = np.clip(anelli + dadi + m(s["parola"]) + m(s["desc"]), 0, 1)
    copertina("p3-marca-cuoio.jpg", oro_m, np.zeros_like(oro_m))


def cuoio_punti(vb, s):
    m = lambda f: maschera(f, vb, (CW / 2, 520), 660)
    dadi = m(s["dadi"]) * (1 - m(s["puntini"]))
    oro_m = np.clip(m(s["parola"]) + dadi + m(s["desc"]), 0, 1)
    copertina("p4-punti-cuoio.jpg", oro_m, np.zeros_like(oro_m))


if __name__ == "__main__":
    misure = {}
    vb, s, misure["fascio"] = fascio()
    cuoio_fascio(vb, s)
    vb, s, misure["gradi"] = gradi()
    cuoio_gradi(vb, s)
    vb, s, misure["marca"] = marca()
    cuoio_marca(vb, s)
    vb, s, misure["punti"] = punti_i()
    cuoio_punti(vb, s)
    print(json.dumps(misure, indent=1))
