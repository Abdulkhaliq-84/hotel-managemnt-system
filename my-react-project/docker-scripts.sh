#!/bin/bash

# Docker management scripts for React Reusable Template

echo "🐳 React Reusable Template - Docker Management Scripts"
echo "======================================================"

case "$1" in
  "build")
    echo "Building production Docker image..."
    docker build -t react-reuse .
    echo "✅ Production image built successfully!"
    ;;
    
  "build-dev")
    echo "Building development Docker image..."
    docker build -f Dockerfile.dev -t react-reuse:dev .
    echo "✅ Development image built successfully!"
    ;;
    
  "run")
    echo "Running production container on port 3000..."
    docker run -d -p 3000:80 --name react-reuse-app react-reuse
    echo "✅ Production container running on http://localhost:3000"
    ;;
    
  "run-dev")
    echo "Running development container on port 3001..."
    docker run -d -p 3001:3000 --name react-reuse-dev react-reuse:dev
    echo "✅ Development container running on http://localhost:3001"
    ;;
    
  "stop")
    echo "Stopping all containers..."
    docker stop react-reuse-app react-reuse-dev 2>/dev/null || true
    echo "✅ Containers stopped"
    ;;
    
  "clean")
    echo "Cleaning up containers and images..."
    docker stop react-reuse-app react-reuse-dev 2>/dev/null || true
    docker rm react-reuse-app react-reuse-dev 2>/dev/null || true
    docker rmi react-reuse react-reuse:dev 2>/dev/null || true
    echo "✅ Cleanup completed"
    ;;
    
  "logs")
    echo "Showing container logs..."
    docker logs -f react-reuse-app
    ;;
    
  "logs-dev")
    echo "Showing development container logs..."
    docker logs -f react-reuse-dev
    ;;
    
  "compose")
    echo "Starting with Docker Compose..."
    docker-compose up -d
    echo "✅ Services started with Docker Compose"
    ;;
    
  "compose-dev")
    echo "Starting development services with Docker Compose..."
    docker-compose --profile dev up -d
    echo "✅ Development services started"
    ;;
    
  "compose-down")
    echo "Stopping Docker Compose services..."
    docker-compose down
    echo "✅ Services stopped"
    ;;
    
  *)
    echo "Usage: $0 {build|build-dev|run|run-dev|stop|clean|logs|logs-dev|compose|compose-dev|compose-down}"
    echo ""
    echo "Commands:"
    echo "  build        - Build production Docker image"
    echo "  build-dev    - Build development Docker image"
    echo "  run          - Run production container"
    echo "  run-dev      - Run development container"
    echo "  stop         - Stop all containers"
    echo "  clean        - Clean up containers and images"
    echo "  logs         - Show production container logs"
    echo "  logs-dev     - Show development container logs"
    echo "  compose      - Start with Docker Compose"
    echo "  compose-dev  - Start development with Docker Compose"
    echo "  compose-down - Stop Docker Compose services"
    ;;
esac
