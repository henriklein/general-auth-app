import { useState } from 'react';

export default function Home() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const integrations = [
    {
      id: 'whoop',
      name: '🏥 Whoop Health',
      description: 'Daily strain, heart rate, and activity tracking',
      clientId: '1abcdd79-3d8d-4deb-a9ca-efc137392089',
      authUrl: 'https://api.prod.whoop.com/oauth/oauth2/auth',
      scopes: ['offline', 'read:recovery', 'read:cycles', 'read:sleep', 'read:workout', 'read:profile', 'read:body_measurement']
    },
    {
      id: 'google',
      name: '📧 Google Workspace',
      description: 'Gmail, Google Calendar, and Contacts access',
      clientId: '793067909514-29l6ncu4as74hqu33pfmaes8jv85b1ur.apps.googleusercontent.com',
      authUrl: 'https://accounts.google.com/oauth2/v2/auth',
      scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    },
    {
      id: 'slack',
      name: '💬 Slack Workspace',
      description: 'Team communication and file access',
      clientId: 'YOUR_SLACK_CLIENT_ID',
      authUrl: 'https://slack.com/oauth/v2/authorize',
      scopes: ['channels:read', 'chat:write', 'files:read', 'users:read', 'team:read']
    }
  ];

  const handleConnect = async (integration) => {
    setLoading(prev => ({ ...prev, [integration.id]: true }));
    
    try {
      const state = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      localStorage.setItem(`${integration.id}_state`, state);
      localStorage.setItem('current_integration', integration.id);
      
      const authParams = new URLSearchParams({
        response_type: 'code',
        client_id: integration.clientId,
        redirect_uri: `${window.location.origin}/callback`,
        scope: integration.scopes.join(' '),
        state: state,
        access_type: integration.id === 'google' ? 'offline' : undefined,
        prompt: integration.id === 'google' ? 'consent' : undefined
      });
      
      // Remove undefined params
      Object.keys(Object.fromEntries(authParams)).forEach(key => {
        if (authParams.get(key) === 'undefined') {
          authParams.delete(key);
        }
      });
      
      const authUrl = `${integration.authUrl}?${authParams.toString()}`;
      window.location.href = authUrl;
      
    } catch (err) {
      console.error('Auth error:', err);
      setLoading(prev => ({ ...prev, [integration.id]: false }));
    }
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
        <h1 style={{ color: '#333', marginBottom: '10px' }}>
          🔗 Arthur Integration Hub
        </h1>
        <p style={{ color: '#666', marginBottom: '40px', fontSize: '18px' }}>
          Connect your accounts to unlock comprehensive health, productivity, and knowledge management.
        </p>

        <div style={{ display: 'grid', gap: '24px' }}>
          {integrations.map(integration => (
            <div key={integration.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              background: '#fafbfc',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '20px' }}>
                    {integration.name}
                  </h3>
                  <p style={{ margin: '0 0 16px 0', color: '#6b7280', lineHeight: 1.6 }}>
                    {integration.description}
                  </p>
                  
                  <details style={{ marginBottom: '16px' }}>
                    <summary style={{ cursor: 'pointer', color: '#4b5563', fontSize: '14px' }}>
                      🔒 Data Access & Scopes
                    </summary>
                    <div style={{ marginTop: '8px', padding: '12px', background: '#f3f4f6', borderRadius: '6px' }}>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#374151' }}>
                        {integration.scopes.map(scope => (
                          <li key={scope} style={{ marginBottom: '4px' }}>
                            <code style={{ background: '#e5e7eb', padding: '2px 4px', borderRadius: '3px' }}>
                              {scope.replace('https://www.googleapis.com/auth/', '').replace('read:', '')}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
                
                <button 
                  onClick={() => handleConnect(integration)}
                  disabled={loading[integration.id]}
                  style={{
                    background: integration.id === 'slack' ? '#ccc' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: integration.id === 'slack' ? 'not-allowed' : 'pointer',
                    minWidth: '120px',
                    opacity: integration.id === 'slack' ? 0.5 : 1
                  }}
                >
                  {loading[integration.id] ? 'Connecting...' : 
                   integration.id === 'slack' ? 'Coming Soon' : 
                   '🔗 Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '24px', 
          background: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0c4a6e' }}>
            🧠 Knowledge Management System
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <strong>#uni</strong>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                → #subject_semester<br/>
                → Granola transcripts<br/>
                → Course materials
              </div>
            </div>
            <div>
              <strong>#peg</strong>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                → Work meetings<br/>
                → Project docs<br/>
                → Team communications
              </div>
            </div>
            <div>
              <strong>#ipr</strong>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                → Policy research<br/>
                → Academic writing<br/>
                → Publications
              </div>
            </div>
            <div>
              <strong>#personal</strong>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                → Personal projects<br/>
                → Health tracking<br/>
                → Life management
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '24px', 
          padding: '20px', 
          background: '#f8fafc',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <strong>🔒 Privacy & Security:</strong> All integrations use secure OAuth 2.0. Tokens are encrypted and stored securely. 
          Data is processed locally and only used for personalized insights and automation.
        </div>
      </div>
    </div>
  );
}