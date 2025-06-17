/**
 * Environment variable assertion helper
 * Provides clear error messages for missing environment variables
 */

export function assertEnv(name: string): string {
  const value = process.env[name];
  
  if (!value || value === "") {
    throw new Error(
      `❌ Missing environment variable: ${name}\n` +
      `Please add ${name} to your .env.local file or Vercel environment variables.\n` +
      `See .env.example for required variables.`
    );
  }
  
  return value;
}

/**
 * Validate all required Supabase environment variables
 */
export function validateSupabaseEnv() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return !value || value === "";
  });
  
  if (missingVars.length > 0) {
    throw new Error(
      `❌ Missing required Supabase environment variables:\n` +
      missingVars.map(v => `  - ${v}`).join('\n') + '\n\n' +
      `Add these to your .env.local file:\n` +
      `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n\n` +
      `Or configure them in Vercel environment variables.`
    );
  }
  
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}

/**
 * Development helper to check environment status
 */
export function getEnvStatus() {
  return {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: process.env.NODE_ENV,
    mockDataEnabled: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true'
  };
}