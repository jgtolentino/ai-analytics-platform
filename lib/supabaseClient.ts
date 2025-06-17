/**
 * Supabase Client Configuration
 * Centralized client with proper environment variable validation
 */

import { createClient } from '@supabase/supabase-js';
import { validateSupabaseEnv } from './assertEnv';

// Validate environment variables on module load
const { url, anonKey, serviceRoleKey } = validateSupabaseEnv();

// Create the main Supabase client (browser + server safe)
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-analytics-platform'
    }
  }
});

// Create service role client for server-side operations (if available)
export const supabaseAdmin = serviceRoleKey ? createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-analytics-platform-admin'
    }
  }
}) : null;

// Client configuration info for debugging
export const clientInfo = {
  url,
  hasAnonKey: !!anonKey,
  hasServiceKey: !!serviceRoleKey,
  timestamp: new Date().toISOString()
};

// Utility function to check client health
export async function checkSupabaseHealth() {
  try {
    const { data, error } = await supabase
      .from('health_check')
      .select('count')
      .limit(1);
      
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (acceptable)
      throw error;
    }
    
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

export default supabase;