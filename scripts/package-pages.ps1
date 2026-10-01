$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$releaseRoot = Join-Path $projectRoot 'release'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$stage = Join-Path $releaseRoot ('cloudflare-source-' + $stamp)
Push-Location $projectRoot
try {
  & node scripts/stage-release.mjs $stage
  if ($LASTEXITCODE -ne 0) { throw 'Source validation failed' }
} finally { Pop-Location }
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
function Write-PortableZip($folder, $destination) {
  $archive = [IO.Compression.ZipFile]::Open($destination, [IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($file in Get-ChildItem -LiteralPath $folder -Recurse -File -Force) {
      $entry = $file.FullName.Substring($folder.Length + 1).Replace('\', '/')
      [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $entry, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
  } finally { $archive.Dispose() }
}
$sourceZip = Join-Path $releaseRoot ('SheraScrap-GitHub-Ready-' + $stamp + '.zip')
$staticZip = Join-Path $releaseRoot ('SheraScrap-Static-' + $stamp + '.zip')
Write-PortableZip $stage $sourceZip
Write-PortableZip (Join-Path $projectRoot 'dist/pages') $staticZip
Write-Output $stage
Write-Output $sourceZip
Write-Output $staticZip
