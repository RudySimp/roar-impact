param([string]$Output = "dist\roar-impact-v1.0.0.zip")
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$stage = Join-Path ([System.IO.Path]::GetTempPath()) ("roar-impact-build-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $stage | Out-Null
$items = @("module.json","README.md","README_RU.md","CHANGELOG.md","RELEASE_NOTES.md","TEST_REPORT.md","LICENSE","scripts","styles","templates","lang","data","assets")
foreach($item in $items){Copy-Item -LiteralPath (Join-Path $root $item) -Destination $stage -Recurse -Force}
$target = Join-Path $root $Output
New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
if(Test-Path -LiteralPath $target){Remove-Item -LiteralPath $target -Force}
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $target -CompressionLevel Optimal
Remove-Item -LiteralPath $stage -Recurse -Force
Write-Output $target
