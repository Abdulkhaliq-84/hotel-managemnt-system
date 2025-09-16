# Docker management scripts for React Reusable Template (PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command
)

Write-Host "🐳 React Reusable Template - Docker Management Scripts" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

switch ($Command) {
    "build" {
        Write-Host "Building production Docker image..." -ForegroundColor Yellow
        docker build -t react-reuse .
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Production image built successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Build failed!" -ForegroundColor Red
        }
    }
    
    "build-dev" {
        Write-Host "Building development Docker image..." -ForegroundColor Yellow
        docker build -f Dockerfile.dev -t react-reuse:dev .
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Development image built successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Build failed!" -ForegroundColor Red
        }
    }
    
    "run" {
        Write-Host "Running production container on port 3000..." -ForegroundColor Yellow
        docker run -d -p 3000:80 --name react-reuse-app react-reuse
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Production container running on http://localhost:3000" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to run container!" -ForegroundColor Red
        }
    }
    
    "run-dev" {
        Write-Host "Running development container on port 3001..." -ForegroundColor Yellow
        docker run -d -p 3001:3000 --name react-reuse-dev react-reuse:dev
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Development container running on http://localhost:3001" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to run container!" -ForegroundColor Red
        }
    }
    
    "stop" {
        Write-Host "Stopping all containers..." -ForegroundColor Yellow
        docker stop react-reuse-app, react-reuse-dev 2>$null
        Write-Host "✅ Containers stopped" -ForegroundColor Green
    }
    
    "clean" {
        Write-Host "Cleaning up containers and images..." -ForegroundColor Yellow
        docker stop react-reuse-app, react-reuse-dev 2>$null
        docker rm react-reuse-app, react-reuse-dev 2>$null
        docker rmi react-reuse, react-reuse:dev 2>$null
        Write-Host "✅ Cleanup completed" -ForegroundColor Green
    }
    
    "logs" {
        Write-Host "Showing production container logs..." -ForegroundColor Yellow
        docker logs -f react-reuse-app
    }
    
    "logs-dev" {
        Write-Host "Showing development container logs..." -ForegroundColor Yellow
        docker logs -f react-reuse-dev
    }
    
    "compose" {
        Write-Host "Starting with Docker Compose..." -ForegroundColor Yellow
        docker-compose up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Services started with Docker Compose" -ForegroundColor Green
        } else {
            Write-Host "❌ Docker Compose failed!" -ForegroundColor Red
        }
    }
    
    "compose-dev" {
        Write-Host "Starting development services with Docker Compose..." -ForegroundColor Yellow
        docker-compose --profile dev up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Development services started" -ForegroundColor Green
        } else {
            Write-Host "❌ Docker Compose failed!" -ForegroundColor Red
        }
    }
    
    "compose-down" {
        Write-Host "Stopping Docker Compose services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Services stopped" -ForegroundColor Green
    }
    
    default {
        Write-Host "Usage: .\docker-scripts.ps1 {build|build-dev|run|run-dev|stop|clean|logs|logs-dev|compose|compose-dev|compose-down}" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  build        - Build production Docker image" -ForegroundColor Gray
        Write-Host "  build-dev    - Build development Docker image" -ForegroundColor Gray
        Write-Host "  run          - Run production container" -ForegroundColor Gray
        Write-Host "  run-dev      - Run development container" -ForegroundColor Gray
        Write-Host "  stop         - Stop all containers" -ForegroundColor Gray
        Write-Host "  clean        - Clean up containers and images" -ForegroundColor Gray
        Write-Host "  logs         - Show production container logs" -ForegroundColor Gray
        Write-Host "  logs-dev     - Show development container logs" -ForegroundColor Gray
        Write-Host "  compose      - Start with Docker Compose" -ForegroundColor Gray
        Write-Host "  compose-dev  - Start development with Docker Compose" -ForegroundColor Gray
        Write-Host "  compose-down - Stop Docker Compose services" -ForegroundColor Gray
    }
}
