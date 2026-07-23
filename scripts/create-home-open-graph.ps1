Add-Type -AssemblyName System.Drawing

$sourcePath = Resolve-Path "public/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png"
$targetDirectory = Join-Path (Get-Location) "public/images/seo"
$targetPath = Join-Path $targetDirectory "maggenta-home-open-graph.png"

New-Item -ItemType Directory -Path $targetDirectory -Force | Out-Null

$source = [System.Drawing.Image]::FromFile($sourcePath)
$canvas = New-Object System.Drawing.Bitmap 1200, 630
$graphics = [System.Drawing.Graphics]::FromImage($canvas)

try {
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  # Keep the complete horizontal logo inside WhatsApp's central square safe area.
  $targetWidth = 560
  $targetHeight = [int][Math]::Round($source.Height * ($targetWidth / $source.Width))
  $targetX = [int](($canvas.Width - $targetWidth) / 2)
  $targetY = [int](($canvas.Height - $targetHeight) / 2)

  $graphics.DrawImage($source, $targetX, $targetY, $targetWidth, $targetHeight)
  $canvas.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
  $graphics.Dispose()
  $canvas.Dispose()
  $source.Dispose()
}
