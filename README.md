# Whoop Auth App

Simple Next.js app for handling Whoop OAuth authentication flow.

## Quick Deploy to Vercel

1. **Clone/Download this folder**

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Get your deployment URL** (e.g. `https://whoop-auth-app-xxx.vercel.app`)

4. **Update Whoop App Redirect URL:**
   - Go to: https://developer.whoop.com/dashboard
   - Edit "Arthur Health Assistant" app
   - Change Redirect URL to: `https://YOUR_VERCEL_URL/callback`
   - Save the app

5. **Test the authentication:**
   - Visit your Vercel URL
   - Click "Connect Whoop Account"
   - Complete OAuth flow
   - Copy the tokens and send to Arthur

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## How It Works

1. User clicks "Connect Whoop Account"
2. Redirected to Whoop OAuth page
3. User authorizes the app
4. Whoop redirects back to `/callback`
5. App exchanges authorization code for access tokens
6. Tokens are displayed for copying

## Security

- Uses secure OAuth 2.0 flow
- State parameter prevents CSRF attacks
- Tokens are only displayed to the user (not sent anywhere)
- Client secret is included for token exchange (safe in serverless functions)