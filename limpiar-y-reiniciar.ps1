# Script para limpiar caché y reiniciar Angular
# Guarda esto como: limpiar-y-reiniciar.ps1

Write-Host "🧹 Limpiando caché de Angular..." -ForegroundColor Yellow

# Limpiar caché de Angular
if (Test-Path ".angular/cache") {
    Remove-Item -Recurse -Force ".angular/cache"
    Write-Host "✅ Caché de .angular limpiada" -ForegroundColor Green
}

# Limpiar caché de node_modules
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✅ Caché de node_modules limpiada" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Iniciando servidor Angular..." -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
ng serve -o
