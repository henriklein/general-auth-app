import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [tokens, setTokens] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    
    const { code, state, error: oauthError } = router.query;
    
    if (oauthError) {
      setError(`OAuth Error: ${oauthError}`);
      setStatus('error');
      return;
    }
    
    if (!code) {
      setError('No authorization code received');
      setStatus('error');
      return;
    }
    
    // Verify state parameter
    const savedState = localStorage.getItem('whoop_state');
    if (state !== savedState) {
      setError('Invalid state parameter - possible CSRF attack');
      setStatus('error');
      return;
    }
    
    // Exchange code for tokens
    exchangeCodeForTokens(code);
  }, [router.isReady, router.query]);

  const exchangeCodeForTokens = async (code) => {
    try {
      const CLIENT_ID = '1abcdd79-3d8d-4deb-a9ca-efc137392089';
      const CLIENT_SECRET = '96b16c1371b8d20b703335823281a3dafcc72e19b4b16edc8c2a995e04462691';
      const REDIRECT_URI = `${window.location.origin}/callback`;

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
        throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
      }

      const tokenData = await response.json();
      setTokens(tokenData);
      setStatus('success');
      
      // Clean up
      localStorage.removeItem('whoop_state');
      
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const copyTokens = () => {
    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    alert('Tokens copied to clipboard! Send these to Arthur.');
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          🏥 Whoop Authentication
        </h1>

        {status === 'loading' && (
          <div>
            <p style={{ color: '#666', fontSize: '18px' }}>
              🔄 Exchanging authorization code for access tokens...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h2 style={{ color: '#22c55e', marginBottom: '20px' }}>
              ✅ Authentication Successful!
            </h2>
            
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Your Whoop account is now connected. Copy these tokens and send them to Arthur:
            </p>

            <div style={{ 
              background: '#f1f5f9', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px',
              fontFamily: 'Monaco, monospace',
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
              maxHeight: '400px',
              border: '1px solid #e2e8f0'
            }}>
              {JSON.stringify(tokens, null, 2)}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <button 
                onClick={copyTokens}
                style={{
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📋 Copy Tokens
              </button>
              
              <button 
                onClick={goHome}
                style={{
                  background: '#64748b',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🏠 Go Home
              </button>
            </div>

            <div style={{ 
              padding: '16px', 
              background: '#fef3c7',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#92400e'
            }}>
              <strong>⚠️ Security Note:</strong> These tokens provide access to your Whoop health data. 
              Only share them with Arthur through a secure channel.
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>
              ❌ Authentication Failed
            </h2>
            
            <p style={{ color: '#666', marginBottom: '20px' }}>
              There was an error during authentication:
            </p>
            
            <div style={{ 
              background: '#fef2f2', 
              padding: '16px', 
              borderRadius: '6px',
              marginBottom: '20px',
              color: '#dc2626',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
            
            <button 
              onClick={goHome}
              style={{
                background: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}