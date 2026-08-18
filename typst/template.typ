// ─────────────────────────────────────────────────────────────
//  ESPOSIZIONE — impianto tipografico condiviso
// ─────────────────────────────────────────────────────────────

#let ink     = rgb("#17150f")
#let accent  = rgb("#7d2b1a")
#let muted   = rgb("#6d6759")
#let hairline= rgb("#cbc3b3")
#let tint    = rgb("#f4f1e8")
#let tint2   = rgb("#efece2")

#let SERIF = "TeX Gyre Pagella"
#let SANS  = "TeX Gyre Heros"
#let MONO  = "DejaVu Sans Mono"

// ── elementi ────────────────────────────────────────────────

#let term(b) = text(weight: "bold")[#b]
#let mono(b) = text(font: MONO, size: 0.88em, fill: rgb("#3b352a"))[#b]

#let anchor(lvl, b) = {
  if lvl <= 2 { heading(level: lvl, outlined: true, bookmarked: true)[#b] }
}

#let h1(b, occhiello: "PARTE") = {
  pagebreak(weak: true)
  anchor(1, b)
  block(spacing: 22pt)[
    #text(font: SANS, size: 8.5pt, tracking: 0.22em, fill: accent)[#occhiello]
    #v(4pt)
    #text(font: SANS, size: 19pt, weight: "bold", tracking: 0.01em, fill: ink,
           hyphenate: false)[#b]
    #v(7pt)
    #line(length: 100%, stroke: 0.9pt + accent)
  ]
}

#let h2(b) = {
  v(20pt, weak: true)
  anchor(2, b)
  block(spacing: 8.5pt, breakable: false, sticky: true)[
    #text(font: SANS, size: 12.5pt, weight: "bold", fill: ink)[#b]
  ]
}

#let h3(b) = {
  v(13pt, weak: true)
  block(spacing: 6pt, breakable: false, sticky: true)[
    #text(font: SANS, size: 10pt, weight: "bold", fill: rgb("#4a4438"))[#b]
  ]
}

#let h4(b) = {
  v(9pt, weak: true)
  block(spacing: 4.5pt, breakable: false, sticky: true)[
    #text(font: SERIF, size: 11pt, style: "italic", fill: ink)[#b]
  ]
}

#let pgf(b) = block(spacing: 13.5pt)[#b]

#let regola(b) = block(
  spacing: 17pt, width: 100%, breakable: true,
  fill: tint, stroke: (left: 2.4pt + accent),
  inset: (left: 13pt, right: 12pt, top: 9pt, bottom: 9pt),
)[
  #set text(size: 10.4pt, fill: rgb("#221f16"))
  #set par(leading: 0.72em)
  #b
]

#let avviso(b) = block(
  spacing: 16pt, width: 100%, breakable: true,
  stroke: (left: 1.2pt + hairline),
  inset: (left: 11pt, right: 0pt, top: 3pt, bottom: 3pt),
)[
  #set text(size: 9.2pt, fill: muted)
  #set par(leading: 0.66em, justify: true)
  #b
]

#let codeblock(b) = block(
  spacing: 16pt, width: 100%, fill: tint2,
  inset: (x: 12pt, y: 10pt), radius: 1pt, breakable: false,
)[
  #set text(font: MONO, size: 8.6pt, fill: rgb("#332e24"))
  #set par(leading: 0.6em, justify: false)
  #b
]

#let elenco(..items) = block(spacing: 14pt)[
  #set par(leading: 0.7em)
  #list(indent: 2pt, body-indent: 7pt, spacing: 7pt, marker: text(fill: accent)[•],
        ..items.pos())
]

#let numerato(..items) = block(spacing: 14pt)[
  #set par(leading: 0.7em)
  #enum(indent: 2pt, body-indent: 8pt, spacing: 7pt, ..items.pos())
]

#let tabella(ncol, head, ..rows) = {
  let rs = rows.pos()
  let has-head = head.len() > 0 and head.map(c => c != []).any(x => x)
  block(spacing: 16pt, breakable: true, width: 100%)[
    #set text(size: 9.5pt)
    #set par(leading: 0.62em, justify: false)
    #table(
      columns: (auto,) * ncol,
      stroke: none,
      align: (left + top,) * ncol,
      inset: (x: 7pt, y: 6pt),
      table.hline(stroke: 0.9pt + ink),
      ..if has-head {(
        table.header(..head.map(c => text(font: SANS, size: 8.2pt,
          weight: "bold", tracking: 0.05em, fill: muted)[#c])),
        table.hline(stroke: 0.5pt + hairline),
      )} else {()},
      ..rs.map(r => r.enumerate().map(((k, c)) =>
        if k == 0 and ncol > 1 {
          text(font: SANS, size: 9pt, fill: ink)[#c]
        } else { c })).flatten(),
      table.hline(stroke: 0.9pt + ink),
    )
  ]
}

// ── pagina ──────────────────────────────────────────────────

#let documento(titolo: "", sottotitolo: "", occhiello: "", epigrafe: "",
               data: "", nota: "", testatina: none, indice: false,
               lingua: "it", autore: "Simone Pizzi", copertina: none, corpo) = {
  set document(title: titolo, author: autore)
  show heading: it => none
  set page(
    paper: "a4",
    margin: (left: 34mm, right: 46mm, top: 30mm, bottom: 26mm),
    header: context {
      if testatina != none and counter(page).get().first() > 1 {
        set text(font: SANS, size: 7.6pt, fill: muted, tracking: 0.06em)
        block(width: 100%)[
          #upper(testatina)
          #v(-6pt)
          #line(length: 100%, stroke: 0.4pt + hairline)
        ]
      }
    },
    footer: context {
      set text(font: SANS, size: 8pt, fill: muted)
      if counter(page).get().first() > 1 {
        align(center)[#counter(page).display()]
      }
    },
  )
  set text(font: SERIF, size: 10.8pt, fill: ink, lang: lingua, hyphenate: true)
  set par(justify: true, leading: 0.76em, spacing: 13.5pt)

  if copertina != none { copertina }

  // frontespizio
  page(margin: (left: 34mm, right: 46mm, top: 62mm, bottom: 30mm),
       header: none, footer: none)[
    #text(font: SANS, size: 8.5pt, tracking: 0.26em, fill: accent)[#upper(occhiello)]
    #v(16pt)
    #text(font: SANS, size: 40pt, weight: "bold", tracking: 0.02em, fill: ink)[#titolo]
    #v(10pt)
    #line(length: 46%, stroke: 1.2pt + accent)
    #v(14pt)
    #text(font: SERIF, size: 15pt, style: "italic", fill: rgb("#3a352a"))[#sottotitolo]
    #v(20pt)
    #text(font: SERIF, size: 12.5pt, fill: ink)[#autore]
    #v(34pt)
    #block(width: 82%)[
      #set text(size: 12.5pt, fill: ink)
      #set par(leading: 0.8em, justify: false)
      #emph[#epigrafe]
    ]
    #v(1fr)
    #block(width: 84%)[
      #set text(font: SANS, size: 8.6pt, fill: muted)
      #set par(leading: 0.75em, justify: false)
      #nota
      #v(6pt)
      #data
    ]
  ]

  counter(page).update(if copertina != none { 3 } else { 2 })

  if indice {
    block(spacing: 18pt)[
      #text(font: SANS, size: 12.5pt, weight: "bold", fill: ink)[Indice]
    ]
    {
      show outline.entry.where(level: 1): set text(
        font: SANS, size: 8.6pt, weight: "bold", fill: accent)
      show outline.entry.where(level: 1): it => { v(8pt, weak: true); it }
      set text(size: 9.6pt)
      set par(justify: false, leading: 0.62em, spacing: 4pt)
      outline(title: none, depth: 2, indent: 12pt)
    }
    pagebreak(weak: true)
  }

  corpo
}

// ── copertina ───────────────────────────────────────────────

#let RM_COL = "assets/RuntimeMultimedia_ColoreOriginale.svg"
#let RM_WHT = "assets/RuntimeMultimedia_Bianco.svg"

#let teal   = rgb("#005057")
#let teal2  = rgb("#008795")
#let arancio= rgb("#FE5200")

// A — campo teal, logo bianco
#let copertina-scura(titolo: "", sottotitolo: "", edizione: "", autore: "") = page(
  paper: "a4", fill: teal, header: none, footer: none,
  margin: (left: 26mm, right: 26mm, top: 26mm, bottom: 24mm),
)[
  #image(RM_WHT, width: 58mm)
  #v(1fr)
  #text(font: SANS, size: 8.5pt, tracking: 0.3em, fill: arancio)[#upper(edizione)]
  #v(9pt)
  #text(font: SANS, size: 47pt, weight: "bold", tracking: 0.01em, fill: white)[#titolo]
  #v(11pt)
  #line(length: 34%, stroke: 2pt + arancio)
  #v(15pt)
  #block(width: 74%)[
    #set par(leading: 0.8em, justify: false)
    #text(font: SERIF, size: 16pt, style: "italic", fill: rgb("#cfe4e6"))[#sottotitolo]
  ]
  #v(1fr)
  #text(font: SERIF, size: 14pt, fill: white)[#autore]
]

// B — campo chiaro, logo a colori
#let copertina-chiara(titolo: "", sottotitolo: "", edizione: "", autore: "") = page(
  paper: "a4", fill: rgb("#f7f5ee"), header: none, footer: none,
  margin: (left: 26mm, right: 26mm, top: 26mm, bottom: 24mm),
)[
  #image(RM_COL, width: 58mm)
  #v(1fr)
  #text(font: SANS, size: 8.5pt, tracking: 0.3em, fill: arancio)[#upper(edizione)]
  #v(9pt)
  #text(font: SANS, size: 47pt, weight: "bold", tracking: 0.01em, fill: teal)[#titolo]
  #v(11pt)
  #line(length: 34%, stroke: 2pt + arancio)
  #v(15pt)
  #block(width: 88%)[
    #set par(leading: 0.82em, justify: false)
    #set text(hyphenate: false)
    #text(font: SERIF, size: 16pt, style: "italic", fill: rgb("#3a453f"))[#sottotitolo]
  ]
  #v(1fr)
  #text(font: SERIF, size: 14pt, fill: ink)[#autore]
]

// C — campo chiaro, titolo in nero d'inchiostro, filetto terracotta (coerente con l'interno)
#let copertina-sobria(titolo: "", sottotitolo: "", edizione: "", autore: "") = page(
  paper: "a4", fill: rgb("#f7f5ee"), header: none, footer: none,
  margin: (left: 30mm, right: 30mm, top: 30mm, bottom: 26mm),
)[
  #image(RM_COL, width: 54mm)
  #v(1fr)
  #text(font: SANS, size: 8.5pt, tracking: 0.3em, fill: accent)[#upper(edizione)]
  #v(9pt)
  #text(font: SANS, size: 45pt, weight: "bold", tracking: 0.01em, fill: ink)[#titolo]
  #v(12pt)
  #line(length: 30%, stroke: 2pt + accent)
  #v(15pt)
  #block(width: 76%)[
    #set par(leading: 0.8em, justify: false)
    #text(font: SERIF, size: 15.5pt, style: "italic", fill: rgb("#3a352a"))[#sottotitolo]
  ]
  #v(1fr)
  #line(length: 16%, stroke: 0.6pt + hairline)
  #v(9pt)
  #text(font: SERIF, size: 13.5pt, fill: ink)[#autore]
]
