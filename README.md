# 🔗 Arthur Integration Hub

Universal OAuth authentication system for comprehensive health, productivity, and knowledge management.

## 🌟 Features

### 🔐 Universal Authentication
- **🏥 Whoop Health** - Daily strain, heart rate, activity tracking
- **📧 Google Workspace** - Gmail, Calendar, Drive access (Google OAuth setup required)
- **💬 Slack** - Team communication (coming soon)
- **📝 Granola** - Automatic transcription processing via webhooks

### 🧠 Knowledge Management System
Automatic categorization and processing of all your data:

- **#uni** → University content by subject/semester
- **#peg** → Pure Energy Germany work content  
- **#ipr** → International Policy Review activities
- **#personal** → Personal projects and health tracking

### 🌙 Smart Health Features
- **Bedtime Recommendations** - AI-powered sleep optimization based on strain data
- **Activity-Aware Scheduling** - Adapts recommendations to your daily patterns
- **Cross-Platform Insights** - Correlates health, work, and academic data

## 🚀 Quick Deploy to Vercel

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Update OAuth redirect URLs:**
   - **Whoop:** https://developer.whoop.com/dashboard
     - Redirect URL: `https://YOUR_VERCEL_URL/callback`
   - **Google:** https://console.cloud.google.com/
     - Add your domain to authorized origins
     - Redirect URL: `https://YOUR_VERCEL_URL/callback`

3. **Environment Variables** (in Vercel dashboard):
   ```
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## 📊 Architecture

### Authentication Flow
```
User → Integration Hub → OAuth Provider → Callback → Token Storage → Arthur System
```

### Data Pipeline
```
Source → Webhook/API → Categorization → Knowledge Base → Memory System → Insights
```

### Smart Monitoring
```
Every 15min → Health/Email Checks → Pattern Analysis → Recommendations
```

## 🔄 Webhook Endpoints

### Granola Transcriptions
**URL:** `https://YOUR_VERCEL_URL/api/webhooks/granola`

**Zapier Integration:**
1. Create Zapier webhook trigger
2. Connect to Granola transcription completion
3. Send transcript data to webhook endpoint
4. Auto-categorization and filing

**Payload Format:**
```json
{
  "transcript": "Meeting transcript content...",
  "metadata": {
    "title": "Meeting title",
    "participants": ["Henri", "Other"],
    "timestamp": "2026-01-29T12:00:00Z"
  }
}
```

## 🌙 Bedtime System

### Smart Recommendations
- **Analysis:** Current strain, recent patterns, workload
- **Timing:** 6pm, 7pm, 8pm, 9pm notifications  
- **Adjustments:** ±30min based on health data
- **Future:** Matter integration for automatic lighting

### Health-Aware Sleep Optimization
```javascript
if (strain > 12) → +30min sleep
if (strain > 8) → +15min sleep  
if (energy > 1500kcal) → +15min recovery
if (trend === 'increasing') → +30min preventive
```

## 📱 Integration Status

| Integration | Status | Data Available |
|-------------|--------|----------------|
| 🏥 Whoop | ✅ Connected | Strain, HR, Energy |
| 📧 Gmail (Personal) | ✅ Connected | All emails |
| 📧 Gmail (Work) | ✅ Connected | All emails |
| 📧 IE University | 🔄 Forwarding | Via personal Gmail |
| 📅 Google Calendar | ⏳ Ready | Needs OAuth |
| 💬 Slack | ⏳ Planned | Workspace access |
| 📝 Granola | ⏳ Ready | Webhook configured |

## 🛠️ Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 🔧 System Integration

### Knowledge Base Structure
```
knowledge-base/
├── #uni/
│   ├── #international_relations_s6/
│   ├── #business_admin_s6/
│   ├── #spanish_s6/
│   └── #foreign_policy_s6/
├── #peg/
├── #ipr/
└── #personal/
```

### Smart Monitoring Schedule
- **Night (23:00-06:00):** Hourly checks
- **Morning (06:00-09:00):** 30min intervals  
- **Work (09:00-23:00):** 15min intervals
- **Bedtime (18:00-21:00):** Hourly recommendations

## 🔮 Future Features

### Matter Integration
- **Smart Lights:** Auto-dim 1h before bedtime
- **Wake Lighting:** Sunrise simulation with Whoop alarm
- **Environmental:** Temperature and air quality optimization

### Advanced AI
- **Predictive Health:** Illness detection from patterns
- **Productivity Optimization:** Work/rest cycle recommendations
- **Knowledge Synthesis:** Cross-category insights and suggestions

## 📞 Support

- **Repository:** https://github.com/henriklein/general-auth-app
- **Issues:** Report integration problems or feature requests
- **Documentation:** Comprehensive setup guides for each integration