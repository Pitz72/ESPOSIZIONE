#import "template.typ": *

#show: doc => documento(
  occhiello: "Documento di design 2.0",
  titolo: "ESPOSIZIONE",
  sottotitolo: "Un motore per romanzi di ruolo ramificati",
  epigrafe: "Il dado decide se riesci.\nTu decidi quanto rischi.",
  nota: [Su carta e su schermo: librogame, tavolo, digitale. Esplorazione, qualità, scelte e dadi.],
  data: [Documento di design 2.0 · Settembre 2026],
  testatina: [Esposizione · Documento di design 2.0],
  indice: true,
  copertina: copertina-chiara(
    titolo: "ESPOSIZIONE",
    sottotitolo: "Un motore per romanzi di ruolo ramificati,\nsu carta e su schermo.",
    edizione: "Documento di design 2.0",
    autore: "Simone Pizzi"),
  doc,
)
