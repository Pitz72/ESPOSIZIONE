# ---------------------------------------------------------------
#  ESPOSIZIONE — ricostruzione dei PDF
#  Uso:  cd typst ; .\build.ps1
#  Serve: Python 3 e Typst 0.14+ nel PATH.
#  I font stanno in typst/fonts/ e vengono passati con --font-path:
#  senza di essi Typst compila lo stesso, ripiegando su un altro
#  carattere, e produce un documento diverso senza dire niente.
# ---------------------------------------------------------------

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$radice = Split-Path $PSScriptRoot -Parent
$uscita = Join-Path $radice 'pdf'
New-Item -ItemType Directory -Force -Path $uscita | Out-Null

$documenti = @(
    @{
        nome  = 'design'
        fonte = Join-Path $radice 'ESPOSIZIONE-DESIGN.md'
        testa = 'head-design.typ'
        pdf   = Join-Path $uscita 'ESPOSIZIONE-DESIGN.pdf'
        # il documento riceve anche la passata tipografica italiana
        extra = @('--tipografia', '--inizia-da', '^## Come leggere')
    },
    @{
        nome  = 'librogame'
        # il libro si rigenera prima dai dati: node strumento/motore/src/cli.ts libro
        fonte = Join-Path $radice 'strumento\motore\libro\santa-rita.md'
        testa = 'head-librogame.typ'
        pdf   = Join-Path $uscita 'SANTA-RITA-librogame.pdf'
        extra = @('--tipografia', '--inizia-da', '^## Come si gioca')
    }
)

foreach ($d in $documenti) {
    $intermedio = "_$($d.nome).typ"

    # Markdown -> Typst, con la testata del documento in cima
    python md2typ.py $d.fonte $intermedio --testa $d.testa @($d.extra)

    typst compile --font-path fonts $intermedio $d.pdf

    Remove-Item $intermedio
    Write-Host ("  fatto  " + (Split-Path $d.pdf -Leaf)) -ForegroundColor Green
}

Write-Host "`nPDF ricostruiti in $uscita" -ForegroundColor Cyan
