#!/bin/bash

echo "🚀 Deploying Whoop Auth App to Vercel..."
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to production
echo "🌍 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy your deployment URL from above"
echo "2. Go to: https://developer.whoop.com/dashboard"
echo "3. Edit 'Arthur Health Assistant' app"
echo "4. Update Redirect URL to: https://YOUR_URL/callback"
echo "5. Save the app"
echo "6. Visit your deployment URL to test authentication"
echo ""