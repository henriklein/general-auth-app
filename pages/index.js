import { useState } from 'react';

export default function Home() {
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleConnect = () => {
    const CLIENT_ID = '1abcdd79-3d8d-4deb-a9ca-efc137392089';
    const REDIRECT_URI = `${window.location.origin}/callback`;
    const SCOPES = [
      'offline',  // For refresh tokens
      'read:recovery',
      'read:cycles', 
      'read:sleep',
      'read:workout',
      'read:profile',
      'read:body_measurement'
    ].join(' ');
    
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15); // 32 chars
    
    localStorage.setItem('whoop_state', state);
    
    const authUrl = `https://api.prod.whoop.com/oauth/oauth2/auth?` +
      `response_type=code&` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `state=${state}`;
    
    window.location.href = authUrl;
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      padding: '40px', 
      maxWidth: '600px', 
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
          🏥 Whoop Health Integration
        </h1>
        <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          Connect your Whoop account to Arthur Health Assistant for comprehensive health tracking and insights.
        </p>
        
        {!tokens ? (
          <div>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Data We'll Access:</h3>
            <ul style={{ color: '#666', marginBottom: '30px', lineHeight: '1.8' }}>
              <li><strong>Recovery:</strong> Daily recovery scores, HRV, resting heart rate</li>
              <li><strong>Sleep:</strong> Sleep stages, efficiency, disturbances</li>
              <li><strong>Workouts:</strong> Strain, heart rate zones, calories</li>
              <li><strong>Daily Cycles:</strong> Strain accumulation, energy expenditure</li>
              <li><strong>Profile:</strong> Basic account information</li>
            </ul>
            
            <button 
              onClick={handleConnect}
              disabled={loading}
              style={{
                background: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {loading ? 'Connecting...' : '🔗 Connect Whoop Account'}
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ color: '#22c55e', marginBottom: '20px' }}>
              ✅ Successfully Connected!
            </h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Copy these tokens and send them to Arthur:
            </p>
            
            <div style={{ 
              background: '#f1f5f9', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px',
              fontFamily: 'Monaco, monospace',
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              overflow: 'auto'
            }}>
              {JSON.stringify(tokens, null, 2)}
            </div>
            
            <p style={{ color: '#ef4444', fontSize: '14px' }}>
              ⚠️ These tokens provide access to your health data. Only share them with Arthur.
            </p>
          </div>
        )}
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#f8fafc',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <strong>About this integration:</strong> This secure OAuth flow connects your Whoop device data to Arthur's health monitoring system. Your data stays private and is only used for personalized health insights and recommendations.
        </div>
      </div>
    </div>
  );
}