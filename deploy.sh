#!/bin/bash

# Eco-Globe Production Deployment Script

echo "🚀 Starting deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your production environment variables."
    echo "See .env.example for reference."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d .output ]; then
    echo "❌ Error: Build failed! .output directory not found."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Restart PM2
echo "🔄 Restarting PM2..."
if pm2 list | grep -q "eco-globe"; then
    pm2 restart ecosystem.config.cjs
else
    pm2 start ecosystem.config.cjs
fi

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
echo "📊 View logs with: pm2 logs eco-globe"
echo "🔍 Monitor with: pm2 monit"
