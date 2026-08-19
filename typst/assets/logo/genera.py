# -*- coding: utf-8 -*-
"""
ESPOSIZIONE - logotipo, seconda serie.
Maiuscole TeX Gyre Pagella estratte come tracciati dal font della specifica;
d20 in filo sottile come emblema. Descrittore: NARRATIVE RPG ENGINE.
"""
import io, math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

import os
FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                     "..", "..", "fonts") + os.sep


class Face(object):
    def __init__(self, path):
        self.f = TTFont(path)
        self.gs = self.f.getGlyphSet()
        self.upm = self.f["head"].unitsPerEm
        self.cap = self.f["OS/2"].sCapHeight or 700
        self.cmap = self.f.getBestCmap()

    def glyph(self, ch):
        name = self.cmap[ord(ch)]
        pen = SVGPathPen(self.gs)
        self.gs[name].draw(pen)
        return pen.getCommands(), self.gs[name].width


PAG = Face(FONTS + "texgyrepagella-regular.otf")
PAGB = Face(FONTS + "texgyrepagella-bold.otf")
HER = Face(FONTS + "texgyreheros-regular.otf")


def set_text(face, text, em, track_em, color="var(--ink)"):
    """Compone una riga; track in em. Ritorna (markup, larghezza)."""
    s = em / face.upm
    x = 0.0
    parts = []
    for ch in text:
        if ch == " ":
            x += 0.30 * em + track_em * em
            continue
        d, adv = face.glyph(ch)
        if d:
            parts.append('<path transform="translate(%.2f 0) scale(%.6f %.6f)" '
                         'd="%s" fill="%s"/>' % (x, s, -s, d, color))
        x += adv * s + track_em * em
    return "".join(parts), x - track_em * em


def set_text_justified(face, text, em, target_w, color="var(--ink)"):
    """Riga giustificata a target_w distribuendo la traccia."""
    n_gaps = len(text) - 1
    _, nat = set_text(face, text, em, 0.0)
    track = (target_w - nat) / n_gaps / em
    return set_text(face, text, em, track, color)


# ── il d20: esaedro di filo, punta in alto, col punto del dado ───
def d20(R=100.0, sw=4.6, color="var(--ink)", pip="var(--accent)",
        pip_r=0.15):
    hx = []
    for k in range(6):
        a = math.radians(90 + 60 * k)
        hx.append((R * math.cos(a), -R * math.sin(a)))
    r = 0.545 * R
    tri = []
    for a_deg in (90, 210, 330):
        a = math.radians(a_deg)
        tri.append((r * math.cos(a), -r * math.sin(a)))
    seg = []
    # esagono
    pts = " ".join("%.1f %.1f" % p for p in hx)
    seg.append('<polygon points="%s" fill="none" stroke="%s" stroke-width="%g" '
               'stroke-linejoin="round"/>' % (pts, color, sw))
    # faccia frontale
    pts = " ".join("%.1f %.1f" % p for p in tri)
    seg.append('<polygon points="%s" fill="none" stroke="%s" stroke-width="%g" '
               'stroke-linejoin="round"/>' % (pts, color, sw))
    # spigoli radiali: vertice della faccia -> vertice dell'esagono
    for (tx, ty), hi in zip(tri, (0, 2, 4)):
        seg.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" '
                   'stroke="%s" stroke-width="%g"/>'
                   % (tx, ty, hx[hi][0], hx[hi][1], color, sw))
    # spigoli obliqui: ogni vertice pari dell'esagono -> i due vertici vicini
    for hi, (t1, t2) in ((1, (0, 1)), (3, (1, 2)), (5, (2, 0))):
        for t in (t1, t2):
            seg.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" '
                       'stroke="%s" stroke-width="%g"/>'
                       % (hx[hi][0], hx[hi][1], tri[t][0], tri[t][1],
                          color, sw))
    # il punto del dado, nel baricentro della faccia
    seg.append('<circle cx="0" cy="0" r="%.1f" fill="%s"/>' % (pip_r * R, pip))
    return "".join(seg)


STYLE = ""


def svg(vb, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" role="img">'
            '\n%s\n</svg>' % (vb, body))


WORD = "ESPOSIZIONE"
DESC = "NARRATIVE RPG ENGINE"
EM = 100.0                       # corpo del titolo
TRACK = 0.075                    # traccia del titolo, in em


# ════════════════════════════════════════════════════════════════
# P1 - L'emblema (verticale, da frontespizio)
# ════════════════════════════════════════════════════════════════
def p1():
    word, ww = set_text(PAG, WORD, EM, TRACK)
    die_h = 132.0
    cx = ww / 2.0
    die = ('<g transform="translate(%.1f %.1f) scale(%.4f)">%s</g>'
           % (cx, die_h / 2, die_h / 200.0, d20(sw=5.4)))
    y_word = die_h + 66 + PAG.cap * EM / PAG.upm   # baseline del titolo
    wgrp = '<g transform="translate(0 %.1f)">%s</g>' % (y_word, word)
    y_rule = y_word + 34
    rule = ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" '
            'stroke="var(--ink)" stroke-width="2.2"/>'
            % (cx - ww * 0.5, y_rule, cx + ww * 0.5, y_rule))
    dem = 28.0
    dsc, dw = set_text_justified(HER, DESC, dem, ww * 0.86)
    y_dsc = y_rule + 30 + HER.cap * dem / HER.upm
    dgrp = ('<g transform="translate(%.1f %.1f)">%s</g>'
            % (cx - dw / 2, y_dsc, dsc))
    h = y_dsc + 18
    return svg("-20 -6 %.0f %.0f" % (ww + 40, h + 10),
               die + wgrp + rule + dgrp)


# ════════════════════════════════════════════════════════════════
# P2 - In linea (orizzontale, da testata)
# ════════════════════════════════════════════════════════════════
def p2():
    word, ww = set_text(PAG, WORD, EM, TRACK)
    caph = PAG.cap * EM / PAG.upm            # ~ altezza maiuscola
    die_h = caph * 1.34
    die = ('<g transform="translate(%.1f %.1f) scale(%.4f)">%s</g>'
           % (die_h / 2, caph / 2, die_h / 200.0, d20(sw=6.2)))
    x_w = die_h + 44
    wgrp = ('<g transform="translate(%.1f %.1f)">%s</g>'
            % (x_w, caph, word))
    dem = 26.0
    dsc, dw = set_text_justified(HER, DESC, dem, ww)
    y_dsc = caph + 46 + HER.cap * dem / HER.upm
    dgrp = '<g transform="translate(%.1f %.1f)">%s</g>' % (x_w, y_dsc, dsc)
    return svg("-8 %.0f %.0f %.0f" % (-die_h * 0.20,
                                      x_w + ww + 16, y_dsc + 24),
               die + wgrp + dgrp)


# ════════════════════════════════════════════════════════════════
# P3 - La O che tira (il dado dentro la parola)
# ════════════════════════════════════════════════════════════════
def p3(face=PAG):
    em, track = EM, TRACK
    s = em / face.upm
    caph = face.cap * s
    x = 0.0
    parts = []
    o_adv = face.glyph("O")[1] * s
    for ch in WORD[:3] + "_" + WORD[4:]:     # la prima O diventa il dado
        if ch == "_":
            die_h = caph * 1.06
            parts.append('<g transform="translate(%.1f %.1f) scale(%.4f)">%s</g>'
                         % (x + o_adv / 2, caph / 2, die_h / 200.0,
                            d20(sw=8.4, pip_r=0.17)))
            x += o_adv + track * em
            continue
        d, adv = face.glyph(ch)
        parts.append('<path transform="translate(%.2f %.1f) scale(%.6f %.6f)" '
                     'd="%s" fill="var(--ink)"/>' % (x, caph, s, -s, d))
        x += adv * s + track * em
    ww = x - track * em
    dem = 26.0
    dsc, dw = set_text_justified(HER, DESC, dem, ww)
    y_dsc = caph + 46 + HER.cap * dem / HER.upm
    dgrp = '<g transform="translate(0 %.1f)">%s</g>' % (y_dsc, dsc)
    return svg("-8 -14 %.0f %.0f" % (ww + 16, y_dsc + 26),
               "".join(parts) + dgrp)


# ════════════════════════════════════════════════════════════════
# P4 - La copertina (fra le righe, con l'emblema sul filo)
# ════════════════════════════════════════════════════════════════
def p4():
    word, ww = set_text(PAG, WORD, EM, TRACK)
    caph = PAG.cap * EM / PAG.upm
    cx = ww / 2.0
    # riga alta con il dado incastonato al centro
    die_h = 96.0
    y_top = die_h / 2.0
    gap = die_h * 0.72
    rules_top = ('<line x1="0" y1="%.1f" x2="%.1f" y2="%.1f" stroke="var(--ink)" stroke-width="2.6"/>'
                 '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="var(--ink)" stroke-width="2.6"/>'
                 % (y_top, cx - gap, y_top, cx + gap, y_top, ww, y_top))
    die = ('<g transform="translate(%.1f %.1f) scale(%.4f)">%s</g>'
           % (cx, y_top, die_h / 200.0, d20(sw=7.0)))
    y_word = die_h + 58 + caph
    wgrp = '<g transform="translate(0 %.1f)">%s</g>' % (y_word, word)
    dem = 26.0
    dsc, dw = set_text_justified(HER, DESC, dem, ww)
    y_dsc = y_word + 48 + HER.cap * dem / HER.upm
    dgrp = '<g transform="translate(0 %.1f)">%s</g>' % (y_dsc, dsc)
    y_bot = y_dsc + 34
    rule_bot = ('<line x1="0" y1="%.1f" x2="%.1f" y2="%.1f" '
                'stroke="var(--ink)" stroke-width="2.6"/>' % (y_bot, ww, y_bot))
    return svg("-14 -8 %.0f %.0f" % (ww + 28, y_bot + 12),
               rules_top + die + wgrp + dgrp + rule_bot)


def icona():
    return svg("-110 -110 220 220",
               '<g>%s</g>' % d20(R=96.0, sw=7.2, pip_r=0.16))


# ════════════════════════════════════════════════════════════════
# Serie STUDIO — il logotipo dello strumento (ESPOSIZIONE Studio).
# Il qualificatore prende il posto del descrittore e parla più forte:
# STUDIO in Pagella, giustificato alla larghezza della parola.
# ════════════════════════════════════════════════════════════════
SUB = "STUDIO"


def p1s():
    """Emblema Studio (verticale, da schermata di titolo)."""
    word, ww = set_text(PAG, WORD, EM, TRACK)
    die_h = 132.0
    cx = ww / 2.0
    die = ('<g transform="translate(%.1f %.1f) scale(%.4f)">%s</g>'
           % (cx, die_h / 2, die_h / 200.0, d20(sw=5.4)))
    y_word = die_h + 66 + PAG.cap * EM / PAG.upm
    wgrp = '<g transform="translate(0 %.1f)">%s</g>' % (y_word, word)
    y_rule = y_word + 34
    rule = ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" '
            'stroke="var(--ink)" stroke-width="2.2"/>'
            % (cx - ww * 0.5, y_rule, cx + ww * 0.5, y_rule))
    sem = 44.0
    sub, sw_ = set_text_justified(PAG, SUB, sem, ww * 0.86)
    y_sub = y_rule + 32 + PAG.cap * sem / PAG.upm
    sgrp = ('<g transform="translate(%.1f %.1f)">%s</g>'
            % (cx - sw_ / 2, y_sub, sub))
    h = y_sub + 18
    return svg("-20 -6 %.0f %.0f" % (ww + 40, h + 10),
               die + wgrp + rule + sgrp)


def p2s():
    """In linea Studio (orizzontale, da testata)."""
    word, ww = set_text(PAG, WORD, EM, TRACK)
    caph = PAG.cap * EM / PAG.upm
    die_h = caph * 1.34
    die = ('<g transform="translate(%.1f %.1f) scale(%.4f)">%s</g>'
           % (die_h / 2, caph / 2, die_h / 200.0, d20(sw=6.2)))
    x_w = die_h + 44
    wgrp = ('<g transform="translate(%.1f %.1f)">%s</g>'
            % (x_w, caph, word))
    sem = 54.0
    sub, sw_ = set_text_justified(PAG, SUB, sem, ww)
    y_sub = caph + 48 + PAG.cap * sem / PAG.upm
    sgrp = '<g transform="translate(%.1f %.1f)">%s</g>' % (x_w, y_sub, sub)
    return svg("-8 %.0f %.0f %.0f" % (-die_h * 0.20,
                                      x_w + ww + 16, y_sub + 24),
               die + wgrp + sgrp)


PROPS = {"1": p1(), "2": p2(), "3": p3(), "4": p4(), "I": icona(),
         "S1": p1s(), "S2": p2s()}

if __name__ == "__main__":
    # scrive le forme, con i colori come variabili CSS, accanto a questo file
    import os
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "")
    for k, s in PROPS.items():
        io.open(out + "sorgente-%s.svg" % k, "w", encoding="utf-8").write(s)
    print("sette forme rigenerate")
