// Universal OAuth callback handler for all integrations
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, integration } = req.body;

  if (!code || !integration) {
    return res.status(400).json({ error: 'Missing authorization code or integration type' });
  }

  console.log(`🔄 Processing ${integration} OAuth callback...`);

  try {
    let tokenData;
    
    switch (integration) {
      case 'whoop':
        tokenData = await handleWhoopAuth(code, req);
        break;
      case 'google':
        tokenData = await handleGoogleAuth(code, req);
        break;
      case 'slack':
        tokenData = await handleSlackAuth(code, req);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported integration type' });
    }

    // Test the connection immediately
    const testResult = await testConnection(integration, tokenData);
    
    return res.status(200).json({
      success: true,
      integration,
      tokens: tokenData,
      testResult,
      message: `${integration} connected successfully!`
    });

  } catch (error) {
    console.error(`${integration} auth error:`, error);
    
    return res.status(500).json({
      error: `${integration} authentication failed`,
      details: error.message
    });
  }
}

async function handleWhoopAuth(code, req) {
  const CLIENT_ID = '1abcdd79-3d8d-4deb-a9ca-efc137392089';
  const CLIENT_SECRET = '96b16c1371b8d20b703335823281a3dafcc72e19b4b16edc8c2a995e04462691';
  const REDIRECT_URI = getRedirectUri(req);

  const response = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whoop token exchange failed: ${response.status} ${errorText}`);
  }

  return await response.json();
}

async function handleGoogleAuth(code, req) {
  // You'll need to create Google OAuth credentials in Google Cloud Console
  const CLIENT_ID = '808264289455-84b1rrh6jjdh1ggv9loj0hcsqaqig8ni.apps.googleusercontent.com';
  const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'; // You need to add this
  const REDIRECT_URI = getRedirectUri(req);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google token exchange failed: ${response.status} ${errorText}`);
  }

  return await response.json();
}

async function handleSlackAuth(code, req) {
  // Slack OAuth implementation (when ready)
  throw new Error('Slack integration coming soon');
}

async function testConnection(integration, tokens) {
  try {
    switch (integration) {
      case 'whoop':
        return await testWhoopConnection(tokens);
      case 'google':
        return await testGoogleConnection(tokens);
      case 'slack':
        return await testSlackConnection(tokens);
      default:
        return { error: 'Unknown integration' };
    }
  } catch (err) {
    return { error: err.message };
  }
}

async function testWhoopConnection(tokens) {
  const response = await fetch('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
    }
  });

  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      user: `${data.first_name} ${data.last_name}`,
      userId: data.user_id
    };
  } else {
    throw new Error(`Whoop API test failed: ${response.status}`);
  }
}

async function testGoogleConnection(tokens) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
    }
  });

  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      user: data.name,
      email: data.email
    };
  } else {
    throw new Error(`Google API test failed: ${response.status}`);
  }
}

async function testSlackConnection(tokens) {
  // Slack API test implementation
  return { success: false, error: 'Not implemented yet' };
}

function getRedirectUri(req) {
  const host = req.headers.host || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}/callback`;
}