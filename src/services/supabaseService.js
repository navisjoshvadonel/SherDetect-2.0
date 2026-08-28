import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ieeruyttmratjqrmyixz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZXJ1eXR0bXJhdGpxcm15aXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDAzNzksImV4cCI6MjEwMzQ3NjM3OX0.P1CREHddp35xyoGGQ4KuHpSRCCMs5iW6eYqV7qQXoqw';
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_SESSION_KEY = 'sherdetect_admin_session_v2';

export const supabaseService = {
  // Get all submissions (Admin view)
  getSubmissions: async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase read error:', error);
        return [];
      }
      return data.map(mapToCamelCase);
    } catch (err) {
      console.error('Supabase fetch exception:', err);
      return [];
    }
  },

  // Save new user document submission (Public User view)
  createSubmission: async (submissionData) => {
    const trackingId = 'SHER-' + Math.floor(100000 + Math.random() * 900000);
    const newRecord = {
      id: trackingId,
      status: submissionData.riskScore <= 15 ? 'AUTO_VERIFIED' : 'PENDING_ADMIN_CONFIRMATION',
      admin_confirmed: submissionData.riskScore <= 15 ? 'AUTHENTIC' : 'PENDING',
      document_name: submissionData.documentName,
      user_name: submissionData.userName,
      user_email: submissionData.userEmail,
      sector: submissionData.sector,
      risk_score: submissionData.riskScore,
      verdict: submissionData.verdict,
      preview: submissionData.preview,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('submissions')
      .insert([newRecord])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return null;
    }
    
    // Map to camelCase for frontend components
    return mapToCamelCase(data[0]);
  },

  // Update submission status (3rd Level Admin Action)
  updateAdminVerdict: async (id, verdict, adminNotes) => {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status: 'ADMIN_AUDITED',
        admin_confirmed: verdict,
        admin_notes: adminNotes,
        admin_verdict_time: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return null;
    }
    return mapToCamelCase(data[0]);
  },

  // Track ticket for public non-login user
  trackSubmission: async (trackingId) => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .ilike('id', trackingId.trim())
      .single();
      
    if (error) return null;
    return mapToCamelCase(data);
  },

  // Admin Authentication Session (Still Local for simple Demo, could be Supabase Auth later)
  isAdminLoggedIn: () => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  },

  loginAdmin: (passcode) => {
    if (passcode === 'sherdetect2026' || passcode === 'admin123' || passcode === 'admin') {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  },

  logoutAdmin: () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};

// Helper function to map snake_case DB columns back to camelCase for React
function mapToCamelCase(dbObj) {
  if (!dbObj) return dbObj;
  return {
    id: dbObj.id,
    timestamp: dbObj.created_at,
    status: dbObj.status,
    adminConfirmed: dbObj.admin_confirmed,
    documentName: dbObj.document_name,
    userName: dbObj.user_name,
    userEmail: dbObj.user_email,
    sector: dbObj.sector,
    riskScore: dbObj.risk_score,
    verdict: dbObj.verdict,
    preview: dbObj.preview,
    adminNotes: dbObj.admin_notes,
    adminVerdictTime: dbObj.admin_verdict_time
  };
}
