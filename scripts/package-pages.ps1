$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$releaseRoot = Join-Path $projectRoot 'release'
$stage = Join-Path $releaseRoot ('cloudflare-source-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $stage -Force | Out-Null
$files = @('package.json','package-lock.json','tsconfig.json','vite.static.config.ts','index.html','.gitignore','firebase-applet-config.json','CLOUDFLARE-PAGES.md','STATIC-VALIDATION.md','wrangler.jsonc')
foreach ($file in $files) { Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $stage }
foreach ($folder in @('src','content')) { Copy-Item -LiteralPath (Join-Path $projectRoot $folder) -Destination $stage -Recurse }
New-Item -ItemType Directory -Path (Join-Path $stage '.github/workflows') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot '.github/workflows/validate.yml') -Destination (Join-Path $stage '.github/workflows/validate.yml')
foreach ($folder in @('public','scripts','tests')) { New-Item -ItemType Directory -Path (Join-Path $stage $folder) | Out-Null }
foreach ($folder in @('resources','uploads')) {
  $source = Join-Path $projectRoot ('public/' + $folder)
  if (Test-Path -LiteralPath $source) { Copy-Item -LiteralPath $source -Destination (Join-Path $stage 'public') -Recurse }
}
foreach ($file in @('build-pages.mjs','render-pages.tsx','preview-pages.mjs','clean.mjs','package-pages.ps1')) { Copy-Item -LiteralPath (Join-Path $PSScriptRoot $file) -Destination (Join-Path $stage 'scripts') }
Copy-Item -LiteralPath (Join-Path $projectRoot 'tests/pages.test.ts') -Destination (Join-Path $stage 'tests')
Copy-Item -LiteralPath (Join-Path $projectRoot 'CLOUDFLARE-PAGES.md') -Destination (Join-Path $stage 'README.md')
# ZipFile includes dotfiles such as .gitignore; Compress-Archive can skip hidden files.
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$sourceZip = Join-Path $releaseRoot ('shera-scrap-cloudflare-source-' + $stamp + '.zip')
$staticZip = Join-Path $releaseRoot ('shera-scrap-cloudflare-static-' + $stamp + '.zip')
[System.IO.Compression.ZipFile]::CreateFromDirectory($stage, $sourceZip)
[System.IO.Compression.ZipFile]::CreateFromDirectory((Join-Path $projectRoot 'dist/pages'), $staticZip)
Write-Output $stage
Write-Output $sourceZip
Write-Output $staticZip
