#import "template.typ": *

#show: doc => documento(
  occhiello: "Librogame di prova",
  titolo: "Il registro della Santa Rita",
  sottotitolo: "Un librogame per ESPOSIZIONE",
  epigrafe: "Il dado decide se riesci.\nTu decidi quanto rischi.",
  nota: [Generato da ESPOSIZIONE Studio a partire dagli stessi dati che si giocano sullo schermo. Servono due dadi a sei facce e una matita.],
  data: [Settembre 2026],
  testatina: [Il registro della Santa Rita],
  indice: false,
  copertina: copertina-chiara(
    titolo: "Il registro della Santa Rita",
    sottotitolo: "Un librogame di prova\nper ESPOSIZIONE.",
    edizione: "Librogame di prova",
    autore: "Simone Pizzi"),
  doc,
)
