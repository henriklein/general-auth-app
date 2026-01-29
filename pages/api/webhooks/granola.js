// Webhook endpoint for Granola transcription automation
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📝 Granola webhook received:', req.body);

  try {
    const { transcript, metadata, timestamp } = req.body;
    
    if (!transcript) {
      return res.status(400).json({ error: 'Missing transcript data' });
    }

    // Process the transcript
    const processedData = await processTranscript({
      transcript,
      metadata,
      timestamp: timestamp || new Date().toISOString()
    });

    // Save to knowledge base
    await saveToKnowledgeBase(processedData);

    // Send notification to Arthur's system
    await notifyArthur(processedData);

    return res.status(200).json({
      success: true,
      message: 'Transcript processed successfully',
      category: processedData.category,
      summary: processedData.summary
    });

  } catch (error) {
    console.error('Granola webhook error:', error);
    
    return res.status(500).json({
      error: 'Transcript processing failed',
      details: error.message
    });
  }
}

async function processTranscript(data) {
  const { transcript, metadata, timestamp } = data;
  
  // Analyze content for categorization
  const category = categorizeContent(transcript, metadata);
  
  // Extract key information
  const summary = extractSummary(transcript);
  const actionItems = extractActionItems(transcript);
  const participants = extractParticipants(transcript, metadata);
  
  // Generate filename
  const date = new Date(timestamp).toISOString().split('T')[0];
  const title = generateTitle(transcript, metadata);
  const filename = `${date}_${title}.md`;
  
  return {
    category,
    filename,
    content: {
      metadata: {
        timestamp,
        participants,
        source: 'granola',
        category
      },
      summary,
      actionItems,
      fullTranscript: transcript
    }
  };
}

function categorizeContent(transcript, metadata) {
  const content = transcript.toLowerCase();
  const title = (metadata?.title || '').toLowerCase();
  const participants = (metadata?.participants || []).join(' ').toLowerCase();
  
  // University categories (semester 6)
  if (content.includes('international relations') || content.includes('foreign policy') || 
      title.includes('ir ') || title.includes('foreign policy')) {
    return '#uni/#international_relations_s6';
  }
  
  if (content.includes('business administration') || content.includes('business admin') ||
      title.includes('business') || content.includes('marketing') || content.includes('finance')) {
    return '#uni/#business_admin_s6';
  }
  
  if (content.includes('spanish') || content.includes('español') || 
      title.includes('spanish') || content.includes('language class')) {
    return '#uni/#spanish_s6';
  }
  
  if (content.includes('foreign policy') || content.includes('policy analysis') ||
      title.includes('policy')) {
    return '#uni/#foreign_policy_s6';
  }
  
  // Work categories
  if (participants.includes('pure energy') || content.includes('pure energy') ||
      content.includes('peg') || title.includes('pure energy')) {
    return '#peg';
  }
  
  // International Policy Review
  if (content.includes('policy review') || content.includes('ipr') ||
      content.includes('international policy') || title.includes('policy review')) {
    return '#ipr';
  }
  
  // Default to university if seems academic
  if (content.includes('professor') || content.includes('lecture') || 
      content.includes('assignment') || content.includes('exam')) {
    return '#uni/#general_s6';
  }
  
  // Default to personal
  return '#personal';
}

function extractSummary(transcript) {
  // Simple extractive summary (first few sentences + key points)
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const summary = sentences.slice(0, 3).join('. ').trim() + '.';
  
  // Add key topics if available
  const keyTopics = extractKeyTopics(transcript);
  if (keyTopics.length > 0) {
    return summary + '\n\n**Key Topics:** ' + keyTopics.join(', ');
  }
  
  return summary;
}

function extractKeyTopics(transcript) {
  const topics = [];
  const content = transcript.toLowerCase();
  
  // University topics
  if (content.includes('international relations')) topics.push('International Relations');
  if (content.includes('foreign policy')) topics.push('Foreign Policy');
  if (content.includes('business')) topics.push('Business');
  if (content.includes('marketing')) topics.push('Marketing');
  if (content.includes('spanish')) topics.push('Spanish');
  
  // Work topics
  if (content.includes('pure energy')) topics.push('Pure Energy Germany');
  if (content.includes('solar')) topics.push('Solar Energy');
  if (content.includes('project')) topics.push('Project Management');
  
  return topics;
}

function extractActionItems(transcript) {
  const actionItems = [];
  const lines = transcript.split('\n');
  
  // Look for action-oriented phrases
  const actionPatterns = [
    /need to (.*)/gi,
    /should (.*)/gi,
    /must (.*)/gi,
    /action.*?:(.*)/gi,
    /todo.*?:(.*)/gi,
    /follow up (.*)/gi,
    /remember to (.*)/gi
  ];
  
  lines.forEach(line => {
    actionPatterns.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        actionItems.push(matches[0].trim());
      }
    });
  });
  
  return actionItems;
}

function extractParticipants(transcript, metadata) {
  if (metadata?.participants) {
    return metadata.participants;
  }
  
  // Simple speaker detection
  const speakerPattern = /([A-Z][a-z]+):/g;
  const speakers = new Set();
  let match;
  
  while ((match = speakerPattern.exec(transcript)) !== null) {
    speakers.add(match[1]);
  }
  
  return Array.from(speakers);
}

function generateTitle(transcript, metadata) {
  if (metadata?.title) {
    return metadata.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }
  
  // Generate from first few words
  const words = transcript.split(' ').slice(0, 5).join('_');
  return words.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
}

async function saveToKnowledgeBase(processedData) {
  // This would integrate with your file system
  // For now, just log the structure
  console.log('💾 Saving to knowledge base:', {
    category: processedData.category,
    filename: processedData.filename,
    summary: processedData.content.summary
  });
  
  // TODO: Implement file saving to knowledge-base directory
}

async function notifyArthur(processedData) {
  // This would send a notification to Arthur's monitoring system
  console.log('📢 Notifying Arthur:', {
    type: 'granola_transcript',
    category: processedData.category,
    summary: processedData.content.summary,
    actionItems: processedData.content.actionItems.length
  });
  
  // TODO: Integrate with Arthur's notification system
}