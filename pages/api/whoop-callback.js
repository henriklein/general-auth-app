// API route for server-side token exchange
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const CLIENT_ID = '1abcdd79-3d8d-4deb-a9ca-efc137392089';
    const CLIENT_SECRET = '96b16c1371b8d20b703335823281a3dafcc72e19b4b16edc8c2a995e04462691';
    const host = req.headers.host || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const REDIRECT_URI = `${protocol}://${host}/callback`;

    console.log('🔄 Attempting token exchange...');
    console.log('Code:', code.substring(0, 20) + '...');
    console.log('Redirect URI:', REDIRECT_URI);

    const tokenResponse = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Arthur-Health-Assistant/1.0',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    console.log('Token response status:', tokenResponse.status);
    console.log('Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      
      return res.status(tokenResponse.status).json({ 
        error: 'Token exchange failed',
        details: errorText,
        status: tokenResponse.status 
      });
    }

    const tokens = await tokenResponse.json();
    console.log('✅ Token exchange successful');
    console.log('Token scopes:', tokens.scope);
    
    // Test API access with the new token
    console.log('🧪 Testing API access...');
    
    const testEndpoints = [
      '/developer/v1/user/profile/basic',  // v1 endpoint from tutorial
      '/v2/user/profile/basic'             // v2 endpoint from docs
    ];
    
    let apiTestResult = null;
    
    for (const endpoint of testEndpoints) {
      try {
        const testResponse = await fetch(`https://api.prod.whoop.com${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'User-Agent': 'Arthur-Health-Assistant/1.0',
          }
        });
        
        console.log(`Testing ${endpoint}: ${testResponse.status}`);
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          apiTestResult = {
            endpoint,
            status: testResponse.status,
            data: testData
          };
          break;
        } else {
          const errorText = await testResponse.text();
          console.log(`${endpoint} error:`, errorText);
        }
      } catch (err) {
        console.log(`${endpoint} test failed:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      tokens,
      apiTest: apiTestResult,
      message: apiTestResult ? 'Token exchange and API test successful!' : 'Token exchange successful, but API test failed'
    });

  } catch (error) {
    console.error('Server error during token exchange:', error);
    
    return res.status(500).json({
      error: 'Server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}