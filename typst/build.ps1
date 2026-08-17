# ---------------------------------------------------------------
#  ESPOSIZIONE — ricostruzione dei PDF
#  Uso:  cd typst ; .\build.ps1
#  Serve: Python 3 e Typst 0.15+ nel PATH.
# ---------------------------------------------------------------

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$radice = Split-Path $PSScriptRoot -Parent
$uscita = Join-Path $radice 'pdf'
New-Item -ItemType Directory -Force -Path $uscita | Out-Null

$documenti = @(
    @{
        nome  = 'spec'
        fonte = Join-Path $radice 'ESPOSIZIONE-1.2.md'
        testa = 'head-spec.typ'
        pdf   = Join-Path $uscita 'ESPOSIZIONE-1.2-impaginata.pdf'
        # la specifica riceve anche la passata tipografica italiana
        extra = @('--tipografia', '--inizia-da', '^## Che cosa')
    },
    @{
        nome  = 'concept'
        fonte = Join-Path $radice 'concept\ESPOSIZIONE-CONCEPT.md'
        testa = 'head-concept.typ'
        pdf   = Join-Path $uscita 'ESPOSIZIONE-CONCEPT.pdf'
        extra = @('--inizia-da', '^## 1\. ')
    },
    @{
        nome  = 'concept-en'
        fonte = Join-Path $radice 'concept\EXPOSURE-CONCEPT-EN.md'
        testa = 'head-concept-en.typ'
        pdf   = Join-Path $uscita 'EXPOSURE-CONCEPT-EN.pdf'
        extra = @('--inizia-da', '^## 1\. ')
    }
)

foreach ($d in $documenti) {
    $intermedio = "_$($d.nome).typ"

    # Markdown -> Typst, con la testata del documento in cima
    python md2typ.py $d.fonte $intermedio --testa $d.testa @($d.extra)

    typst compile $intermedio $d.pdf

    Remove-Item $intermedio
    Write-Host ("  fatto  " + (Split-Path $d.pdf -Leaf)) -ForegroundColor Green
}

Write-Host "`nTre PDF ricostruiti in $uscita" -ForegroundColor Cyan
